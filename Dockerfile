# Usar una imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json ./
RUN npm install --production

# Copiar archivos de la aplicación
COPY server.js ./
COPY public ./public

# Exponer el puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Iniciar el servidor
CMD ["node", "server.js"]


