# Páginas de Criadores

Este documento explica as páginas de criadores implementadas no projeto.

## Estrutura das Páginas

### 1. Página Principal de Criadores (`/creators`)

**Arquivo**: `app/creators/page.tsx`

**Funcionalidades**:
- Lista todos os criadores em formato de cards
- **Infinite scroll** - carrega mais criadores conforme rola a tela
- Barra de busca para filtrar criadores por nome
- Loading state com skeleton
- Loading state para carregamento de mais conteúdo
- Tratamento de erros
- Interface responsiva

**Componentes utilizados**:
- `Layout` - Layout principal da aplicação
- `Header` - Cabeçalho da página
- `Section` - Container de seção
- `InfiniteScrollTrigger` - Componente para detectar scroll e carregar mais conteúdo

**Estados**:
- `creators` - Lista de criadores
- `loading` - Estado de carregamento inicial
- `loadingMore` - Estado de carregamento de mais conteúdo
- `error` - Estado de erro
- `searchTerm` - Termo de busca
- `pagination` - Dados de paginação (hasMore, page, etc.)

### 2. Página Individual de Criador (`/creators/[id]`)

**Arquivo**: `app/creators/[id]/page.tsx`

**Funcionalidades**:
- Exibe informações detalhadas do criador
- Lista todos os vídeos do criador
- Paginação dos vídeos
- Loading state com skeleton
- Tratamento de erros
- Botão de voltar

**Componentes utilizados**:
- `Layout` - Layout principal da aplicação
- `Header` - Cabeçalho da página
- `Section` - Container de seção
- `VideoCard` - Card de vídeo com thumbnail, duração, contadores e informações
- `Pagination` - Componente de paginação

**Estados**:
- `creator` - Dados do criador
- `videos` - Lista de vídeos
- `loading` - Estado de carregamento
- `error` - Estado de erro
- `currentPage` - Página atual
- `pagination` - Dados de paginação

## APIs Utilizadas

### 1. Listar Criadores (com paginação)
```typescript
GET /api/creators?page=1&limit=12
```

### 2. Buscar Criador por ID
```typescript
GET /api/creators/[id]
```

### 3. Buscar Vídeos do Criador
```typescript
GET /api/creators/[id]/videos?page=1&limit=12
```

## Navegação

### Fluxo de Navegação:
1. **Página Inicial** (`/`) → Seção "Criadores em Destaque"
2. **Botão "Ver Todos"** → Página de Criadores (`/creators`)
3. **Card de Criador** → Página Individual (`/creators/[id]`)
4. **Botão "Voltar"** → Volta para página anterior

### Links de Navegação:
- Página inicial: `/`
- Página de vídeos: `/videos`
- Página de criadores: `/creators`
- Página de criador específico: `/creators/[id]`
- Página de vídeo específico: `/video/[id]`

## Funcionalidades Específicas

### Busca de Criadores
- Busca em tempo real
- Filtra por nome do criador
- Case-insensitive
- Exibe mensagem quando não há resultados

### Infinite Scroll de Criadores
- Carrega 12 criadores por vez
- Detecta quando usuário chega ao final da página
- Carregamento automático de mais conteúdo
- Loading state durante carregamento
- Mensagem quando não há mais criadores

### Paginação de Vídeos
- 12 vídeos por página
- Navegação entre páginas
- Scroll automático para o topo
- Indicador de página atual

### Responsividade
- Grid adaptativo (2-5 colunas)
- Cards responsivos com aspect-ratio 16:9
- Layout mobile-friendly
- Imagens otimizadas
- Thumbnails com fallback

## Estados de Loading

### Skeleton Loading
- Cards com placeholder
- Animações de pulse
- Estrutura similar ao conteúdo final
- Feedback visual imediato

### Estados de Erro
- Mensagens claras de erro
- Botões de ação (voltar, tentar novamente)
- Fallback para conteúdo não encontrado

## Otimizações

### Performance
- Lazy loading de imagens
- Paginação para grandes listas
- Debounce na busca
- Cache de dados

### UX/UI
- Hover effects nos cards
- Transições suaves
- Feedback visual de interações
- Loading states informativos

## Estrutura de Dados

### Interface Creator
```typescript
interface Creator {
  id: string
  name: string
  qtd: number | null
  description: string | null
  image: string | null
  created_at: string | null
  update_at: string | null
}
```

### Interface Video
```typescript
interface Video {
  id: string
  title: string
  description: string | null
  url: string
  viewCount: number
  likesCount: number
  thumbnailUrl: string
  duration: number | null
  premium: boolean
  created_at: string | null
}
```

## Estilos CSS

### Classes Tailwind Utilizadas
- `grid` - Layout em grid
- `animate-pulse` - Animação de loading
- `hover:scale-105` - Efeito hover
- `transition-all` - Transições suaves
- `rounded-lg` - Bordas arredondadas
- `shadow-md` - Sombras

### Temas Customizados
- `theme-primary` - Cor primária
- `theme-secondary` - Cor secundária
- `theme-tag-primary` - Tag primária
- `theme-tag-secondary` - Tag secundária

## Próximas Melhorias

1. **Filtros Avançados**
   - Filtrar por categoria
   - Filtrar por data
   - Filtrar por popularidade

2. **Funcionalidades Sociais**
   - Seguir criadores
   - Favoritar criadores
   - Compartilhar perfil

3. **Estatísticas**
   - Total de visualizações
   - Média de likes
   - Crescimento do canal

4. **Notificações**
   - Novos vídeos
   - Atualizações do criador
   - Eventos especiais 