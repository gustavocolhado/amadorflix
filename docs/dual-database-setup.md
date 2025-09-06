# Configuração de Dois Bancos de Dados

Este projeto está configurado para usar dois bancos de dados MongoDB separados:

## Estrutura dos Bancos

### 1. Banco Principal (`DATABASE_URL`)
- **Usuários** (User)
- **Pagamentos** (Payment, PixPayment)
- **Sessões** (Session, Account)
- **Afiliados** (Affiliate)
- **Promoções** (Promotion)
- **Tokens de verificação** (VerificationToken)

### 2. Banco de Vídeos (`DATABASE_VIDEOS`)
- **Vídeos** (Video)
- **Criadores** (Creator)
- **Categorias** (Category)
- **Tags** (Tag)
- **Comentários** (Comment)
- **Likes, Favoritos, Histórico** (UserLike, UserFavorite, UserHistory)

## Configuração do Ambiente

Adicione as seguintes variáveis no seu arquivo `.env`:

```env
# Banco principal (usuários, pagamentos, etc.)
DATABASE_URL="mongodb://localhost:27017/amadorflix_main"

# Banco de vídeos e criadores
DATABASE_VIDEOS="mongodb://localhost:27017/amadorflix_videos"
```

## Scripts Disponíveis

```bash
# Gerar clientes Prisma para ambos os bancos
npm run db:generate

# Fazer push das mudanças para ambos os bancos
npm run db:push

# Criar migrações para ambos os bancos
npm run db:migrate

# Abrir Prisma Studio para o banco principal
npm run db:studio

# Abrir Prisma Studio para o banco de vídeos
npm run db:studio:videos

# Testar conexão com ambos os bancos
npm run db:test

# Migrar dados existentes para a nova estrutura
npm run db:migrate-data
```

## Como Usar nos Códigos

### Importar os Clientes

```typescript
import { prisma, prismaVideos } from '@/lib/database'
```

### Exemplos de Uso

#### Banco Principal (Usuários, Pagamentos)
```typescript
// Buscar usuário
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// Criar pagamento
const payment = await prisma.payment.create({
  data: {
    userId: 'user_id',
    amount: 29.90,
    plan: '1month'
  }
})
```

#### Banco de Vídeos (Vídeos, Criadores)
```typescript
// Buscar vídeos
const videos = await prismaVideos.video.findMany({
  take: 20,
  orderBy: { created_at: 'desc' }
})

// Buscar criadores
const creators = await prismaVideos.creator.findMany({
  take: 10
})
```

## Estrutura de Arquivos

```
prisma/
├── schema.prisma          # Schema do banco principal
└── schema-videos.prisma   # Schema do banco de vídeos

lib/
├── prisma.ts              # Cliente do banco principal
├── prisma-videos.ts       # Cliente do banco de vídeos
└── database.ts            # Exporta ambos os clientes

app/api/
├── videos/                # APIs que usam banco de vídeos
└── creators/              # APIs que usam banco de vídeos
```

## Migração de Dados

Se você já tem dados no banco único, será necessário:

1. **Backup dos dados existentes**
2. **Configurar as variáveis de ambiente** com as URLs dos dois bancos
3. **Executar a migração automática**:
   ```bash
   npm run db:migrate-data
   ```
4. **Verificar os dados migrados** com:
   ```bash
   npm run db:test
   ```
5. **Manter usuários e pagamentos** no `DATABASE_URL`
6. **Vídeos e criadores** serão movidos para o `DATABASE_VIDEOS`

### ⚠️ Importante
- Faça backup completo antes da migração
- Teste em ambiente de desenvolvimento primeiro
- Verifique os dados após a migração
- Só remova os dados do banco original após confirmar que tudo está funcionando

## Vantagens desta Configuração

- **Performance**: Queries mais rápidas em cada banco
- **Escalabilidade**: Pode escalar os bancos independentemente
- **Manutenção**: Separação clara de responsabilidades
- **Backup**: Backups independentes por tipo de dados
