# Sistema de Criadores

Este documento explica como funciona o sistema de criadores implementado no projeto.

## Estrutura do Banco de Dados

O modelo `Creator` no Prisma possui os seguintes campos:

```prisma
model Creator {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  name String @unique
  qtd Int?
  description String?
  image String?
  created_at DateTime? @default(now())
  update_at DateTime? @default(now())
  userId String? @db.ObjectId
  User User? @relation(fields: [userId], references: [id])
}
```

## APIs Disponíveis

### 1. Listar Criadores
- **Endpoint**: `GET /api/creators`
- **Descrição**: Retorna os 20 criadores mais populares ordenados por quantidade de vídeos
- **Resposta**: Array de criadores com id, name, qtd, description, image, created_at, update_at

### 2. Buscar Criador por ID
- **Endpoint**: `GET /api/creators/[id]`
- **Descrição**: Retorna um criador específico por ID
- **Resposta**: Objeto do criador ou erro 404 se não encontrado

### 3. Buscar Vídeos do Criador
- **Endpoint**: `GET /api/creators/[id]/videos`
- **Parâmetros**: 
  - `page` (opcional): Número da página (padrão: 1)
  - `limit` (opcional): Itens por página (padrão: 12)
- **Descrição**: Retorna vídeos de um criador específico com paginação
- **Resposta**: Objeto com videos, pagination e creator

## Componentes

### Creators.tsx
O componente principal que exibe os criadores na página inicial:

- Usa o hook `useCreators()` para buscar dados
- Exibe skeleton loading durante o carregamento
- Mostra mensagem de erro se houver problemas
- Exibe mensagem quando não há criadores
- Lista os criadores com imagem, nome e contagem de vídeos

## Hooks

### useCreators.ts
Hook personalizado para gerenciar o estado dos criadores:

```typescript
const { creators, loading, error } = useCreators()
```

## Scripts

### seed-creators.js
Script para popular o banco de dados com criadores de exemplo:

```bash
node scripts/seed-creators.js
```

### check-creators.js
Script para verificar criadores existentes no banco:

```bash
node scripts/check-creators.js
```

### update-creators-count.js
Script para atualizar a contagem de vídeos dos criadores:

```bash
node scripts/update-creators-count.js
```

### test-creators-videos.js
Script para testar a relação entre criadores e vídeos:

```bash
node scripts/test-creators-videos.js
```

## Como Usar

1. **Verificar se existem criadores**:
   ```bash
   node scripts/check-creators.js
   ```

2. **Se não houver criadores, popular o banco**:
   ```bash
   node scripts/seed-creators.js
   ```

3. **Atualizar contagem de vídeos dos criadores**:
   ```bash
   node scripts/update-creators-count.js
   ```

4. **Acessar as páginas**:
   - Página inicial: `/` (mostra criadores em destaque)
   - Página de todos os criadores: `/creators`
   - Página de um criador específico: `/creators/[id]`

## Funcionalidades Implementadas

- ✅ Busca criadores do banco de dados
- ✅ Exibe loading state
- ✅ Tratamento de erros
- ✅ Fallback para imagens não encontradas
- ✅ Ordenação por popularidade (qtd)
- ✅ Limite de 20 criadores mais populares
- ✅ Interface responsiva com Tailwind CSS
- ✅ Página de todos os criadores com cards
- ✅ Busca de criadores por nome
- ✅ Página individual de cada criador
- ✅ Lista de vídeos por criador com paginação
- ✅ Navegação entre páginas
- ✅ Contagem automática de vídeos por criador

## Próximos Passos Sugeridos

1. Adicionar filtros por categoria
2. Implementar sistema de favoritos
3. Adicionar estatísticas de visualizações
4. Implementar sistema de seguir criadores
5. Adicionar notificações de novos vídeos 