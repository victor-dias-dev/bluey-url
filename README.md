# Bluey URL - URL Shortener SaaS

Sistema de encurtador de URLs desenvolvido como monorepo com backend em Node.js/TypeScript e frontend (a ser implementado).

## 📁 Estrutura do Projeto

```
bluey-url/
├── backend/          # API Backend (Fastify + Prisma)
├── frontend/         # Frontend (a ser implementado)
├── README.md         # Este arquivo
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
- [Docker Setup](./DOCKER.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

Cada módulo possui um arquivo `cursor.md` com informações técnicas detalhadas.

## 🏗️ Arquitetura

O sistema é composto por:

- **API Service**: CRUD de URLs, autenticação, domínios
- **Redirect Service**: Resolução e redirecionamento de URLs
- **Analytics Worker**: Processamento assíncrono de eventos de clique
- **Cache Layer (Redis)**: Cache de resolução de URLs
- **Database (PostgreSQL)**: Armazenamento transacional

## 📝 Tecnologias

### Backend
- Node.js + TypeScript
- Fastify (HTTP server)
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- React Hook Form + Zod
- Recharts

## 🔐 Variáveis de Ambiente

Veja `backend/env.example` para todas as variáveis necessárias.

## 📄 Licença

Este projeto é privado.