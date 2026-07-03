const db = require('../db/database.js');

// INSERT OR IGNORE makes re-subscribing with the same email a harmless no-op
// (the UNIQUE constraint on email is respected without throwing).
const insertSubscriber = db.prepare(
  'INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)'
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /newsletter (public) — add an email to the subscriber list.
function subscribe(req, res, next) {
  try {
    const email = (req.body.email || '').trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const info = insertSubscriber.run(email);
    const alreadySubscribed = info.changes === 0;

    res.status(201).json({
      message: alreadySubscribed
        ? "You're already on the list — thanks for your enthusiasm!"
        : "You're subscribed! Watch your inbox for green goodness.",
      alreadySubscribed,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe };
