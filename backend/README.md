# Backend - Bluey URL Shortener

Backend API desenvolvido em Node.js + TypeScript usando Fastify e Prisma para o sistema de encurtador de URLs.

## Stack

- **Node.js** + **TypeScript** - Runtime e tipagem estática
- **Fastify** - Framework HTTP de alta performance
- **Prisma** - ORM type-safe com migrations automáticas
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache de resolução de URLs e filas
- **BullMQ** - Sistema de filas para processamento assíncrono

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
│   ├── config/          # Configurações centralizadas
│   ├── lib/             # Clientes (Prisma, Redis)
│   ├── routes/          # Rotas da API
│   │   ├── auth.ts      # Autenticação
│   │   ├── urls.ts      # CRUD de URLs
│   │   ├── domains.ts   # Domínios customizados
│   │   ├── analytics.ts # Analytics
│   │   └── redirect.ts  # Redirecionamento
│   ├── services/        # Serviços (Analytics queue)
│   ├── middleware/      # Middlewares
│   ├── utils/           # Utilitários
│   └── types/           # Tipos TypeScript
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Seed do banco
└── dist/                # Build output
```

## Decisões de Design

### Framework HTTP: Fastify
- Escolhido por performance superior ao Express
- Suporte nativo a TypeScript
- Plugin ecosystem robusto
- Validação integrada

### ORM: Prisma
- Type-safe queries
- Migrations automáticas
- Geração de tipos TypeScript
- Developer experience superior

### Cache: Redis
- Cache de resolução de URLs
- TTL de 24 horas
- Chave: `short:{domainId}:{shortCode}`
- Cache-first strategy para máxima performance

### Filas: BullMQ
- Processamento assíncrono de eventos
- Retry automático
- Escalável horizontalmente
- Não bloqueia operações críticas (redirects)

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

## Fluxos Principais

### Criar URL
1. Validação de entrada (Zod)
2. Verificação de limites do plano
3. Geração de short code
4. Persistência no banco
5. Cache no Redis
6. Retorno da URL curta

### Redirecionar URL
1. Extração do código e domínio
2. Busca no cache (Redis) - cache-first strategy
3. Fallback para banco se cache miss
4. Validação (ativa, não expirada)
5. Publicação assíncrona de evento na fila
6. Redirecionamento HTTP 301/302

### Analytics
1. Evento publicado na fila (não bloqueia o redirect)
2. Worker processa evento assincronamente
3. Enriquecimento (GeoIP, UA parsing)
4. Persistência no banco

## Segurança

- **JWT** para autenticação stateless
- **Bcrypt** para hash de senhas
- **Rate limiting** por IP
- **Helmet** para headers de segurança HTTP
- **CORS** configurável por ambiente
- **Validação de entrada** com Zod em todas as rotas

## Performance

- Cache-first strategy com Redis
- Processamento assíncrono de eventos (não bloqueia redirects)
- Índices otimizados no banco de dados
- Queries eficientes com Prisma
- TTL de 24 horas no cache de URLs

## Variáveis de Ambiente

Veja `.env.example` para todas as variáveis necessárias.

## Documentação

Cada módulo possui um arquivo `cursor.md` com informações técnicas detalhadas, decisões de design e exemplos de uso.

