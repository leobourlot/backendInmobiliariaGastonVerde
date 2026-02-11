# =========================
# STAGE 1: build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluye dev para build)
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos NestJS
RUN npm run build


# =========================
# STAGE 2: production
# =========================
FROM node:20-alpine

WORKDIR /app

# Copiamos solo lo necesario desde el build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production

# Puerto típico NestJS
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main.js"]
