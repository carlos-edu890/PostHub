# Especificação de Desenvolvimento Frontend - Medium Clone App

Este documento serve como o **Guia de Instruções Primário para o Agente de IA** encarregado de implementar o Frontend (interface web) para a aplicação estilo Medium.

> **Importante para o Agente de IA:**
> 1. **NÃO execute comandos para instalar dependências, bibliotecas ou pacotes.** Suponha que o ambiente Node.js, React, Tailwind CSS, Axios, React Router e ícones já estão devidamente instalados e configurados.
> 2. **DESIGN RESPONSIVO OBRIGATÓRIO:** Toda a interface DEVE ser 100% responsiva (Mobile-First / Adaptável para celulares, tablets e desktops) utilizando as classes de breakpoint do Tailwind CSS (`sm:`, `md:`, `lg:`).
> 3. Foque exclusivamente no desenvolvimento da estrutura de arquivos de código (`src/components`, `src/pages`, `src/services`, `src/context`, `src/routes`, etc.).

---

## 1. Stack Tecnológica do Frontend

- **Framework Web:** React (React Hooks, Functional Components)
- **Estilização:** Tailwind CSS (Design System responsivo, utilitários, temas flexíveis)
- **Cliente HTTP:** Axios (integração RESTful com o backend)
- **Roteamento:** React Router DOM (v6+)
- **Gerenciamento de Estado Global:** React Context API (autenticação do usuário e estado global de login)
- **Ícones:** Lucide React ou React Icons

---

## 2. Visão Geral da Aplicação e Mapeamento de Telas

O frontend consome a API REST desenvolvida em Django. As telas e fluxos devem refletir perfeitamente o comportamento descrito no PRD do produto, garantindo excelente usabilidade tanto em dispositivos móveis quanto em telas grandes.

---

## 3. Especificação Detalhada das Telas

### 3.1 Navbar / Cabeçalho Global (Header)
A navbar deve estar presente em todas as páginas e adaptar seu conteúdo de acordo com o estado de autenticação do usuário, além de ser totalmente responsiva (ex: menu hambúrguer ou adaptação de elementos em telas menores).

- **Para Usuário Não Logado:**
  - Lado Esquerdo: Logo do site (clicável, redireciona para `/`).
  - Lado Direito: Barra de pesquisa de posts + links de navegação: `'Sobre Nós'`, `'Contato'` e botão `'Login'`.
- **Para Usuário Logado:**
  - Lado Esquerdo: Logo do site (redireciona para `/`).
  - Centro/Direita: Barra de pesquisa de posts.
  - Lado Direito Extremo: Foto do Perfil / Avatar (ao clicar, redireciona para `/perfil`) + botão de `'Criar Post'`.

---

### 3.2 Modais de Autenticação / Página de Auth (`/login` e `/register`)
- **Tela de Login:**
  - Campos: `Email` (ou Username) e `Senha`.
  - Botão de 'Entrar'.
  - Link para alternar para a tela de Registro ("Não tem uma conta? Cadastre-se").
- **Tela de Registro:**
  - Campos: `Nome de Usuário (Username)`, `Email`, `Senha` e `Confirmação de Senha`.
  - Botão de 'Criar Conta'.
- **Responsividade:** Forms centralizados na tela, ajustando a largura (`w-full max-w-md`) para não quebrar em telas pequenas.
- **Integração Backend:** Salvar o Token JWT retornado no `localStorage` e atualizar o Contexto de Autenticação (`AuthContext`).

---

### 3.3 Página Inicial - Usuário Não Logado (`/`)
- Exibe o Navbar de Visitante.
- Lista os posts mais recentes/populares em layout responsivo.
- O visitante pode navegar, pesquisar e abrir qualquer post para leitura.
- **Regra de Bloqueio:** Se o visitante tentar curtir, descurtir, comentar ou compartilhar um post, o frontend deve exibir um **Modal / Banner Suspenso** informando: *"Você precisa estar logado para realizar esta ação"* com botões rápidos para Login e Cadastro.

---

### 3.4 Página Inicial - Usuário Logado (`/feed` ou `/`)
O layout da Home para usuário logado possui estrutura de **Grid Flexível**:
- **Desktop (`lg`):** Grid com 2 Colunas.
- **Mobile/Tablet (`< lg`):** Coluna única empilhada (a coluna lateral fica abaixo ou oculta em dispositivos muito pequenos).

- **Coluna Principal:**
  - **Feed 'Top 5 (24h)':** Exibe uma lista com os 5 posts mais curtidos nas últimas 24 horas.
  - **Botão 'Ver Mais':** Ao clicar, busca e concatena mais 5 posts via API.
  - **Estado Vazio (Empty State):** Se não houver nenhum post cadastrado nas últimas 24h, exibe a mensagem centralizada: *"Não tem post"*.
- **Coluna Lateral:**
  - **Botão 'Criar Post':** Botão em destaque para navegação rápida até `/criar-post`.
  - **Card 'Seu Post Mais Curtido':** Se o usuário tiver posts e pelo menos 1 post curtido, exibe um card em destaque com o seu post com maior número de curtidas. Caso não tenha, oculta a seção ou mostra um estado informativo.

---

### 3.5 Criação e Edição de Post (`/criar-post` e `/editar-post/:id`)
Interface interativa em blocos flexíveis e modernos:

