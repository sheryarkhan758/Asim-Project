import api from './client.js';

// POST /newsletter (public) — subscribe an email to the newsletter.
// Payload: { email } -> { message, alreadySubscribed }
export function subscribeNewsletter(email) {
  return api.post('/newsletter', { email }).then((res) => res.data);
}
