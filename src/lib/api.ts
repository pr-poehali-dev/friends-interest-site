const BASE = "https://functions.poehali.dev/f8b81939-c34a-4405-af0b-3a881e63d05d";

const ME_ID = 1; // текущий пользователь

async function get(action: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${BASE}?${qs}`);
  return res.json();
}

async function post(action: string, data: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function put(action: string, data: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}?action=${action}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const api = {
  ME_ID,

  users: {
    list: () => get('users'),
    get: (id: number) => get('users', { id: String(id) }),
    updateProfile: (name: string, status_text: string, bio: string) =>
      put('profile', { user_id: ME_ID, name, status_text, bio }),
  },

  posts: {
    list: (author_id?: number) =>
      get('posts', author_id ? { author_id: String(author_id) } : {}),
    create: (text: string) => post('posts', { author_id: ME_ID, text }),
    like: (post_id: number) => post('like-post', { post_id }),
  },

  groupChat: {
    list: () => get('group-messages'),
    send: (text: string) => post('group-messages', { author_id: ME_ID, text }),
  },

  directChat: {
    list: (to_id: number) => get('direct-messages', { from_id: String(ME_ID), to_id: String(to_id) }),
    send: (to_id: number, text: string) => post('direct-messages', { from_id: ME_ID, to_id, text }),
  },

  gallery: {
    list: (author_id?: number) =>
      get('gallery', author_id ? { author_id: String(author_id) } : {}),
    like: (photo_id: number) => post('like-photo', { photo_id }),
  },

  invites: {
    list: () => get('invites', { user_id: String(ME_ID) }),
    create: (note: string) => post('invites', { user_id: ME_ID, note }),
  },
};
