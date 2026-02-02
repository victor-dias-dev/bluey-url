# Frontend - Bluey URL Shortener

Frontend desenvolvido em Next.js 14 com App Router, TypeScript, Tailwind CSS e shadcn/ui.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes)
- **React Query** (data fetching)
- **React Hook Form** + **Zod** (formulários)
- **Recharts** (gráficos)
- **date-fns** (datas)

## Setup

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar em desenvolvimento
npm run dev
```

## Estrutura

```
frontend/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   │   ├── (auth)/       # Rotas de autenticação
│   │   ├── dashboard/    # Dashboard protegido
│   │   └── layout.tsx    # Layout raiz
│   ├── components/       # Componentes React
│   │   ├── ui/           # Componentes shadcn/ui
│   │   ├── layout/       # Componentes de layout
│   │   ├── auth/         # Formulários de auth
│   │   ├── urls/         # Componentes de URLs
│   │   ├── analytics/    # Componentes de analytics
│   │   └── domains/      # Componentes de domínios
│   ├── hooks/            # React Query hooks
│   ├── services/         # Serviços de API
│   ├── lib/              # Utilitários
│   └── types/            # Tipos TypeScript
└── public/               # Arquivos estáticos
```

## Funcionalidades

### Autenticação
- Login e registro
- Proteção de rotas
- Gerenciamento de token JWT

### Dashboard
- Visão geral com estatísticas
- Listagem de URLs
- Criação e edição de URLs
- Analytics com gráficos
- Gerenciamento de domínios

### URLs
- Criar URLs encurtadas
- Custom codes (planos pagos)
- Domínios customizados
- Expiração configurável
- Copiar URL com 1 clique

### Analytics
- Gráficos de cliques por data
- Distribuição por país
- Distribuição por dispositivo
- Tabela de cliques recentes

### Domínios
- Adicionar domínios customizados
- Verificação DNS
- Status de verificação

## Variáveis de Ambiente

Veja `.env.example` para todas as variáveis necessárias.

## Documentação

Cada módulo possui um arquivo `cursor.md` com informações técnicas e decisões de design.

