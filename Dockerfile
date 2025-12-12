# Dockerfile - Build optimisé multi-étapes
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances en mode production
RUN npm ci --only=production && npm prune --production

# Stage final - image légère
FROM node:18-alpine

WORKDIR /app

# Copier node_modules depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le reste de l'application
COPY . .

# Expose le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Démarrer l'application
CMD ["npm", "start"]
