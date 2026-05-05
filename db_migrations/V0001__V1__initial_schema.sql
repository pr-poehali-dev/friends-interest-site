
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '😊',
  role TEXT DEFAULT 'Участник орбиты',
  bio TEXT DEFAULT '',
  status_text TEXT DEFAULT '',
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invites
CREATE TABLE invites (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  note TEXT DEFAULT '',
  created_by INTEGER REFERENCES users(id),
  used_by INTEGER REFERENCES users(id),
  used_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts (feed)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Post likes
CREATE TABLE post_likes (
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (post_id, user_id)
);

-- Group chat messages
CREATE TABLE group_messages (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Direct messages
CREATE TABLE direct_messages (
  id SERIAL PRIMARY KEY,
  from_id INTEGER REFERENCES users(id),
  to_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery
CREATE TABLE gallery_photos (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  emoji TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed demo users
INSERT INTO users (name, emoji, role, bio, status_text, is_online) VALUES
  ('Алина',  '🌸', 'Фотограф',        'Снимаю красоту каждого момента. Люблю закаты, кофе и интересных людей.',     'Слушает музыку 🎵', TRUE),
  ('Дима',   '⚡',  'Путешественник',  'Всегда в движении. Уже был в 23 странах, цель — 50.',                         'За городом 🌲',     TRUE),
  ('Катя',   '✨',  'Художник',        'Рисую маслом и акварелью. Каждая картина — маленькая история.',               'Спит 😴',           FALSE),
  ('Максим', '🎮',  'Геймер',          'Speedrunner. Побил три мировых рекорда в инди-играх.',                        'Играет в игры',     TRUE),
  ('Соня',   '🎨',  'Дизайнер',        'Создаю интерфейсы которые хочется трогать.',                                  '',                  FALSE),
  ('Рома',   '🎸',  'Музыкант',        'Играю в группе, пишу свои треки.',                                            '',                  FALSE);

-- Seed posts
INSERT INTO posts (author_id, text, likes) VALUES
  (1, 'Сегодня такой закат — словно кто-то разлил малиновое варенье по небу 🌅', 8),
  (2, 'Нашёл идеальное место для пикника. Кто со мной в эти выходные? 🌿', 5),
  (4, 'Прошёл финального босса после 6 часов мучений. Я ПОБЕДИЛ 🏆', 12),
  (3, 'Закончила новый холст. Три недели работы — и всё равно хочу переделать угол 😅', 19),
  (2, 'Алтай — это просто космос. Фото не передают 🏔️', 22);

-- Seed group messages
INSERT INTO group_messages (author_id, text) VALUES
  (1, 'Привет всем! Как дела? 🌸'),
  (2, 'Отлично! Только вернулся с гор 🏔️'),
  (4, 'Топ! Нам надо собраться в эти выходные'),
  (1, 'Да, я свободна в субботу 🎉'),
  (3, 'Возьмём гитару, сделаем костёр 🔥');

-- Seed gallery
INSERT INTO gallery_photos (author_id, emoji, title, likes) VALUES
  (1, '🌅', 'Закат в Питере',    12),
  (2, '🏔️', 'Алтай, пик 3200м', 22),
  (3, '🎨', 'Новый холст',       19),
  (2, '🌿', 'Место для пикника', 8),
  (6, '🎸', 'Репетиция',         6),
  (1, '🌸', 'Весна пришла',      17),
  (4, '🎮', 'Финальный босс',    11),
  (5, '☕', 'Утренний кофе',     9),
  (2, '🌊', 'Байкал ночью',      31);

-- Seed invites
INSERT INTO invites (code, note, created_by) VALUES
  ('ORBIT-7X2K9', 'Для Лены',  1),
  ('ORBIT-9N4WV', 'Для Пети',  1);
