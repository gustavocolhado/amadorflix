# Sistema de Perfil do Usuário

## 📋 Visão Geral

O sistema de perfil permite que os usuários gerenciem suas informações pessoais, visualizem vídeos curtidos, favoritos e histórico de visualização.

## 🚀 Funcionalidades

### 1. **Página de Perfil** (`/profile`)
- **Informações do Usuário**: Nome, email, username, data de criação
- **Status Premium**: Indicador visual e data de expiração
- **Edição de Perfil**: Modificar informações pessoais
- **Navegação por Tabs**: Interface organizada em seções

### 2. **Vídeos Curtidos** (`/profile?tab=liked`)
- Lista de vídeos que o usuário curtiu
- Ordenados por data (mais recentes primeiro)
- Contador de vídeos curtidos

### 3. **Vídeos Favoritos** (`/profile?tab=favorites`)
- Lista de vídeos adicionados aos favoritos
- Ordenados por data de adição
- Contador de vídeos favoritos

### 4. **Histórico de Visualização** (`/profile?tab=history`)
- Lista de vídeos assistidos pelo usuário
- Ordenados por data de visualização
- Contador de vídeos no histórico

### 5. **Configurações** (`/profile?tab=settings`)
- Configurações de privacidade
- Configurações de notificações
- Gerenciamento de conta
- Status Premium

### 6. **Ações nos Vídeos**
- **Botão Like**: Curtir/descurtir vídeos
- **Botão Favorito**: Adicionar/remover dos favoritos
- **Registro de Visualização**: Histórico automático

## 🗄️ Estrutura do Banco de Dados

### Novos Modelos Adicionados:

#### `UserFavorite`
```prisma
model UserFavorite {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  userId  String @db.ObjectId
  videoId String @db.ObjectId
  user    User  @relation(fields: [userId], references: [id])
  video   Video @relation(fields: [videoId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, videoId])
}
```

#### `UserHistory`
```prisma
model UserHistory {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  userId  String @db.ObjectId
  videoId String @db.ObjectId
  user    User  @relation(fields: [userId], references: [id])
  video   Video @relation(fields: [videoId], references: [id])
  watchedAt DateTime @default(now())
  watchDuration Int?

  @@unique([userId, videoId])
}
```

## 🔌 APIs Criadas

### Perfil do Usuário
- `GET /api/profile` - Buscar informações do perfil
- `PUT /api/profile` - Atualizar informações do perfil

### Vídeos Curtidos
- `GET /api/profile/liked-videos` - Listar vídeos curtidos

### Vídeos Favoritos
- `GET /api/profile/favorite-videos` - Listar vídeos favoritos

### Histórico
- `GET /api/profile/history` - Listar histórico de visualização

### Ações de Vídeo
- `POST /api/videos/[id]/like` - Curtir/descurtir vídeo
- `POST /api/videos/[id]/favorite` - Adicionar/remover dos favoritos
- `POST /api/videos/[id]/history` - Registrar visualização
- `GET /api/videos/[id]/like/status` - Verificar status do like
- `GET /api/videos/[id]/favorite/status` - Verificar status do favorito

## 🎨 Componentes

### `ProfilePage` (`app/profile/page.tsx`)
- Página principal do perfil
- Sistema de tabs para navegação
- Formulário de edição de perfil
- Exibição de vídeos em grid

### `VideoCard` (Atualizado)
- Botões de like e favorito
- Integração com hook `useVideoActions`
- Estados visuais para ações

### `Header` (Atualizado)
- Menu dropdown do usuário
- Links diretos para seções do perfil
- Avatar do usuário

## 🪝 Hooks Personalizados

### `useVideoActions` (`hooks/useVideoActions.ts`)
```typescript
interface UseVideoActionsReturn {
  isLiked: boolean
  isFavorited: boolean
  isLoading: boolean
  toggleLike: () => Promise<void>
  toggleFavorite: () => Promise<void>
  recordView: (watchDuration?: number) => Promise<void>
}
```

## 🎯 Como Usar

### 1. **Acessar o Perfil**
- Faça login na aplicação
- Clique no avatar/nome do usuário no header
- Selecione "Meu Perfil"

### 2. **Editar Informações**
- Na aba "Perfil", clique em "Editar"
- Modifique nome, username ou email
- Clique em "Salvar"

### 3. **Curtir Vídeos**
- Passe o mouse sobre um vídeo
- Clique no botão de coração (❤️)
- O vídeo será adicionado aos curtidos

### 4. **Favoritar Vídeos**
- Passe o mouse sobre um vídeo
- Clique no botão de estrela (⭐)
- O vídeo será adicionado aos favoritos

### 5. **Ver Histórico**
- Os vídeos são automaticamente registrados no histórico
- Acesse a aba "Histórico" no perfil

## 🔧 Configuração

### 1. **Executar Migração**
```bash
node scripts/setup-profile.js
```

### 2. **Verificar Banco de Dados**
```bash
npx prisma studio
```

### 3. **Testar Funcionalidades**
- Faça login com um usuário
- Acesse `/profile`
- Teste as diferentes abas
- Interaja com vídeos (like/favorito)

## 🎨 Temas

O sistema é totalmente compatível com os temas light e dark:
- Usa classes CSS customizadas (`theme-*`)
- Suporte a `dark:` variants do Tailwind
- Cores consistentes com o design system

## 🔒 Segurança

- Todas as APIs requerem autenticação
- Validação de dados de entrada
- Verificação de propriedade dos recursos
- Proteção contra CSRF

## 📱 Responsividade

- Layout adaptativo para mobile e desktop
- Menu dropdown responsivo
- Grid de vídeos responsivo
- Tabs funcionais em todas as telas

## 🚀 Próximos Passos

1. **Implementar notificações push**
2. **Adicionar sistema de playlists**
3. **Implementar recomendações baseadas no histórico**
4. **Adicionar exportação de dados**
5. **Implementar backup automático de favoritos**

## 🐛 Troubleshooting

### Problema: "Erro ao carregar dados"
- Verifique se o banco está conectado
- Confirme se as migrações foram executadas
- Verifique os logs do servidor

### Problema: "Botões não funcionam"
- Verifique se o usuário está logado
- Confirme se as APIs estão respondendo
- Verifique o console do navegador

### Problema: "Vídeos não aparecem"
- Verifique se existem dados no banco
- Confirme se as relações estão corretas
- Verifique os logs da API 