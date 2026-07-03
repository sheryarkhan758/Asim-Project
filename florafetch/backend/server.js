require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// --- Global middleware ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded review/plant photos so photo_url ("/uploads/<file>") resolves.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API router (everything is mounted under /api/v1) ---
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/auth', require('./routes/auth.js'));
apiRouter.use('/categories', require('./routes/categories.js'));
apiRouter.use('/plants', require('./routes/plants.js'));
apiRouter.use('/cart', require('./routes/cart.js'));
apiRouter.use('/orders', require('./routes/orders.js'));
apiRouter.use('/reviews', require('./routes/reviews.js'));
apiRouter.use('/admin', require('./routes/admin.js'));
apiRouter.use('/contact', require('./routes/contact.js'));
apiRouter.use('/newsletter', require('./routes/newsletter.js'));

app.use('/api/v1', apiRouter);

// --- 404 handler for unmatched routes ---
app.use((req, res, next) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

// --- Central error-handling middleware ---
// Any route can `next(err)` with an optional err.status / err.statusCode.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Multer upload errors (e.g. file too large) are client errors.
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? 'Internal server error' : err.message || 'Request failed';

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`FloraFetch API listening on http://localhost:${PORT}/api/v1`);
});

module.exports = app;
