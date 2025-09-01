````markdown
# 🚀 API com NestJS + TypeORM + PostgreSQL (Neon)

Uma API desenvolvida em **NestJS** com integração ao **TypeORM** e banco **PostgreSQL (Neon)** e **WebSockets para chat**.  
O projeto já vem configurado com autenticação JWT, repositórios, e suporte a migrações automáticas.


---

## 📦 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js para aplicações escaláveis
- [TypeORM](https://typeorm.io/) — ORM para integração com PostgreSQL
- [PostgreSQL (Neon)](https://neon.tech/) — Banco de dados serverless
- [JWT](https://jwt.io/) — Autenticação segura baseada em tokens
- [Dotenv](https://github.com/motdotla/dotenv) — Gerenciamento de variáveis de ambiente

---

## ⚙️ Setup do Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/leomiclos/cx_talk_api
cd cx_talk_api
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```env
# Banco de dados
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=3600s
```

---

## ▶️ Rodando a Aplicação

### Ambiente de desenvolvimento

```bash
npm run start:dev
```

### Ambiente de produção

```bash
npm run build
npm run start:prod
```
## 🧪 Testes

Rodar testes unitários:

```bash
npm run test
```

Rodar testes e2e:

```bash
npm run test:e2e
```

Cobertura de testes:

```bash
npm run test:cov
```

---

## 📜 Scripts Disponíveis

* `npm run start:dev` — Rodar a API em modo dev
* `npm run start:prod` — Rodar em produção
* `npm run build` — Compilar a aplicação
* `npm run lint` — Verificar estilo de código
* `npm run typeorm ...` — Comandos do TypeORM
* `npm run test*` — Testes

---

## 📌 Endpoints

```http
POST /auth/login
POST /auth/register
GET  /users/me
GET /users/all
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'feat: adicionei nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 🚀

---
