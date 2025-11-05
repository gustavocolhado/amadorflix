# Dockerfile para Vazadex - Otimizado para Coolify

# Estágio de build
FROM node:18-alpine AS builder

# Instalar dependências necessárias para o build
RUN apk add --no-cache libc6-compat openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma clients (ambos os bancos)
RUN npx prisma generate && npx prisma generate --schema=./prisma/schema-videos.prisma

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner

# Instalar dependências necessárias para o runtime
RUN apk add --no-cache libc6-compat openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas as dependências de produção
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci --omit=dev

# Copiar os artefatos de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/config ./config
COPY --from=builder /app/contexts ./contexts
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/types ./types
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/middleware.ts ./middleware.ts
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/.env.example ./.env.example
COPY --from=builder /app/.gitignore ./.gitignore
COPY --from=builder /app/README.md ./README.md

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
