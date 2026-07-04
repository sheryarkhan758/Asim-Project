import api from './client.js';

// POST /contact (public), submit a contact-form message.
// Payload: { name, email, subject?, message } -> { message, message_id }
export function sendContactMessage(payload) {
  return api.post('/contact', payload).then((res) => res.data);
}
