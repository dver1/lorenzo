// Script de ejemplo para k6 stress testing
// Instalar k6: https://k6.io/docs/getting-started/installation/
// Ejecutar: k6 run --vus 10 --duration 30s k6-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Ramp up a 10 usuarios
    { duration: '30s', target: 50 },   // Subir a 50 usuarios
    { duration: '20s', target: 100 },  // Subir a 100 usuarios
    { duration: '30s', target: 100 },  // Mantener 100 usuarios
    { duration: '10s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests deben ser < 500ms
    http_req_failed: ['rate<0.01'],   // Menos del 1% de errores
  },
};

// Reemplaza esta URL con tu URL de Cloud Run
const BASE_URL = 'https://TU-URL-CLOUD-RUN.a.run.app';

export default function () {
  // Hacer request al endpoint principal (página web)
  const pageResponse = http.get(BASE_URL);
  
  // Hacer request al endpoint de tiempo
  const timeResponse = http.get(`${BASE_URL}/time`);
  
  // Verificar que las respuestas sean exitosas
  check(pageResponse, {
    'page status is 200': (r) => r.status === 200,
    'page response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  check(timeResponse, {
    'time endpoint status is 200': (r) => r.status === 200,
    'time endpoint has time field': (r) => {
      try {
        const json = JSON.parse(r.body);
        return json.time !== undefined;
      } catch {
        return false;
      }
    },
    'time endpoint response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Pequeña pausa entre requests
  sleep(1);
}

