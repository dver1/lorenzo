const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 8080;

// ─────────────────────────────────────────────────────────────
// Prometheus metrics setup
// ─────────────────────────────────────────────────────────────
const register = client.register;
client.collectDefaultMetrics();

const totalRequests = new client.Counter({
  name: 'lorenzo_total_requests',
  help: 'Total de peticiones recibidas'
});

const uptimeGauge = new client.Gauge({
  name: 'lorenzo_uptime_seconds',
  help: 'Tiempo de actividad en segundos'
});

// Middleware para contar requests y actualizar métricas
app.use((req, res, next) => {
  totalRequests.inc();
  uptimeGauge.set(process.uptime());
  next();
});

// ─────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check para Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lorenzo is ready!' });
});

// Hora actual
app.get('/time', (req, res) => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  res.status(200).json({
    time: timeString,
    timestamp: now.toISOString(),
    message: 'Lorenzo says the time!'
  });
});

// Endpoint de métricas en formato Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ─────────────────────────────────────────────────────────────
// Arranque del servidor
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Lorenzo server is running on port ${PORT}`);
  console.log(`Endpoints available:`);
  console.log(`  GET / - Página principal`);
  console.log(`  GET /time - Obtener la hora`);
  console.log(`  GET /health - Health check`);
  console.log(`  GET /metrics - Métricas Prometheus`);
});