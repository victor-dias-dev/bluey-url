# Backend - Bluey URL Shortener

Backend API para o sistema de encurtador de URLs.

## Stack

- **Node.js** + **TypeScript**
- **Fastify** (HTTP server)
- **Prisma** (ORM)
- **PostgreSQL** (banco de dados)
- **Redis** (cache e filas)
- **BullMQ** (filas de eventos)

## Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Redis

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular banco (opcional)
npm run prisma:seed

# Iniciar em desenvolvimento
npm run dev
```

## Estrutura

```
backend/
├── src/
│   ├── config/          # Configurações
│   ├── lib/             # Bibliotecas (Prisma, Redis)
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços (Analytics)
│   ├── middleware/      # Middlewares
│   ├── utils/           # Utilitários
│   └── types/           # Tipos TypeScript
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Seed do banco
└── dist/                # Build output
```

## Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual

### URLs
- `POST /api/urls` - Criar URL
- `GET /api/urls` - Listar URLs
- `GET /api/urls/:id` - Obter URL
- `PATCH /api/urls/:id` - Atualizar URL
- `DELETE /api/urls/:id` - Deletar URL

### Domínios
- `GET /api/domains` - Listar domínios
- `POST /api/domains` - Criar domínio
- `GET /api/domains/:id` - Obter domínio
- `POST /api/domains/:id/verify` - Verificar domínio
- `DELETE /api/domains/:id` - Deletar domínio

### Analytics
- `GET /api/analytics/urls/:urlId` - Estatísticas da URL
- `GET /api/analytics/urls/:urlId/clicks` - Cliques recentes

### Redirect
- `GET /:shortCode` - Redirecionar URL

## Variáveis de Ambiente

Veja `.env.example` para todas as variáveis necessárias.

## Documentação

Cada módulo possui um arquivo `cursor.md` com informações técnicas e decisões de design.

