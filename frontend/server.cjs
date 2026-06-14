// Production static server for the built SPA. No NGINX: a tiny Express server
// serves the Vite `dist/` output, exposes /healthz, and falls back to
// index.html for client-side routing.
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const distDir = path.join(__dirname, 'dist');

// Health check used by Kubernetes/OpenShift probes.
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static assets.
app.use(express.static(distDir));

// SPA fallback: send index.html for any non-asset route.
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`frontend static server listening on port ${port}`);
});
