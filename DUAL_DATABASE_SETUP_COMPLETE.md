# ✅ Configuração de Dois Bancos de Dados - CONCLUÍDA

## 🎯 Resumo da Implementação

Sua aplicação agora está configurada para usar **dois bancos de dados MongoDB separados**:

### 📊 **Banco Principal** (`DATABASE_URL`)
- **Usuários** (User, Account, Session)
- **Pagamentos** (Payment, PixPayment, PaymentSession)
- **Sistema de Afiliados** (Affiliate, WithdrawalRequest)
- **Promoções** (Promotion)
- **Tokens de Verificação** (VerificationToken)

### 🎬 **Banco de Vídeos** (`DATABASE_VIDEOS`)
- **Vídeos** (Video, VideoTag)
- **Criadores** (Creator)
- **Categorias** (Category)
- **Tags** (Tag)
- **Interações** (Comment, UserLike, UserFavorite, UserHistory)

## 🚀 **Próximos Passos**

### 1. **Configurar Variáveis de Ambiente**
Adicione no seu `.env`:
```env
# Banco principal (usuários, pagamentos, etc.)
DATABASE_URL="mongodb://localhost:27017/amadorflix_main"

# Banco de vídeos e criadores
DATABASE_VIDEOS="mongodb://localhost:27017/amadorflix_videos"
```

### 2. **Executar Comandos de Setup**
```bash
# Gerar clientes Prisma
npm run db:generate

# Fazer push das estruturas para os bancos
npm run db:push

# Testar conexões
npm run db:test
```

### 3. **Migrar Dados Existentes** (se necessário)
```bash
# Migrar dados do banco único para os dois bancos
npm run db:migrate-data
```

## 📁 **Arquivos Criados/Modificados**

### ✅ **Novos Arquivos:**
- `prisma/schema-videos.prisma` - Schema do banco de vídeos
- `lib/database.ts` - Cliente unificado para ambos os bancos
- `lib/prisma-videos.ts` - Cliente específico para vídeos
- `app/api/videos/route.ts` - API de vídeos
- `app/api/creators/route.ts` - API de criadores
- `hooks/useVideos.ts` - Hook para gerenciar vídeos
- `scripts/test-dual-database.js` - Script de teste
- `scripts/migrate-to-dual-database.js` - Script de migração
- `docs/dual-database-setup.md` - Documentação completa

### 🔄 **Arquivos Modificados:**
- `prisma/schema.prisma` - Removidos modelos de vídeos/criadores
- `package.json` - Adicionados scripts de banco

## 🛠️ **Scripts Disponíveis**

```bash
npm run db:generate      # Gerar clientes Prisma
npm run db:push          # Push para ambos os bancos
npm run db:migrate       # Migrações para ambos os bancos
npm run db:studio        # Studio para banco principal
npm run db:studio:videos # Studio para banco de vídeos
npm run db:test          # Testar conexões
npm run db:migrate-data  # Migrar dados existentes
```

## 💻 **Como Usar no Código**

```typescript
import { prisma, prismaVideos } from '@/lib/database'

// Banco principal (usuários, pagamentos)
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// Banco de vídeos (vídeos, criadores)
const videos = await prismaVideos.video.findMany({
  take: 20,
  orderBy: { created_at: 'desc' }
})
```

## 🎉 **Benefícios Alcançados**

- ✅ **Performance**: Queries mais rápidas em cada banco
- ✅ **Escalabilidade**: Bancos independentes
- ✅ **Manutenção**: Separação clara de responsabilidades
- ✅ **Backup**: Backups independentes por tipo de dados
- ✅ **Desenvolvimento**: Estrutura mais organizada

## ⚠️ **Importante**

1. **Faça backup** dos dados antes de executar a migração
2. **Teste em desenvolvimento** primeiro
3. **Verifique os dados** após a migração
4. **Só remova dados** do banco original após confirmar que tudo funciona

---

**🎯 Configuração concluída com sucesso!** Sua aplicação agora tem uma arquitetura robusta e escalável com dois bancos de dados separados.

