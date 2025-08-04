FROM node:18-slim

# Direccion de trabajo
WORKDIR /app

# Copiar package.json y lock
COPY package.json package-lock.json ./

# Instalacion de dependencias
RUN npm install

# Copiamos código fuente
COPY . .

# Puerto de la app Next.js
EXPOSE 3000

# Comando de arranque
CMD ["npm", "run", "dev"]