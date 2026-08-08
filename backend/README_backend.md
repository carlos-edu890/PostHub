# Especificação de Desenvolvimento Backend - Medium Clone API

Este documento serve como o **Guia de Instruções Primário para o Agente de IA** encarregado de implementar a API Backend para a aplicação no estilo Medium.

> **Importante para o Agente de IA:**
> 1. **NÃO execute comandos para instalar dependências ou novas tecnologias.** Suponha que o ambiente Python/Django e suas bibliotecas necessárias já estão devidamente configurados e disponíveis.
> 2. Foque exclusivamente no desenvolvimento dos arquivos de código (modelos, visões, serializadores, rotas, permissões, serviços, testes e documentação Swagger).

---

## 1. Visão Geral do Projeto

A aplicação é uma plataforma de publicação de conteúdo (estilo Medium) que permite a usuários lerem, pesquisarem, criarem, reagirem, comentarem e compartilharem posts.

### 1.1 Documentação Recomendada Interna (PRD, Arquitetura e Convenções)
O agente deve seguir a estrutura modular padrão do **Django REST Framework (DRF)** respeitando:
- **PRD (Documento de Requisitos do Produto):** Funcionalidades completas descritas neste guia.
- **Guia de Arquitetura e Stack:** Django + DRF + PostgreSQL + Swagger.
- **Padrões de Código:** PEP 8, arquitetura baseada em *apps* legíveis, *serializers* explícitos, *views* genéricas/viewsets e permissões customizadas.

---

## 2. Stack Tecnológica do Backend

- **Linguagem/Framework:** Python / Django / Django REST Framework (DRF)
- **Banco de Dados:** PostgreSQL (suporte a tipos JSON/Relacionais)
- **Documentação de API:** Swagger / OpenAPI (via `drf-spectacular` ou `drf-yasg`)
- **Autenticação:** JWT (JSON Web Tokens) ou Session/Token Auth nativo do DRF

---

## 3. Requisitos Funcionais e Regras de Negócio

### 3.1 Gestão de Usuários e Autenticação
- **Cadastro (Register):**
  - Campos: `username`, `email`, `password`.
  - Validação de e-mail e nome de usuário únicos.
- **Login:**
  - Suporte a autenticação via `email` (ou `username`) e `password`.
- **Gerenciamento de Perfil:**
  - Alteração de foto de perfil (`avatar`), bio ou nome.
  - Endpoint para obtenção dos dados do perfil do usuário logado e de terceiros.
- **Exclusão de Conta:**
  - O usuário autenticado pode solicitar a exclusão permanente de sua conta.

### 3.2 Postagens (Posts) e Estrutura de Conteúdo
- **Criação de Post:**
  - Suporte a blocos dinâmicos de conteúdo: texto com links e/ou arquivos multimídia (imagens/vídeos/anexos).
  - O post possui um título obrigatório e múltiplos blocos encadeados.
- **Listagem e Feed da Página Inicial:**
  - **Feed de Top 5 (24h):** Os 5 posts mais curtidos nas últimas 24 horas.
  - **Paginação / Botão 'Ver Mais':** Retorno de mais 5 posts por requisição caso o usuário solicite.
  - **Tratamento de Estado Vazio:** Retornar lista vazia ou indicador específico quando não houver posts nas últimas 24h.
  - **Destaque do Usuário:** Endpoint para obter o post mais curtido do próprio usuário logado (exibido no painel lateral).
- **Busca de Posts:**
  - Filtro e pesquisa por **título do post**.
  - Retorno formatado para preview contendo: foto do perfil do autor, título, contagem de curtidas/descurtidas e prévia do texto (primeiras linhas).
  - Paginação de busca: **10 posts por página** (rolagem infinita/carregamento contínuo).
- **Meus Posts (`/api/posts/me/`):**
  - Lista apenas os posts criados pelo usuário autenticado.
  - Exibe resumo (título, prévia de 2 linhas, número de curtidas/descurtidas, quantidade de comentários).
  - Suporte a ordenação por: mais curtidos, mais descurtidos e mais comentados.
  - Permitir ações diretas: **Editar Post** e **Excluir Post** (apenas o autor possui permissão).

### 3.3 Interações e Engajamento
- **Reações (Gostei / Não Gostei):**
  - O usuário pode reagir com *Like* ou *Dislike*.
  - Se o usuário já reagiu com *Like* e clicar em *Dislike*, a reação deve ser alterada. Clicar na mesma reação cancela o voto.
- **Comentários:**
  - Adicionar comentários em posts de outros usuários ou no próprio post.
  - Listagem de comentários vinculados a um post específico.
- **Compartilhamento:**
  - Ação de compartilhar post (próprio ou de terceiros).
  - Registrar métrica/histórico de compartilhamento no backend.

### 3.4 Controle de Acesso e Permissões (Usuário Logado vs Não Logado)
- **Usuário Não Logado (Visitante / Guest):**
  - **Permitido:** Buscar posts, listar posts públicos, visualizar detalhe de um post de outro usuário.
  - **Bloqueado:** Criar post, editar, excluir, curtir/descurtir, comentar e compartilhar.
  - **Comportamento:** Ao tentar realizar qualquer ação restrita, a API deve retornar `401 Unauthorized` ou `403 Forbidden` com uma mensagem amigável para que o frontend exiba o modal de login ("Você precisa estar logado para realizar esta ação").

