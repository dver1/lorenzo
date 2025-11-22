const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint GET principal que sirve la página
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint para Cloud Run
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Lorenzo is ready!' });
});

// Endpoint GET para obtener la hora actual
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

// Endpoint para métricas y estadísticas (útil para stress testing)
let requestCount = 0;
let startTime = Date.now();

app.get('/metrics', (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const requestsPerSecond = requestCount / (uptime || 1);
    
    res.status(200).json({
        uptime: uptime,
        totalRequests: requestCount,
        requestsPerSecond: requestsPerSecond.toFixed(2),
        timestamp: new Date().toISOString()
    });
});

// Middleware para contar requests
app.use((req, res, next) => {
    requestCount++;
    next();
});

app.listen(PORT, () => {
    console.log(`Lorenzo server is running on port ${PORT}`);
    console.log(`Endpoints available:`);
    console.log(`  GET / - Página principal`);
    console.log(`  GET /time - Obtener la hora`);
    console.log(`  GET /health - Health check`);
    console.log(`  GET /metrics - Métricas y estadísticas`);
});

