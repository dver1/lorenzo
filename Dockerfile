# Usar una imagen base de Node.js
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --only=production


# Copiar archivos de la aplicación
COPY web/public ./public
COPY server.js .
COPY package.json .


# Exponer el puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Iniciar el servidor
CMD ["node", "server.js"]


