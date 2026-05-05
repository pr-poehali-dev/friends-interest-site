import json
import os
import psycopg2
import random

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def ok(data):
    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, code=400):
    return {'statusCode': code, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def esc(s):
    return str(s).replace("'", "''")

def handler(event: dict, context) -> dict:
    """Главный API Орбиты: users, posts, group-chat, direct-messages, gallery, invites"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── USERS ──────────────────────────────────────────────
        if action == 'users' and method == 'GET':
            uid = qs.get('id', '')
            if uid:
                cur.execute("""
                    SELECT id, name, emoji, role, bio, status_text, is_online,
                           (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as posts_count,
                           (SELECT COUNT(*) FROM gallery_photos WHERE author_id = u.id) as photos_count
                    FROM users u WHERE id = %s
                """ % int(uid))
                row = cur.fetchone()
                if not row:
                    return err('Not found', 404)
                cols = ['id','name','emoji','role','bio','status_text','is_online','posts_count','photos_count']
                return ok(dict(zip(cols, row)))
            cur.execute("""
                SELECT id, name, emoji, role, bio, status_text, is_online,
                       (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as posts_count,
                       (SELECT COUNT(*) FROM gallery_photos WHERE author_id = u.id) as photos_count
                FROM users u ORDER BY is_online DESC, name
            """)
            rows = cur.fetchall()
            cols = ['id','name','emoji','role','bio','status_text','is_online','posts_count','photos_count']
            return ok([dict(zip(cols, r)) for r in rows])

        # ── PROFILE UPDATE ─────────────────────────────────────
        if action == 'profile' and method == 'PUT':
            user_id = int(body.get('user_id', 1))
            name = esc(body.get('name', ''))
            status_text = esc(body.get('status_text', ''))
            bio = esc(body.get('bio', ''))
            cur.execute("UPDATE users SET name='%s', status_text='%s', bio='%s' WHERE id=%s" % (name, status_text, bio, user_id))
            conn.commit()
            return ok({'success': True})

        # ── POSTS ──────────────────────────────────────────────
        if action == 'posts' and method == 'GET':
            author_id = qs.get('author_id', '')
            where = 'AND p.author_id = %s' % int(author_id) if author_id else ''
            cur.execute("""
                SELECT p.id, p.text, p.likes, p.created_at,
                       u.id as author_id, u.name as author_name, u.emoji as author_emoji
                FROM posts p JOIN users u ON u.id = p.author_id
                WHERE 1=1 %s ORDER BY p.created_at DESC LIMIT 50
            """ % where)
            rows = cur.fetchall()
            cols = ['id','text','likes','created_at','author_id','author_name','author_emoji']
            return ok([dict(zip(cols, r)) for r in rows])

        if action == 'posts' and method == 'POST':
            author_id = int(body.get('author_id', 1))
            text = body.get('text', '').strip()
            if not text:
                return err('Text required')
            cur.execute("INSERT INTO posts (author_id, text) VALUES (%s, '%s') RETURNING id, text, likes, created_at" % (author_id, esc(text)))
            row = cur.fetchone()
            conn.commit()
            cur.execute("SELECT name, emoji FROM users WHERE id = %s" % author_id)
            u = cur.fetchone()
            return ok({'id': row[0], 'text': row[1], 'likes': row[2], 'created_at': str(row[3]),
                       'author_id': author_id, 'author_name': u[0], 'author_emoji': u[1]})

        if action == 'like-post' and method == 'POST':
            post_id = int(body.get('post_id', 0))
            cur.execute("UPDATE posts SET likes = likes + 1 WHERE id = %s RETURNING likes" % post_id)
            row = cur.fetchone()
            conn.commit()
            return ok({'likes': row[0]})

        # ── GROUP CHAT ─────────────────────────────────────────
        if action == 'group-messages' and method == 'GET':
            cur.execute("""
                SELECT m.id, m.text, m.created_at,
                       u.id as author_id, u.name as author_name, u.emoji as author_emoji
                FROM group_messages m JOIN users u ON u.id = m.author_id
                ORDER BY m.created_at ASC LIMIT 100
            """)
            rows = cur.fetchall()
            cols = ['id','text','created_at','author_id','author_name','author_emoji']
            return ok([dict(zip(cols, r)) for r in rows])

        if action == 'group-messages' and method == 'POST':
            author_id = int(body.get('author_id', 1))
            text = body.get('text', '').strip()
            if not text:
                return err('Text required')
            cur.execute("INSERT INTO group_messages (author_id, text) VALUES (%s, '%s') RETURNING id, created_at" % (author_id, esc(text)))
            row = cur.fetchone()
            conn.commit()
            cur.execute("SELECT name, emoji FROM users WHERE id = %s" % author_id)
            u = cur.fetchone()
            return ok({'id': row[0], 'text': text, 'created_at': str(row[1]),
                       'author_id': author_id, 'author_name': u[0], 'author_emoji': u[1]})

        # ── DIRECT MESSAGES ────────────────────────────────────
        if action == 'direct-messages' and method == 'GET':
            from_id = int(qs.get('from_id', 1))
            to_id = int(qs.get('to_id', 2))
            cur.execute("""
                SELECT m.id, m.text, m.created_at, m.from_id, m.to_id,
                       u.name as from_name, u.emoji as from_emoji
                FROM direct_messages m JOIN users u ON u.id = m.from_id
                WHERE (m.from_id = %s AND m.to_id = %s) OR (m.from_id = %s AND m.to_id = %s)
                ORDER BY m.created_at ASC
            """ % (from_id, to_id, to_id, from_id))
            rows = cur.fetchall()
            cols = ['id','text','created_at','from_id','to_id','from_name','from_emoji']
            return ok([dict(zip(cols, r)) for r in rows])

        if action == 'direct-messages' and method == 'POST':
            from_id = int(body.get('from_id', 1))
            to_id = int(body.get('to_id', 2))
            text = body.get('text', '').strip()
            if not text:
                return err('Text required')
            cur.execute("INSERT INTO direct_messages (from_id, to_id, text) VALUES (%s, %s, '%s') RETURNING id, created_at" % (from_id, to_id, esc(text)))
            row = cur.fetchone()
            conn.commit()
            return ok({'id': row[0], 'text': text, 'created_at': str(row[1]), 'from_id': from_id, 'to_id': to_id})

        # ── GALLERY ────────────────────────────────────────────
        if action == 'gallery' and method == 'GET':
            author_id = qs.get('author_id', '')
            where = 'AND g.author_id = %s' % int(author_id) if author_id else ''
            cur.execute("""
                SELECT g.id, g.emoji, g.title, g.likes, g.created_at,
                       u.id as author_id, u.name as author_name
                FROM gallery_photos g JOIN users u ON u.id = g.author_id
                WHERE 1=1 %s ORDER BY g.created_at DESC
            """ % where)
            rows = cur.fetchall()
            cols = ['id','emoji','title','likes','created_at','author_id','author_name']
            return ok([dict(zip(cols, r)) for r in rows])

        if action == 'like-photo' and method == 'POST':
            photo_id = int(body.get('photo_id', 0))
            cur.execute("UPDATE gallery_photos SET likes = likes + 1 WHERE id = %s RETURNING likes" % photo_id)
            row = cur.fetchone()
            conn.commit()
            return ok({'likes': row[0]})

        # ── INVITES ────────────────────────────────────────────
        if action == 'invites' and method == 'GET':
            user_id = int(qs.get('user_id', 1))
            cur.execute("""
                SELECT i.id, i.code, i.note, i.used_by, i.used_at, i.expires_at, i.created_at,
                       u.name as used_by_name
                FROM invites i LEFT JOIN users u ON u.id = i.used_by
                WHERE i.created_by = %s ORDER BY i.created_at DESC
            """ % user_id)
            rows = cur.fetchall()
            cols = ['id','code','note','used_by','used_at','expires_at','created_at','used_by_name']
            return ok([dict(zip(cols, r)) for r in rows])

        if action == 'invites' and method == 'POST':
            user_id = int(body.get('user_id', 1))
            note = body.get('note', '').strip() or 'Без заметки'
            cur.execute("SELECT COUNT(*) FROM invites WHERE created_by = %s" % user_id)
            count = cur.fetchone()[0]
            if count >= 5:
                return err('Лимит инвайтов достигнут (5 шт)')
            chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
            code = 'ORBIT-' + ''.join(random.choices(chars, k=5))
            cur.execute("INSERT INTO invites (code, note, created_by) VALUES ('%s', '%s', %s) RETURNING id, code, created_at, expires_at" % (code, esc(note), user_id))
            row = cur.fetchone()
            conn.commit()
            return ok({'id': row[0], 'code': row[1], 'note': note, 'created_at': str(row[2]), 'expires_at': str(row[3]), 'used_by': None})

        return err('Not found', 404)

    finally:
        cur.close()
        conn.close()
