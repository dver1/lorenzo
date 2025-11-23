FROM prom/prometheus:v2.55.0

# Copiamos la configuración principal
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Cloud Run expone el puerto 8080 por defecto, así que ajustamos Prometheus
CMD ["prometheus", "--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus", "--web.listen-address=:8080"]