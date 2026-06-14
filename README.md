# cidadeviva-api

API REST de blog sobre cultura urbana, ciclismo e lifestyle da cidade de Jundiaí.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod (validação)
- JWT (autenticação)

## Requisitos

- Node.js 24+
- MongoDB Atlas ou instância local

## Instalação

```bash
git clone https://github.com/felipedev90/cidadeviva-api.git
cd cidadeviva-api
npm install
```

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=sua_uri_do_mongodb
JWT_SECRET=seu_secret
JWT_EXPIRES_IN=7d
```

## Scripts

| Comando             | Descrição                                                |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Inicia o servidor em modo desenvolvimento com hot reload |
| `npm run build`     | Compila o TypeScript para JavaScript                     |
| `npm start`         | Inicia o servidor em produção                            |
| `npm run typecheck` | Verifica erros de tipagem sem compilar                   |
| `npm run lint`      | Executa o ESLint                                         |
| `npm run format`    | Formata o código com Prettier                            |

## Endpoints

### Health

| Metodo | Rota      | Descricao                     | Auth |
| ------ | --------- | ----------------------------- | ---- |
| GET    | `/health` | Verifica se a API esta online | Nao  |

### Autenticacao

| Metodo | Rota                    | Descricao                         | Auth |
| ------ | ----------------------- | --------------------------------- | ---- |
| POST   | `/api/v1/auth/register` | Cadastra novo usuario             | Nao  |
| POST   | `/api/v1/auth/login`    | Realiza login e retorna token JWT | Nao  |

### Posts

| Metodo | Rota                  | Descricao                            | Auth |
| ------ | --------------------- | ------------------------------------ | ---- |
| GET    | `/api/v1/posts`       | Lista posts publicados com paginacao | Nao  |
| GET    | `/api/v1/posts/:slug` | Busca post pelo slug                 | Nao  |
| POST   | `/api/v1/posts`       | Cria novo post                       | Sim  |
| PATCH  | `/api/v1/posts/:slug` | Atualiza post                        | Sim  |
| DELETE | `/api/v1/posts/:slug` | Remove post                          | Sim  |

Filtros disponiveis no GET `/api/v1/posts`:

```
?page=1&limit=10&category=ciclismo
```

Categorias: `ciclismo`, `gastronomia`, `cultura`, `eventos`

### Comentarios

| Metodo | Rota                                 | Descricao                               | Auth |
| ------ | ------------------------------------ | --------------------------------------- | ---- |
| GET    | `/api/v1/posts/:postId/comments`     | Lista comentarios do post com paginacao | Nao  |
| POST   | `/api/v1/posts/:postId/comments`     | Cria comentario no post                 | Sim  |
| PATCH  | `/api/v1/posts/:postId/comments/:id` | Atualiza comentario                     | Sim  |
| DELETE | `/api/v1/posts/:postId/comments/:id` | Remove comentario                       | Sim  |

Somente o autor do comentario pode editar ou remover.

## Autenticacao

As rotas protegidas exigem o token JWT no header:

```
Authorization: Bearer seu_token_aqui
```

O token e retornado no login e no registro.

## Estrutura do projeto

```
## Estrutura do projeto

src/
├── app.ts                          # Configuração do Express (middlewares globais, rotas, error handler)
├── server.ts                       # Ponto de entrada — conecta banco e sobe o servidor
├── config/
│   ├── database.ts                 # Conexão com o MongoDB via Mongoose
│   └── env.ts                      # Validação e tipagem das variáveis de ambiente (Zod)
├── controllers/
│   ├── auth.controller.ts          # Registro e login
│   ├── comment.controller.ts       # CRUD de comentários
│   └── post.controller.ts          # CRUD de posts
├── middlewares/
│   ├── authenticate.ts             # Verifica token JWT e injeta userId no req
│   ├── error.middleware.ts         # Tratamento de erro global
│   └── validate.ts                 # Valida req.body com schema Zod
├── models/
│   ├── comment.model.ts            # Schema e Model de comentário
│   ├── post.model.ts               # Schema e Model de post
│   └── user.model.ts               # Schema e Model de usuário
├── routes/
│   ├── auth.routes.ts              # POST /api/v1/auth/register e /login
│   ├── comment.routes.ts           # Rotas aninhadas /api/v1/posts/:postId/comments
│   └── post.routes.ts              # Rotas /api/v1/posts
├── schemas/
│   ├── auth.schema.ts              # Schemas Zod de registro e login
│   ├── comment.schema.ts           # Schemas Zod de comentário
│   └── post.schema.ts              # Schemas Zod de post
├── types/
│   └── express.d.ts                # Augment do tipo Request (adiciona userId)
└── utils/
    ├── app-error.ts                # Classe de erro customizada com statusCode
    └── catch-async.ts              # Wrapper que elimina try/catch nos controllers
```

Desenvolvido por Felipe Augusto ✌️
