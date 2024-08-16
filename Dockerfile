# Establecer la imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json (si está presente)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
