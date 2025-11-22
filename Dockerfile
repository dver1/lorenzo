FROM node:18-alpine

WORKDIR /app

# Copiar dependencias
COPY package.json ./
RUN npm install --production

# Copiar servidor y frontend
COPY server.js ./
COPY web ./public

# Exponer puerto requerido por Cloud Run
EXPOSE 8080

CMD ["node", "server.js"]