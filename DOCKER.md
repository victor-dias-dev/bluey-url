# 🐳 Docker Setup - Bluey URL

Guia para executar o projeto usando Docker Compose.

## 📋 Pré-requisitos

- Docker Desktop instalado
- Docker Compose v2 (incluído no Docker Desktop)

## 🚀 Início Rápido

### Desenvolvimento (Recomendado)

Para desenvolvimento, use o `docker-compose.dev.yml` que roda apenas PostgreSQL e Redis. O backend roda localmente.

```bash
# Iniciar PostgreSQL e Redis
docker-compose -f docker-compose.dev.yml up -d

# Verificar se os containers estão rodando
docker-compose -f docker-compose.dev.yml ps

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar os containers
docker-compose -f docker-compose.dev.yml down
```

### Configurar Backend para Docker

1. Copie o arquivo de exemplo:
```bash
cd backend
cp .env.docker .env
```

2. Copie o arquivo de exemplo e configure:
```bash
cp env.docker.example .env
```

O arquivo `.env` deve conter as credenciais do Docker Compose:
   - **PostgreSQL**: `bluey_user` / `bluey_password` / `bluey_url`
   - **Redis**: `localhost:6379`

3. Execute as migrações:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Inicie o backend:
```bash
npm run dev
```

## 🏭 Produção

Para produção, use o `docker-compose.prod.yml` que inclui PostgreSQL, Redis e Backend.

### 1. Criar arquivo `.env` na raiz

```bash
# .env (na raiz do projeto)
POSTGRES_USER=bluey_user
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=bluey_url
POSTGRES_PORT=5432

REDIS_PORT=6379

BACKEND_PORT=3000

JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000
QUEUE_NAME=analytics-queue
```

### 2. Build e iniciar todos os serviços

```bash
# Build e iniciar
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs apenas do backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Parar todos os serviços
docker-compose -f docker-compose.prod.yml down

# Parar e remover volumes (⚠️ apaga dados)
docker-compose -f docker-compose.prod.yml down -v
```

## 📊 Gerenciamento

### Verificar status dos containers

```bash
docker-compose ps
```

### Acessar PostgreSQL

```bash
# Via docker exec
docker exec -it bluey-url-postgres psql -U bluey_user -d bluey_url

# Ou usar cliente externo
# Host: localhost
# Port: 5432
# User: bluey_user
# Password: bluey_password
# Database: bluey_url
```

### Acessar Redis CLI

```bash
docker exec -it bluey-url-redis redis-cli
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f backend
```

### Reiniciar serviços

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar serviço específico
docker-compose restart backend
```

## 🗄️ Volumes

Os dados são persistidos em volumes Docker:

- `postgres_data`: Dados do PostgreSQL
- `redis_data`: Dados do Redis

Para remover volumes (⚠️ apaga todos os dados):

```bash
docker-compose down -v
```

## 🔧 Troubleshooting

### Porta já em uso

Se as portas 5432 ou 6379 já estiverem em uso, edite o `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Mude a porta externa
```

E atualize o `.env` do backend:

```env
DATABASE_URL="postgresql://bluey_user:bluey_password@localhost:5433/bluey_url?schema=public"
```

### Container não inicia

Verifique os logs:

```bash
docker-compose logs [service-name]
```

### Resetar banco de dados

```bash
# Parar containers
docker-compose down

# Remover volume do PostgreSQL
docker volume rm bluey-url_postgres_data

# Iniciar novamente
docker-compose up -d
```

### Prisma não conecta

Certifique-se de que:
1. O PostgreSQL está rodando (`docker-compose ps`)
2. A `DATABASE_URL` no `.env` está correta
3. As credenciais correspondem ao docker-compose.yml

## 📝 Notas

- **Desenvolvimento**: Use `docker-compose.dev.yml` e rode o backend localmente
- **Produção**: Use `docker-compose.prod.yml` para tudo containerizado
- **Volumes**: Os dados são persistidos mesmo após parar os containers
- **Health Checks**: Os serviços aguardam os health checks antes de iniciar dependências