- **Campo Inicial:** Título do Post (input grande).
- **Caixa de Adição de Bloco:**
  - Um container com bordas arredondadas e tracejadas (`border-dashed border-2 rounded-lg`), com um ícone de sinal de mais (`+`) no centro.
  - Ao clicar na caixa, abre um menu/dropdown lateral/popup com as opções do tipo de conteúdo a adicionar:
    1. **Texto:** Área de texto simples com suporte a inserção de links.
    2. **Arquivo Multimídia:** Input para upload/URL de imagens ou vídeos.
  - Ao selecionar uma opção, o bloco é renderizado e **uma nova caixa de seleção com o sinal de mais (`+`) surge logo abaixo**, permitindo composição infinita do post.
- **Ações:** Botão 'Publicar Post' / 'Salvar Alterações'.

---

### 3.6 Busca de Posts (`/busca`)
- **Barra de Pesquisa:** Input principal para busca por título do post com suporte a parâmetro de query na URL (`?q=termo`).
- **Cartões de Resultado (Post Cards - Responsivos):**
  - Foto de perfil (avatar) do autor.
  - Título do post em destaque.
  - Prévia do conteúdo: exibe exatamente **duas linhas de texto** seguidas de reticências (`...`) usando utilitários do Tailwind (`line-clamp-2`).
  - Métrica de engajamento: número de curtidas e descurtidas.
  - Ao clicar em qualquer parte do card, redireciona para a página do post (`/posts/:id`).
- **Paginação Infinita / Carregamento Contínuo:** A cada vez que o usuário atinge o fim da lista de busca, carrega mais 10 posts.

---

### 3.7 Visualização do Post (`/posts/:id`)
- Exibe o cabeçalho do post (Título, Autor, Foto do Autor, Data de Publicação).
- Renderização em sequência de todos os blocos do post (textos, links e imagens/vídeos redimensionados adequadamente).
- **Barra de Interações (Responsiva/Fixa no Mobile):**
  - Botão de **Curtir (Like)** e **Descurtir (Dislike)** com estado ativo preenchido caso o usuário logado já tenha reagido.
  - Botão de **Compartilhar** (copia o link direto do post ou abre modal de compartilhamento).
- **Seção de Comentários:**
  - Formulário para adicionar um novo comentário.
  - Lista de comentários abaixo do post com o avatar do autor, nome e data.

---

### 3.8 Aba de Meus Posts (`/meus-posts`)
Área de gerenciamento das publicações do próprio usuário logado:

- **Filtro / Ordenação:** Dropdown ou botões adaptáveis para ordenar a lista por:
  - *Mais Curtidos*
  - *Mais Descurtidos*
  - *Mais Comentados*
- **Card de Post Próprio:**
  - Título do post.
  - Prévia do texto em 2 linhas + `...`.
  - Contadores de curtidas, descurtidas e número de comentários.
  - Botões de Ação Direta em cada card: **'Editar Post'** (redireciona para `/editar-post/:id`) e **'Excluir Post'** (abre modal de confirmação antes de deletar).

---

### 3.9 Configurações do Perfil (`/perfil`)
- Formulário adaptável para alteração de foto de perfil (`avatar`), bio e dados pessoais.
- **Zona de Perigo:** Botão para **Excluir Conta**, exigindo confirmação de segurança antes de chamar o endpoint de deleção.

---

## 4. Estrutura de Arquivos Recomendada no Frontend

```text
src/
│
├── assets/                  # Imagens, logos e ícones estáticos
│
├── components/              # Componentes reutilizáveis
│   ├── Navbar.jsx           # Cabeçalho adaptável (Mobile/Desktop) com busca e login
│   ├── ProtectedRoute.jsx   # Wrapper para rotas privadas
│   ├── PostCard.jsx         # Card de exibição do post (2 linhas + ...)
│   ├── BlockEditor.jsx      # Caixa tracejada (+) para adicionar texto/mídia
│   ├── AuthModal.jsx        # Modal "Você precisa estar logado"
│   └── ConfirmModal.jsx     # Modal de confirmação para exclusão
│
├── context/
│   └── AuthContext.jsx      # Gerenciador global de usuário logado e token JWT
│
├── pages/                   # Páginas da aplicação
│   ├── Home.jsx             # Feed Top 5 24h + Card Destaque + Botão Criar
│   ├── Login.jsx            # Form de Login
│   ├── Register.jsx         # Form de Registro
│   ├── PostDetail.jsx       # Visualização completa do post + comentários
│   ├── CreatePost.jsx       # Interface em blocos dinâmicos
│   ├── EditPost.jsx         # Edição de post existente
│   ├── Search.jsx           # Busca de posts (10 em 10)
│   ├── MyPosts.jsx          # Meus posts com ordenação e ações
│   ├── Profile.jsx          # Gestão do perfil e exclusão de conta
│   ├── About.jsx            # Página Sobre Nós
│   └── Contact.jsx          # Página de Contato
│
├── services/
│   ├── api.js               # Instância do Axios com Interceptors do Token JWT
│   ├── authService.js       # Chamadas da API de autenticação
│   ├── postService.js       # Chamadas da API de posts e busca
│   └── interactionService.js# Chamadas de likes, descurtidas e comentários
│
├── routes/
│   └── AppRoutes.jsx        # Mapeamento de todas as rotas com React Router
│
├── App.jsx                  # Componente raiz com AuthProvider e Routes
└── main.jsx                 # Ponto de entrada do React