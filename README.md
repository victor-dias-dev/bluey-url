# Bluey URL - URL Shortener SaaS

Sistema de encurtador de URLs desenvolvido como monorepo com backend em Node.js/TypeScript e frontend em Next.js 14. Plataforma completa para criação, gerenciamento e análise de URLs encurtadas com suporte a domínios customizados e analytics em tempo real.

## 📁 Estrutura do Projeto

```
bluey-url/
├── backend/          # API Backend (Fastify + Prisma)
├── frontend/         # Frontend (Next.js 14)
├── README.md         # Este arquivo
├── DEPLOY.md         # Guia de deploy
├── vercel.json       # Configuração Vercel
├── rules-documentation.md    # Regras de negócio
└── thecnical_documentation.md # Documentação técnica
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- Docker Desktop (opcional, para usar Docker Compose)
- PostgreSQL e Redis (ou use Docker Compose)

### Opção 1: Com Docker Compose (Recomendado)

```bash
# Iniciar PostgreSQL e Redis
docker-compose -f docker-compose.dev.yml up -d

# Configurar backend
cd backend
cp .env.docker .env

# Instalar dependências e configurar banco
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Iniciar backend
npm run dev
```

Veja [DOCKER.md](./DOCKER.md) para mais detalhes.

### Opção 2: Instalação Manual

```bash
# Instalar dependências do monorepo
npm install

# Configurar variáveis de ambiente do backend
cd backend
cp env.example .env
# Editar .env com suas configurações

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular banco (opcional)
npm run prisma:seed
```

### Executar

```bash
# Backend em desenvolvimento
npm run dev:backend

# Frontend em desenvolvimento
npm run dev:frontend
```

## 📚 Documentação

- [Documentação Técnica](./thecnical_documentation.md)
- [Regras de Negócio](./rules-documentation.md)
- [Guia de Deploy](./DEPLOY.md)
- [Docker Setup](./DOCKER.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

Cada módulo possui um arquivo `cursor.md` com informações técnicas detalhadas.

## 🚀 Deploy

O projeto está pronto para deploy:

- **Frontend**: Deploy na Vercel (configuração automática via `vercel.json`)
- **Backend**: Deploy em Railway, Render ou Vercel Serverless Functions

Veja o [Guia de Deploy](./DEPLOY.md) para instruções detalhadas.

## 🏗️ Arquitetura

O sistema é composto por:

- **API Service**: CRUD de URLs, autenticação, domínios
- **Redirect Service**: Resolução e redirecionamento de URLs
- **Analytics Worker**: Processamento assíncrono de eventos de clique
- **Cache Layer (Redis)**: Cache de resolução de URLs com TTL de 24 horas
- **Database (PostgreSQL)**: Armazenamento transacional

### Fluxos Principais

#### Criar URL
1. Validação de entrada (Zod)
2. Verificação de limites do plano
3. Geração de short code
4. Persistência no banco
5. Cache no Redis (`short:{domainId}:{shortCode}`)
6. Retorno da URL curta

#### Redirecionar URL
1. Extração do código e domínio
2. Busca no cache (Redis) - cache-first strategy
3. Fallback para banco se cache miss
4. Validação (ativa, não expirada)
5. Publicação assíncrona de evento na fila
6. Redirecionamento HTTP 301/302

#### Analytics
1. Evento publicado na fila (não bloqueia o redirect)
2. Worker processa evento assincronamente
3. Enriquecimento (GeoIP, UA parsing)
4. Persistência no banco

## 📝 Tecnologias

### Backend
- **Node.js** + **TypeScript** - Runtime e tipagem estática
- **Fastify** - Framework HTTP de alta performance (superior ao Express)
- **Prisma** - ORM type-safe com migrations automáticas
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache de resolução de URLs e filas
- **BullMQ** - Sistema de filas para processamento assíncrono

**Decisões de Design:**
- Fastify escolhido por performance superior, suporte nativo a TypeScript e plugin ecosystem robusto
- Prisma para type-safe queries e melhor developer experience
- Cache-first strategy com Redis para máxima performance
- Processamento assíncrono de analytics para não bloquear redirects

### Frontend
- **Next.js 14** (App Router) - Framework React com Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Utility-first CSS com dark mode ready
- **shadcn/ui** - Componentes acessíveis baseados em Radix UI
- **React Query** - Data fetching com cache automático e invalidação inteligente
- **React Hook Form** + **Zod** - Formulários performáticos com validação type-safe
- **Recharts** - Gráficos responsivos e customizáveis
- **date-fns** - Manipulação de datas

**Decisões de Design:**
- Next.js 14 App Router para Server Components por padrão e melhor performance
- shadcn/ui para componentes acessíveis e totalmente customizáveis
- React Query para gerenciamento eficiente de estado remoto
- Hooks customizados para cada domínio (auth, urls, domains, analytics)

## 🔐 Segurança

- **JWT** para autenticação stateless
- **Bcrypt** para hash de senhas
- **Rate limiting** por IP
- **Helmet** para headers de segurança HTTP
- **CORS** configurável por ambiente
- **Validação de entrada** com Zod em todas as rotas

## ⚡ Performance

- Cache-first strategy com Redis
- Processamento assíncrono de eventos (não bloqueia redirects)
- Índices otimizados no banco de dados
- Queries eficientes com Prisma
- Server Components no frontend quando possível
- Code splitting automático por rota
- Tree shaking para reduzir bundle size

## 🔐 Variáveis de Ambiente

Veja `backend/env.example` e `frontend/.env.example` para todas as variáveis necessárias.

## 📄 Licença

Este projeto é público e open source.