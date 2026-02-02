
# 📕 DOCUMENTAÇÃO DE REGRAS DE NEGÓCIO

## URL Shortener SaaS

---

## 1. Usuários

### 1.1 Tipos de Usuário

* Free
* Pro
* Enterprise

### 1.2 Regras

* Usuário Free pode criar até X links ativos
* Usuário Pro não tem limite
* Usuário pode deletar ou desativar links

---

## 2. URLs Encurtadas

### 2.1 Criação

* URL original deve ser válida
* Protocolo obrigatório (http/https)
* Código curto deve ser único por domínio
* Custom alias permitido apenas em planos pagos

---

### 2.2 Expiração

* URL pode ter data de expiração opcional
* Após expiração:

  * Link retorna HTTP 410 (Gone)
  * Não redireciona

---

### 2.3 Status

* `is_active = false`:

  * Link retorna HTTP 404
* `is_active = true`:

  * Link funciona normalmente

---

## 3. Domínios Customizados

### 3.1 Regras

* Apenas usuários pagos
* Domínio deve ser verificado via DNS
* Um domínio pertence a um único usuário

---

## 4. Redirecionamento

### 4.1 Regras

* Redirecionamento padrão: **301**
* Pode usar 302 se configurado
* Nunca registrar clique de forma síncrona

---

## 5. Analytics

### 5.1 Cliques

* Cada acesso gera um evento
* Cliques são processados de forma assíncrona
* IP pode ser anonimizado (LGPD)

---

### 5.2 Relatórios

* Total de cliques
* Cliques por período
* Cliques por país
* Cliques por dispositivo

---

## 6. Segurança

* Rate limit por IP
* Proteção contra brute force
* Blacklist de domínios maliciosos
* Preview page opcional

---

## 7. Exclusão de Dados

* URLs deletadas:

  * Não são removidas imediatamente
  * Marcadas como inativas
* Eventos de clique:

  * Retenção configurável
  * Exclusão automática após X dias

---

## 8. Monetização (futuro)

* Limite por plano
* Domínios customizados
* API access
* Exportação de dados