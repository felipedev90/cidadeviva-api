# cidadeviva-api

API REST de blog sobre cultura urbana, ciclismo e lifestyle da cidade de Jundiaí.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod (validação)
- JWT (autenticação)

## Requisitos

- Node.js 18+
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
MONGODB_URI=sua_uri_do_mongodb
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
src/
  config/       # variaveis de ambiente
  controllers/  # logica das rotas
  middlewares/  # autenticacao, validacao e erro global
  models/       # schemas do Mongoose
  routes/       # definicao das rotas
  schemas/      # validacao com Zod
  server.ts     # inicializacao do servidor
  app.ts        # configuracao do Express
```
