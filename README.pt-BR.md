# Bluey URL

[![CI](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml/badge.svg)](https://github.com/victor-dias-dev/bluey-url/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Bluey URL é um encurtador open source. Ele cria links, redireciona a partir do cache e oferece um painel para aliases, domínios próprios e analytics.

O projeto está na [0.1.0](CHANGELOG.md). Redirecionamento, contas e limites de plano funcionam. O worker de analytics e a verificação de DNS não. Essa divisão está documentada de propósito: o [roadmap](ROADMAP.md) é a lista de formas de contribuir.

[English](README.md)

## Estado atual

| Capacidade | Estado |
| --- | --- |
| Cadastro, login e gestão de links | Funciona |
| Redirect `301` / `302`, com expiração | Funciona |
| Cache no Redis que preserva status e expiração | Funciona |
| Limite do plano Free, alias e domínio nos planos pagos | Funciona |
| Analytics de cliques no painel | A forma da API existe. Os cliques entram na fila e ainda não são gravados. |
| Verificação de DNS do domínio próprio | A API devolve o TXT esperado. A verificação responde `501`. |

## Começar

Requisitos: Node.js 20 e Docker.

```bash
git clone https://github.com/victor-dias-dev/bluey-url.git
cd bluey-url
npm install
docker compose -f docker-compose.dev.yml up -d
cp backend/env.docker.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run prisma:migrate
npm run prisma:seed
```

Em dois terminais:

```bash
npm run dev:backend   # http://localhost:3000
npm run dev:frontend  # http://localhost:3001
```

O seed cria `test@example.com` / `password123` só para uso local. Não rode isso num banco que você precisa manter. Os detalhes estão em [SECURITY.md](SECURITY.md).

O Postgres sobe em `localhost:5432` (`bluey_user` / `bluey_password` / `bluey_url`). O Redis sobe em `localhost:6379`.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm test` | Testes de domínio e de configuração |
| `npm run lint` | ESLint do backend e lint do Next.js |
| `npm run typecheck` | TypeScript nos dois pacotes |
| `npm run dev:backend` | API com reload |
| `npm run dev:frontend` | Painel |
| `npm run prisma:studio` | Interface do banco |

## Mapa do repositório

```
backend/     API Fastify, schema Prisma e regras de domínio
frontend/    Painel em Next.js
docs/        Arquitetura e regras, alinhadas ao código
```

Leia [docs/architecture.md](docs/architecture.md) antes de mudar o redirect. As regras e o status de cada uma estão em [docs/business-rules.md](docs/business-rules.md). Docker está em [DOCKER.md](DOCKER.md).

## Contribuir

Issues e pull requests são bem-vindos em português ou inglês. Comece por [CONTRIBUTING.md](CONTRIBUTING.md) e pelo [roadmap](ROADMAP.md). Pull requests pequenos, que fecham um item já listado, são os que recebem review primeiro.

Vulnerabilidades vão por [aviso privado](https://github.com/victor-dias-dev/bluey-url/security/advisories/new), não por issue pública.

## Licença

[MIT](LICENSE)
