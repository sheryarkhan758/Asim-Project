const db = require('../db/database.js');

const insertMessage = db.prepare(
  'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /contact (public) — store a contact-form submission.
function createMessage(req, res, next) {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const subject = (req.body.subject || '').trim();
    const message = (req.body.message || '').trim();

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const info = insertMessage.run(name, email, subject || null, message);
    res.status(201).json({
      message: "Thanks for reaching out — we'll be in touch soon.",
      message_id: info.lastInsertRowid,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMessage };
