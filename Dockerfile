# Etapa de construcción
FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Etapa de ejecución
FROM node:14
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "index.js"]