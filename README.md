# PostHub

PostHub é uma plataforma de publicação e compartilhamento de conteúdo inspirada em experiências de blogs e redes sociais, com um backend em Django REST Framework e um frontend em React + Vite.

O projeto permite que usuários se cadastrem, façam login, criem posts, busquem conteúdo, comentem e interajam com publicações.

## Visão geral

Este repositório contém dois módulos principais:

- Backend: API REST desenvolvida com Django, DRF e Swagger.
- Frontend: interface web desenvolvida com React, React Router e Tailwind CSS.

## Funcionalidades

- Cadastro e login de usuários
- Perfil do usuário
- Criação, edição e exclusão de posts
- Busca de posts
- Visualização de detalhes de post
- Comentários e interações básicas
- Rotas públicas e privadas no frontend

## Tecnologias

### Backend
- Python
- Django
- Django REST Framework
- drf-yasg para documentação Swagger
- SQLite para desenvolvimento
- CORS configurado para integração com o frontend

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React

## Estrutura do projeto

```text
backend/
  core/               # configuração do projeto Django
  posts/              # modelos, views e rotas de posts
  users/              # autenticação e perfil de usuários
  interactions/       # comentários/interações
  db.sqlite3          # banco de desenvolvimento
  manage.py

frontend/
  posthub_frontend/
    src/              # componentes, páginas, rotas e contexto
    package.json
    vite.config.js
```

## Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Python 3.10+
- Node.js 18+
- npm ou yarn

## Como rodar o backend

No terminal, entre na pasta do backend:

```powershell
cd backend
```

Ative o ambiente virtual incluído no projeto:

```powershell
.\post_env\Scripts\Activate.ps1
```

Aplique as migrações e inicie o servidor:

```powershell
python manage.py migrate
python manage.py runserver
```

A API ficará disponível em:

- http://127.0.0.1:8000/
- Documentação Swagger: http://127.0.0.1:8000/api/docs/

## Como rodar o frontend

Em outro terminal, entre na pasta do frontend:

```powershell
cd frontend\posthub_frontend
```

Instale as dependências:

```powershell
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

A aplicação ficará disponível em:

- http://localhost:5173

## Variáveis e configuração

O projeto já está configurado para uso local com SQLite e CORS habilitado para o frontend Vite.

Se for necessário, ajuste os arquivos de configuração em:

- backend/core/settings.py
- frontend/posthub_frontend/vite.config.js

## Próximos passos

- Melhorar autenticação e autorização
- Implementar mais interações como curtidas/descurtidas e compartilhamentos
- Adicionar testes automatizados
- Preparar o projeto para deploy

## Licença

Este projeto está sob a licença do repositório.
