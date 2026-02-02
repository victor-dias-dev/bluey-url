# Frontend - Bluey URL Shortener

Frontend desenvolvido em Next.js 14 com App Router, TypeScript, Tailwind CSS e shadcn/ui para o sistema de encurtador de URLs.

## Stack

- **Next.js 14** (App Router) - Framework React com Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Utility-first CSS com dark mode ready
- **shadcn/ui** - Componentes acessíveis baseados em Radix UI
- **React Query** - Data fetching com cache automático
- **React Hook Form** + **Zod** - Formulários performáticos com validação type-safe
- **Recharts** - Gráficos responsivos e customizáveis
- **date-fns** - Manipulação de datas

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

## Arquitetura

### Next.js 14 App Router
- Estrutura baseada em arquivos e pastas
- Server Components por padrão
- Client Components quando necessário ("use client")
- Layouts aninhados
- Route groups para organização

### Componentização
- Componentes pequenos e focados
- Separação de responsabilidades
- Reutilização máxima
- Props tipadas com TypeScript

### Estado e Dados
- React Query para estado remoto
- Hooks customizados para cada domínio
- Cache automático
- Invalidação inteligente

## Estrutura

```
frontend/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   │   ├── (auth)/       # Rotas de autenticação
│   │   ├── dashboard/    # Dashboard protegido
│   │   └── layout.tsx    # Layout raiz
│   ├── components/       # Componentes React
│   │   ├── ui/           # Componentes shadcn/ui (base)
│   │   ├── layout/       # Componentes de layout
│   │   ├── auth/         # Formulários de auth
│   │   ├── urls/         # Componentes de URLs
│   │   ├── analytics/    # Componentes de analytics
│   │   └── domains/      # Componentes de domínios
│   ├── hooks/            # React Query hooks customizados
│   ├── services/         # Serviços de API
│   ├── lib/              # Utilitários
│   └── types/            # Tipos TypeScript
└── public/               # Arquivos estáticos
```

## Decisões de Design

### UI Framework: shadcn/ui
- Componentes acessíveis (Radix UI)
- Totalmente customizáveis
- Design system consistente
- Zero dependências desnecessárias

### Styling: Tailwind CSS
- Utility-first CSS
- Design tokens configuráveis
- Dark mode ready
- Performance otimizada

### Formulários: React Hook Form + Zod
- Validação no cliente e servidor
- Performance otimizada
- Tipagem forte
- Mensagens de erro claras

### Gráficos: Recharts
- Componentes React nativos
- Responsivo
- Customizável
- Performance otimizada

## Hooks Customizados

### use-auth.ts
- Autenticação e gerenciamento de usuário
- Login, registro, logout
- Proteção de rotas

### use-urls.ts
- CRUD de URLs
- Cache e invalidação automática
- Toast notifications

### use-domains.ts
- Gerenciamento de domínios
- Verificação DNS
- Status de verificação

### use-analytics.ts
- Dados de analytics
- Gráficos e estatísticas
- Cliques recentes

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

## Performance

### Otimizações
- Server Components quando possível
- Lazy loading de componentes pesados
- Cache do React Query
- Skeleton loaders para melhor UX

### Bundle Size
- Tree shaking automático
- Code splitting por rota
- Imports dinâmicos quando necessário

## Acessibilidade

- Componentes Radix UI acessíveis
- Navegação por teclado
- Screen reader friendly
- ARIA labels apropriados

## Variáveis de Ambiente

### Desenvolvimento Local

Crie um arquivo `.env.local` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Produção (Vercel)

Configure na Vercel Dashboard:
- `NEXT_PUBLIC_API_URL`: URL do backend deployado (ex: `https://api.bluey-url.com`)

**Importante**: Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente e devem ser públicas.

## 🚀 Deploy

### Deploy na Vercel

1. Conecte seu repositório na [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detect)
3. Adicione variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL do seu backend
4. Deploy automático a cada push

O projeto já inclui `vercel.json` na raiz para configuração automática.

Veja o [Guia de Deploy](../DEPLOY.md) completo para mais detalhes.

## Documentação

Cada módulo possui um arquivo `cursor.md` com informações técnicas detalhadas, decisões de design e exemplos de uso.

