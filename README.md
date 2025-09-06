# CNN AMADOR - Site Adulto

Um site adulto moderno construído com Next.js 14 e Tailwind CSS, inspirado no layout mostrado nas imagens.

## Características

- 🎨 Design dark theme moderno
- 📱 Layout responsivo
- ⚡ Next.js 14 com App Router
- 🎯 Tailwind CSS para estilização
- 🔍 Barra de busca funcional
- 📋 Menu lateral responsivo
- 🏷️ Seção de tags mais buscadas
- 🎥 Grid de vídeos com cards
- 🎭 Ícones do Lucide React

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones
- **PostCSS** - Processamento CSS

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cornosbrasilnew
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

### Scripts de Teste

- `node scripts/test-split-payment.js` - Testa o sistema de split do PushinPay
- `node scripts/test-environments.js` - Testa a configuração dos ambientes
- `node scripts/debug-token.js` - Diagnostica problemas com o token PushinPay
- `node scripts/setup-env.js` - Ajuda a configurar o arquivo .env
- `node scripts/test-pushinpay-api.js` - Testa diretamente a API do PushinPay
- `node scripts/test-production-token.js` - Testa o token na API de produção
- `node scripts/test-production-env.js` - Testa o sistema com ambiente de produção
- `node scripts/test-token-loading.js` - Testa o carregamento do token
- `node scripts/test-fixed-config.js` - Testa o sistema com configuração corrigida
- `node scripts/test-pix-status.js` - Testa a consulta de status do PIX
- `node scripts/test-webhook-system.js` - Testa o sistema completo com webhook
- `node scripts/test-pushinpay-basic.js` - Testa a API PushinPay diretamente

## Estrutura do Projeto

```
cornosbrasilnew/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── TrendingTags.tsx
│   ├── VideoCard.tsx
│   └── VideoSection.tsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

## Componentes

### Header
- Logo CNN AMADOR
- Barra de busca
- Navegação principal
- Botões de login/cadastro

### Sidebar
- Menu lateral responsivo
- Navegação por categorias
- Ícones para cada seção

### TrendingTags
- Tags mais buscadas do dia
- Destaque para "XVIDEOS ONLYFANS"

### VideoSection
- Grid de vídeos
- Filtros de ordenação
- Cards com thumbnails

### VideoCard
- Thumbnail do vídeo
- Duração
- Badges (HD, ADS)
- Labels
- Título

## Personalização

### Cores
As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  'dark-bg': '#1a1a1a',
  'dark-card': '#2d2d2d',
  'dark-hover': '#3d3d3d',
  'accent-red': '#dc2626',
  'accent-red-hover': '#b91c1c',
  'text-primary': '#ffffff',
  'text-secondary': '#a3a3a3'
}
```

### Conteúdo
- Os vídeos podem ser modificados no componente `VideoSection.tsx`
- As tags podem ser alteradas no componente `TrendingTags.tsx`
- Os itens do menu podem ser editados no componente `Sidebar.tsx`

## Deploy

Para fazer o deploy em produção:

```bash
npm run build
npm run start
```

## Licença

Este projeto é apenas para fins educacionais e de demonstração. 