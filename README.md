# Lorenzo - La Hora

Una aplicación web sencilla donde Lorenzo te dice la hora exacta cuando presionas el botón.

## Características

- Interfaz simple y atractiva
- Lorenzo (personaje SVG detallado) que "dice" la hora en un bocadillo de cómic
- Muestra la hora en formato HH:MM:SS
- Diseño responsive
- Servidor Express.js para soportar alto tráfico
- Endpoint GET para stress testing

## Archivos

- `server.js` - Servidor Express.js
- `package.json` - Dependencias Node.js
- `public/index.html` - Estructura HTML
- `public/styles.css` - Estilos CSS
- `public/script.js` - Lógica JavaScript
- `Dockerfile` - Configuración para containerización

## Despliegue en Cloud Run

### Prerrequisitos

- Google Cloud SDK instalado
- Proyecto de Google Cloud configurado
- Docker instalado (opcional, para probar localmente)
- Node.js instalado (para desarrollo local)

### Instalación local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar el servidor:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:8080
   ```

### Pasos para desplegar

1. **Construir la imagen Docker:**
   ```bash
   docker build -t lorenzo-hora .
   ```

2. **Probar localmente (opcional):**
   ```bash
   docker run -p 8080:8080 lorenzo-hora
   ```
   Luego abre http://localhost:8080 en tu navegador

3. **Subir a Google Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/[TU-PROYECTO-ID]/lorenzo-hora
   ```

4. **Desplegar en Cloud Run:**
   ```bash
   gcloud run deploy lorenzo-hora \
     --image gcr.io/[TU-PROYECTO-ID]/lorenzo-hora \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

   Reemplaza `[TU-PROYECTO-ID]` con el ID de tu proyecto de Google Cloud.

### Alternativa: Despliegue directo desde código fuente

También puedes desplegar directamente desde el código fuente:

```bash
gcloud run deploy lorenzo-hora \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Stress Testing

Una vez desplegado en Cloud Run, puedes hacer stress testing para simular mucho tráfico. Aquí tienes varias opciones:

### Opción 1: Usando Apache Bench (ab)

```bash
# Instalar Apache Bench (en Ubuntu/Debian)
sudo apt-get install apache2-utils

# Ejecutar 1000 requests con 10 conexiones concurrentes
ab -n 1000 -c 10 https://[TU-URL-CLOUD-RUN]/
```

### Opción 2: Usando wrk

```bash
# Instalar wrk
# En macOS: brew install wrk
# En Ubuntu: sudo apt-get install wrk

# Ejecutar durante 30 segundos con 10 threads y 10 conexiones
wrk -t10 -c10 -d30s https://[TU-URL-CLOUD-RUN]/
```

### Opción 3: Usando hey

```bash
# Instalar hey
# En macOS: brew install hey
# En Linux: go install github.com/rakyll/hey@latest

# Ejecutar 1000 requests con 50 workers
hey -n 1000 -c 50 https://[TU-URL-CLOUD-RUN]/
```

### Opción 4: Usando curl en bucle (simple)

```bash
# En PowerShell (Windows)
for ($i=1; $i -le 100; $i++) { curl https://[TU-URL-CLOUD-RUN]/ }

# En Bash (Linux/Mac)
for i in {1..100}; do curl https://[TU-URL-CLOUD-RUN]/; done
```

### Opción 5: Usando k6 (recomendado para pruebas avanzadas)

```bash
# Instalar k6
# En macOS: brew install k6
# En Linux: https://k6.io/docs/getting-started/installation/

# Crear un archivo test.js:
# export default function() {
#   http.get('https://[TU-URL-CLOUD-RUN]/');
# }

# Ejecutar con 10 usuarios virtuales durante 30 segundos
k6 run --vus 10 --duration 30s test.js
```

### Ejemplo de comando completo

Si tu URL de Cloud Run es `https://lorenzo-hora-xxxxx-uc.a.run.app`, puedes usar:

```bash
# Con Apache Bench - probar la página principal
ab -n 5000 -c 50 https://lorenzo-hora-xxxxx-uc.a.run.app/

# Con Apache Bench - probar el endpoint de tiempo
ab -n 5000 -c 50 https://lorenzo-hora-xxxxx-uc.a.run.app/time

# Con wrk - página principal
wrk -t12 -c100 -d60s https://lorenzo-hora-xxxxx-uc.a.run.app/

# Con wrk - endpoint de tiempo
wrk -t12 -c100 -d60s https://lorenzo-hora-xxxxx-uc.a.run.app/time

# Con hey - página principal
hey -n 10000 -c 100 https://lorenzo-hora-xxxxx-uc.a.run.app/

# Con hey - endpoint de tiempo
hey -n 10000 -c 100 https://lorenzo-hora-xxxxx-uc.a.run.app/time
```

**Nota:** Asegúrate de reemplazar `[TU-URL-CLOUD-RUN]` con la URL real que Cloud Run te proporcione después del despliegue.

### Monitoreo de Métricas durante Stress Testing

Mientras ejecutas el stress testing, puedes monitorear las métricas en tiempo real usando el endpoint `/metrics`:

**En Linux/Mac:**
```bash
# Terminal 1: Ejecutar stress test
ab -n 5000 -c 50 https://lorenzo-hora-xxxxx-uc.a.run.app/time

# Terminal 2: Monitorear métricas cada segundo
watch -n 1 'curl -s https://lorenzo-hora-xxxxx-uc.a.run.app/metrics | jq'
```

**En PowerShell (Windows):**
```powershell
# Terminal 1: Ejecutar stress test
ab -n 5000 -c 50 https://lorenzo-hora-xxxxx-uc.a.run.app/time

# Terminal 2: Monitorear métricas cada segundo
while($true) { 
    Write-Host "=== Métricas ===" -ForegroundColor Green
    curl -s https://lorenzo-hora-xxxxx-uc.a.run.app/metrics | ConvertFrom-Json | Format-List
    Start-Sleep -Seconds 1
    Clear-Host
}
```

**Ver métricas una sola vez:**
```bash
curl https://lorenzo-hora-xxxxx-uc.a.run.app/metrics
```

El endpoint `/metrics` te mostrará:
- **uptime**: Tiempo de actividad del servidor en segundos
- **totalRequests**: Total de requests procesados desde el inicio
- **requestsPerSecond**: Promedio de requests por segundo
- **timestamp**: Timestamp de cuando se generaron las métricas

## Uso

1. Abre la aplicación web
2. Haz clic en el botón "What time is it, Lorenzo?"
3. Lorenzo mostrará la hora actual en un bocadillo de cómic
4. El bocadillo desaparecerá automáticamente después de 5 segundos

## Endpoints

- `GET /` - Página principal con Lorenzo
- `GET /time` - Obtiene la hora actual en formato JSON
  ```json
  {
    "time": "14:30:45",
    "timestamp": "2024-11-22T14:30:45.123Z",
    "message": "Lorenzo says the time!"
  }
  ```
- `GET /health` - Health check endpoint (retorna status OK)
- `GET /metrics` - Métricas y estadísticas del servidor (útil para monitoreo y stress testing)
  ```json
  {
    "uptime": 3600,
    "totalRequests": 15000,
    "requestsPerSecond": "4.17",
    "timestamp": "2024-11-22T14:30:45.123Z"
  }
  ```

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- SVG para el personaje (Lorenzo con sombrero, bigote y corbata)
- Node.js + Express.js (servidor web)
- Docker
