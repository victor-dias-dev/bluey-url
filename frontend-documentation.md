Perfeito. Abaixo está um **texto pronto, técnico e direto**, pensado **exatamente para você entregar para uma IA (ou time frontend)** e ela **iniciar o front-end corretamente**, sem decisões erradas de stack nem gambiarra.

Vou escrever **como um Frontend Technical Spec / Prompt de Execução**.

---

# 📘 FRONT-END TECHNICAL SPEC

## URL Shortener SaaS – Frontend

### Objetivo

Criar o **front-end de um sistema SaaS de encurtador de URLs**, similar ao Bitly, responsável por:

* Dashboard do usuário
* Criação e gerenciamento de links
* Visualização de analytics
* Gerenciamento de domínios e conta
* Consumo das APIs existentes

O foco do front-end é:

* Performance
* Experiência do usuário
* Escalabilidade
* Código limpo e manutenível

---

## 🧠 Framework escolhido

### ✅ Next.js (App Router)

**Justificativa arquitetural**:

* Renderização híbrida (SSR + CSR)
* Excelente SEO
* Suporte nativo a rotas, layouts e metadata
* Ótima integração com APIs REST
* Padrão de mercado para SaaS modernos

**Versão**: Next.js 14+
**Router**: App Router
**Linguagem**: TypeScript

---

## 🎨 Estilo e UI

### UI Framework

**Tailwind CSS**

* Alta produtividade
* Design consistente
* Excelente para dashboards
* Zero runtime CSS

### Componentes

**shadcn/ui**

* Componentes acessíveis
* Baseado em Radix UI
* Totalmente customizável
* Perfeito para SaaS e dashboards

---

## 📦 Principais bibliotecas recomendadas

### State & Data Fetching

* **@tanstack/react-query**

  * Cache automático
  * Retry
  * Sincronização de estado remoto
  * Ideal para consumo de APIs REST

### Formulários

* **react-hook-form**
* **zod**

  * Validação de formulários
  * Tipagem forte
  * Integração direta com backend

---

### Autenticação

* **NextAuth.js** (Auth.js)

  * JWT / Cookie-based
  * Proteção de rotas
  * Integração fácil com backend

---

### Gráficos & Analytics

* **recharts** ou **chart.js**
* **date-fns**

  * Gráficos de cliques
  * Filtros por período

---

### UX & Produtividade

* **sonner** ou **react-hot-toast** (notificações)
* **lucide-react** (ícones)
* **clsx** ou **class-variance-authority**

---

## 🧩 Estrutura de pastas sugerida

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── urls/
│   │   ├── analytics/
│   │   ├── domains/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/            (shadcn)
│   ├── layout/
│   ├── charts/
│
├── services/
│   └── api.ts
│
├── hooks/
│
├── lib/
│   ├── auth.ts
│   ├── queryClient.ts
│
├── types/
│
└── styles/
```

---

## 🔌 Consumo das APIs

### Padrão de comunicação

* REST
* JSON
* Autenticação via JWT (Bearer Token)
* Base URL configurável por `.env`

```ts
axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

### Endpoints para consumir

C:\Users\novou\Documents\Victor\bluey-url\backend\src\routes
---

## 🔐 Regras importantes no Front-end

* Proteger rotas privadas (`/dashboard`)
* Validar formulários antes de enviar
* Exibir mensagens claras de erro
* Nunca expor segredos no client
* Tratar estados de loading e erro
* Não confiar em validações apenas do front

---

## 🎯 Requisitos de UX

* Dashboard rápido e responsivo
* Feedback visual em todas ações
* Copiar URL curta com 1 clique
* Filtros de período nos gráficos
* Design limpo e profissional (SaaS-grade)
