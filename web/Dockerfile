FROM nginx:alpine

# Copia tu contenido estático
COPY index.html /usr/share/nginx/html

# Cambia la configuración de Nginx para usar el puerto 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Expón el puerto 8080 (Cloud Run lo espera)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]