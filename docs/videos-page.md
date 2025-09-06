# Página de Todos os Vídeos

Este documento explica a página de vídeos implementada no projeto.

## Visão Geral

**Arquivo**: `app/videos/page.tsx`

**URL**: `/videos`

**Funcionalidades**:
- Lista todos os vídeos em formato de cards
- **Paginação tradicional** - navegação entre páginas com botões
- **Filtros avançados** - ordenação por diferentes critérios
- Barra de busca para filtrar vídeos por título
- Loading state com skeleton
- Tratamento de erros
- Interface responsiva

## Componentes Utilizados

- `Layout` - Layout principal da aplicação
- `Header` - Cabeçalho da página
- `Section` - Container de seção
- `VideoCard` - Card de vídeo com thumbnail, duração, contadores e informações
- `Pagination` - Componente de paginação com navegação entre páginas

## Estados

- `videos` - Lista de vídeos
- `loading` - Estado de carregamento inicial
- `error` - Estado de erro
- `searchTerm` - Termo de busca
- `selectedFilter` - Filtro selecionado
- `showFilters` - Estado do dropdown de filtros
- `currentPage` - Página atual
- `pagination` - Dados de paginação (totalPages, total, etc.)

## Filtros Disponíveis

### 1. Mais Recentes (`recent`)
- **Ícone**: Play
- **Descrição**: Vídeos publicados recentemente
- **Ordenação**: `created_at DESC`

### 2. Mais Vistos (`popular`)
- **Ícone**: TrendingUp
- **Descrição**: Vídeos com mais visualizações
- **Ordenação**: `viewCount DESC`

### 3. Mais Curtidos (`liked`)
- **Ícone**: Heart
- **Descrição**: Vídeos com mais likes
- **Ordenação**: `likesCount DESC`

### 4. Vídeos Longos (`long`)
- **Ícone**: Clock
- **Descrição**: Vídeos com mais de 10 minutos
- **Filtro**: `duration >= 600`
- **Ordenação**: `duration DESC`

### 5. Aleatórios (`random`)
- **Ícone**: Shuffle
- **Descrição**: Vídeos em ordem aleatória
- **Algoritmo**: Embaralhamento com seed baseada na página

## APIs Utilizadas

### Listar Vídeos (com filtros e paginação)
```typescript
GET /api/videos?page=1&limit=12&filter=recent&search=termo&category=categoria
```

**Parâmetros**:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 12)
- `filter` (opcional): Tipo de filtro (recent, popular, liked, long, random)
- `search` (opcional): Termo de busca no título
- `category` (opcional): Categoria específica

**Resposta**:
```typescript
{
  videos: Video[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasMore: boolean
  }
}
```

## Hook Personalizado

### useVideos

Hook para gerenciar a busca de vídeos com paginação:

```typescript
const { videos, loading, error, pagination, refetch } = useVideos({
  filter: 'recent',
  search: 'termo',
  category: 'categoria',
  page: 1
})
```

**Parâmetros**:
- `filter`: Tipo de filtro
- `search`: Termo de busca
- `category`: Categoria específica
- `page`: Número da página

## Funcionalidades Específicas

### Busca de Vídeos
- Busca em tempo real no título
- Case-insensitive
- Funciona em conjunto com filtros
- Exibe mensagem quando não há resultados

### Paginação
- 12 vídeos por página
- Navegação entre páginas com botões
- Scroll automático para o topo ao mudar página
- Indicador de página atual
- Informações sobre total de vídeos

### Filtros Avançados
- Dropdown com opções visuais
- Ícones e descrições para cada filtro
- Indicador visual do filtro ativo
- Mudança instantânea de ordenação

### Responsividade
- Grid adaptativo (2-5 colunas)
- Cards responsivos com aspect-ratio 16:9
- Layout mobile-friendly
- Dropdown responsivo
- Busca otimizada para mobile

## Estados de Loading

### Skeleton Loading
- Cards com placeholder
- Animações de pulse
- Estrutura similar ao conteúdo final
- Feedback visual imediato

### Loading de Página
- Skeleton durante carregamento
- Feedback visual imediato
- Transição suave entre páginas

### Estados de Erro
- Mensagens claras de erro
- Botões de ação (tentar novamente)
- Fallback para conteúdo não encontrado

## Otimizações

### Performance
- Lazy loading de imagens
- Paginação para grandes listas
- Debounce na busca
- Cache de dados
- Embaralhamento eficiente para filtro aleatório
- Scroll automático para melhor UX

### UX/UI
- Hover effects nos cards
- Transições suaves
- Feedback visual de interações
- Loading states informativos
- Dropdown com animações

## Estrutura de Dados

### Interface Video
```typescript
interface Video {
  id: string
  title: string
  description: string | null
  url: string
  videoUrl: string
  viewCount: number
  likesCount: number
  thumbnailUrl: string
  duration: number | null
  premium: boolean
  iframe: boolean
  trailerUrl: string | null
  category: string[]
  creator: string | null
  created_at: string | null
}
```

## Navegação

### Links de Navegação
- Página inicial: `/`
- Página de vídeos: `/videos`
- Página de criadores: `/creators`
- Página de vídeo específico: `/video/[id]`

### Integração com Header
- Link "Videos" no menu de navegação
- Acesso direto via URL
- Breadcrumb implícito

## Scripts de Teste

### test-videos-api.js
Script para testar a API de vídeos:

```bash
node scripts/test-videos-api.js
```

**Funcionalidades do teste**:
- Testa todos os filtros disponíveis
- Verifica busca por texto
- Testa vídeos longos
- Valida ordenação

### test-videos-pagination.js
Script para testar a paginação de vídeos:

```bash
node scripts/test-videos-pagination.js
```

**Funcionalidades do teste**:
- Testa diferentes páginas
- Verifica filtros com paginação
- Testa busca com paginação
- Valida API endpoint

## Próximas Melhorias

1. **Filtros Adicionais**
   - Filtrar por duração específica
   - Filtrar por data de publicação
   - Filtrar por criador
   - Filtrar por categoria

2. **Funcionalidades Avançadas**
   - Favoritar vídeos
   - Histórico de visualização
   - Recomendações personalizadas
   - Playlist personalizada

3. **Melhorias de Performance**
   - Virtualização para listas grandes
   - Cache mais inteligente
   - Pré-carregamento de imagens
   - Otimização de queries

4. **Funcionalidades Sociais**
   - Comentários nos vídeos
   - Compartilhar vídeos
   - Avaliações
   - Sistema de tags 