---

## 4. Modelagem de Dados Sugerida (Database Schema)

O agente deve implementar as seguintes entidades/modelos no Django:

### 4.1 `User` (Extensão de `AbstractUser`)
- `id` (UUID / Auto)
- `username` (Char, unique)
- `email` (Email, unique)
- `avatar` (ImageField / URLField, null=True)
- `bio` (TextField, optional)
- `created_at` (DateTimeField)

### 4.2 `Post`
- `id` (UUID / Auto)
- `author` (ForeignKey -> User, on_delete=CASCADE)
- `title` (CharField)
- `created_at` (DateTimeField, auto_now_add=True)
- `updated_at` (DateTimeField, auto_now=True)
- `shares_count` (IntegerField, default=0)

### 4.3 `PostBlock` (Blocos de Conteúdo do Post)
- `id` (UUID / Auto)
- `post` (ForeignKey -> Post, related_name='blocks', on_delete=CASCADE)
- `order` (PositiveIntegerField)
- `block_type` (CharField: `text`, `image`, `video`, `link`)
- `content` (TextField - armazena o texto ou URL do recurso)

### 4.4 `Reaction` (Curtidas / Descurtidas)
- `id` (UUID / Auto)
- `post` (ForeignKey -> Post, related_name='reactions', on_delete=CASCADE)
- `user` (ForeignKey -> User, on_delete=CASCADE)
- `reaction_type` (CharField: `like`, `dislike`)
- *Constraint:* `unique_together = ('post', 'user')`

### 4.5 `Comment`
- `id` (UUID / Auto)
- `post` (ForeignKey -> Post, related_name='comments', on_delete=CASCADE)
- `author` (ForeignKey -> User, on_delete=CASCADE)
- `content` (TextField)
- `created_at` (DateTimeField, auto_now_add=True)

### 4.6 `Share`
- `id` (UUID / Auto)
- `post` (ForeignKey -> Post, on_delete=CASCADE)
- `user` (ForeignKey -> User, on_delete=CASCADE)
- `created_at` (DateTimeField, auto_now_add=True)

---

## 5. Mapeamento de Endpoints RESTful (API Specification)

### 5.1 Autenticação e Conta (`/api/auth/` e `/api/users/`)
- `POST /api/auth/register/` - Registro de novo usuário.
- `POST /api/auth/login/` - Login e geração de token.
- `POST /api/auth/logout/` - Encerrar sessão.
- `GET /api/users/me/` - Obter dados do perfil logado.
- `PATCH /api/users/me/` - Atualizar perfil (foto, bio, nome).
- `DELETE /api/users/me/` - Excluir a própria conta.

### 5.2 Feeds e Posts (`/api/posts/`)
- `GET /api/posts/feed/top24h/` - Retorna os 5 posts mais curtidos nas últimas 24h (suporta `?page=1`).
- `GET /api/posts/me/top/` - Retorna o post mais curtido do usuário logado.
- `GET /api/posts/me/` - Lista posts do usuário logado. Suporta ordenação `?ordering=-likes`, `?ordering=-dislikes`, `?ordering=-comments`.
- `GET /api/posts/search/` - Pesquisa de posts por título (`?q=titulo&page=1`, limitação de 10 itens por página).
- `GET /api/posts/{id}/` - Detalhes do post (público).
- `POST /api/posts/` - Criar novo post com array de blocos de conteúdo (Requer Autenticação).
- `PUT/PATCH /api/posts/{id}/` - Editar post existente (Apenas Autor).
- `DELETE /api/posts/{id}/` - Excluir post (Apenas Autor).

### 5.3 Interações (`/api/posts/{id}/...`)
- `POST /api/posts/{id}/react/` - Adicionar/modificar reação (`{"type": "like"}` ou `{"type": "dislike"}`). Requer Autenticação.
- `GET /api/posts/{id}/comments/` - Listar comentários do post.
- `POST /api/posts/{id}/comments/` - Adicionar comentário no post. Requer Autenticação.
- `POST /api/posts/{id}/share/` - Registrar compartilhamento do post. Requer Autenticação.

---

## 6. Documentação da API com Swagger

- O backend deve expor a documentação interativa utilizando Swagger UI / OpenAPI 3.0.
- As URLs padrão de documentação devem ser:
  - `GET /api/schema/` - OpenAPI Schema.
  - `GET /api/docs/` - Interface Swagger UI.

---

## 7. Instruções Finais para Execução pelo Agente de IA

1. Crie/Organize a estrutura dos apps Django (ex: `users`, `posts`, `interactions`).
2. Crie os modelos (`models.py`) de acordo com o esquema detalhado acima.
3. Configure os *Serializers* (`serializers.py`), incluindo validações customizadas para os blocos de postagem e reações.
4. Implemente as permissões customizadas do DRF (`permissions.py`), como `IsAuthorOrReadOnly` e tratamento de permissões para usuários não autenticados.
5. Crie as *Views/ViewSets* (`views.py`) com otimização de consultas (`select_related`, `prefetch_related`, `annotate` para contagem de likes/dislikes/comentários).
6. Configure as rotas (`urls.py`) e registre o Swagger.
7. Garanta que a API retorne erros legíveis com status HTTP corretos (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).