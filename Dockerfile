# =========================
# STAGE 1: build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Habilitar corepack (pnpm viene por acá)
RUN corepack enable

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (incluye dev)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Compilar NestJS
RUN pnpm run build


# =========================
# STAGE 2: production
# =========================
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Copiar solo lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV=production

# Puerto típico NestJS
EXPOSE 3000

# Arranque de la app
CMD ["node", "dist/main.js"]
