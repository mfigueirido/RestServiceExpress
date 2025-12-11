const app = require('./app');

const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Connect to DB asynchronously (keep the UI available)
connectDB().catch(err => {
  console.error(
    'DB connection error (app is running without DB):',
    err && err.message ? err.message : err
  );
});
