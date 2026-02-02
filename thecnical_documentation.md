# 📘 DOCUMENTAÇÃO TÉCNICA

## Sistema de Encurtador de URLs (Bluey_url)

---

## 1. Visão Geral do Sistema

O sistema tem como objetivo fornecer um serviço de encurtamento de URLs com suporte a:

* Redirecionamento rápido e confiável
* Domínios customizados
* Expiração de links
* Analytics de cliques
* Autenticação de usuários
* Escalabilidade horizontal

O sistema será projetado seguindo princípios de:

* **Alta performance**
* **Alta disponibilidade**
* **Separação de responsabilidades**
* **Evolução incremental**

---

## 2. Arquitetura Geral

### 2.1 Visão de Alto Nível

```
Client
  ↓
CDN / Reverse Proxy
  ↓
Redirect Service (Fastify)
  ↓
Redis (Cache)
  ↓
PostgreSQL (Fallback)
```

Eventos de clique:

```
Redirect
 → Event Queue (BullMQ)
 → Analytics Worker
 → Analytics Storage
```

---

## 3. Stack Tecnológica

### Backend

* **Node.js**
* **TypeScript**
* **Fastify** (HTTP server)
* **Prisma ORM**

### Banco de Dados

* **PostgreSQL** (dados transacionais)
* **Redis** (cache e filas)
* **ClickHouse / PostgreSQL particionado** (analytics – fase 2)

### Infra

* Docker
* Nginx / Cloudflare
* Kubernetes (futuro)

---

## 4. Componentes do Sistema

### 4.1 API Service

Responsável por:

* CRUD de URLs
* Autenticação
* Domínios
* Dashboard
* Planos

### 4.2 Redirect Service

Responsável por:

* Resolver short URL → long URL
* Redirecionar (HTTP 301/302)
* Publicar evento de clique

⚠️ **Não deve conter lógica pesada**

---

### 4.3 Cache Layer (Redis)

Responsável por:

* Cache de resolução de URLs
* Rate limiting
* Fila de eventos

Chave:

```
short:{domain}:{code} → original_url
```

TTL padrão: 24h

---

### 4.4 Analytics Worker

Responsável por:

* Consumir eventos de clique
* Enriquecer dados (GeoIP, UA)
* Persistir eventos de forma assíncrona

---

## 5. Modelo de Dados (Resumo)

### URLs

* short_code (único por domínio)
* original_url
* user_id
* domain_id
* expires_at
* is_active

### Click Events

* url_id
* timestamp
* ip
* user_agent
* country

---

## 6. Fluxos Principais

### 6.1 Criar URL Encurtada

1. Usuário envia URL original
2. Sistema valida URL
3. Gera `short_code`
4. Persiste no banco
5. Retorna URL curta

---

### 6.2 Resolver URL (Redirect)

1. Recebe `GET /{code}`
2. Busca no Redis
3. Se não existir, consulta PostgreSQL
4. Armazena no cache
5. Publica evento de clique
6. Redireciona

---

## 7. Requisitos Não Funcionais

* Latência média de redirect: **< 50ms**
* Disponibilidade: **99.9%**
* Escalável horizontalmente
* Stateless services
* Logs estruturados