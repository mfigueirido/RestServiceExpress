const fileSystem = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PORT_HTTP = parseInt(process.env.PORT_HTTP, 10) || 80;
const HOST = process.env.HOST || '0.0.0.0';

// SSL paths from env (absolute or relative to project root)
const SSL_KEY_PATH = process.env.SSL_KEY_PATH && path.resolve(process.env.SSL_KEY_PATH);
const SSL_CERT_PATH = process.env.SSL_CERT_PATH && path.resolve(process.env.SSL_CERT_PATH);
// Alternative: a PFX bundle (useful on Windows where you can export a PFX via PowerShell)
const SSL_PFX_PATH = process.env.SSL_PFX_PATH && path.resolve(process.env.SSL_PFX_PATH);
const SSL_PFX_PASSPHRASE = process.env.SSL_PFX_PASSPHRASE || process.env.SSL_PFX_PASS || null;

function startHttpServer() {
  const server = http.createServer(app).listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(`HTTP server running (pid=${process.pid}) on`, addr);
  });
  return server;
}

function startHttpsServer(keyPath, certPath, pfxPath, pfxPass) {
  const options = {};

  if (keyPath && certPath && fileSystem.existsSync(keyPath) && fileSystem.existsSync(certPath)) {
    options.key = fileSystem.readFileSync(keyPath);
    options.cert = fileSystem.readFileSync(certPath);
  } else if (pfxPath && fileSystem.existsSync(pfxPath)) {
    options.pfx = fileSystem.readFileSync(pfxPath);
    if (pfxPass) options.passphrase = pfxPass;
  } else {
    throw new Error('No valid key/cert or pfx provided');
  }

  const httpsServer = https.createServer(options, app).listen(PORT, HOST, () => {
    const addr = httpsServer.address();
    console.log(`HTTPS server running (pid=${process.pid}) on`, addr);
  });

  // Start an HTTP server that redirects to HTTPS
  const redirectServer = http
    .createServer((req, res) => {
      const hostHeader = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
      const targetPort = PORT === 443 ? '' : `:${PORT}`;
      const location = `https://${hostHeader}${targetPort}${req.url}`;
      res.writeHead(301, { Location: location });
      res.end();
    })
    .listen(PORT_HTTP, HOST, () => {
      console.log(`HTTP -> HTTPS redirect running on http://${HOST}:${PORT_HTTP}`);
    });

  return { httpsServer, redirectServer };
}

// Start HTTP server immediately so Swagger/UI is reachable while DB connects.
// If TLS is available we'll start HTTPS as well (with redirect).

let servers;

const havePem =
  SSL_KEY_PATH &&
  SSL_CERT_PATH &&
  fileSystem.existsSync(SSL_KEY_PATH) &&
  fileSystem.existsSync(SSL_CERT_PATH);

const havePfx = SSL_PFX_PATH && fileSystem.existsSync(SSL_PFX_PATH);

if (havePem || havePfx) {
  console.log(
    'Starting HTTPS + HTTP->HTTPS redirect using certs:',
    havePem ? `${SSL_CERT_PATH} / ${SSL_KEY_PATH}` : SSL_PFX_PATH
  );
  servers = startHttpsServer(SSL_KEY_PATH, SSL_CERT_PATH, SSL_PFX_PATH, SSL_PFX_PASSPHRASE);
} else {
  if ((SSL_KEY_PATH || SSL_CERT_PATH || SSL_PFX_PATH) && !havePem && !havePfx) {
    console.warn('SSL path(s) provided but files not found. Falling back to HTTP.');
  }
  servers = { httpServer: startHttpServer() };
}

// Connect to DB asynchronously (keep the UI available)
connectDB().catch(err => {
  console.error(
    'DB connection error (app is running without DB):',
    err && err.message ? err.message : err
  );
});

module.exports = servers;
