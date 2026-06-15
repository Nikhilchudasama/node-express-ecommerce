# node-express-ecommerce

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma)](https://www.prisma.io)
[![Node](https://img.shields.io/badge/Node-22-339933?logo=nodedotjs)](https://nodejs.org)

Production-ready Node.js REST API for an eCommerce system. Built with TypeScript, Express 5, Prisma 7, and PostgreSQL. Runs anywhere with Docker.

---

## Features

- **Authentication** — JWT-based register, login, token refresh, logout, profile management
- **Role-based access control** — Admin and Customer roles with middleware guards
- **Products** — Full CRUD, search, filtering, sorting, pagination, soft-delete
- **Categories** — Hierarchical (parent/child), slug-based, CRUD
- **Cart** — Add, update, remove items; clear cart; price snapshots
- **Orders** — Create from cart, status workflow (8 states), admin management
- **Reviews** — Per-user-per-product, rating, verified purchase flag
- **Coupons** — Discount codes with percentage/fixed, usage limits, date validity, validation endpoint
- **Product Images** — Multiple images per product, primary flag, sort order
- **Security** — Helmet, CORS, rate limiting, input validation (Zod), password hashing (bcryptjs)
- **Docker** — Multi-stage build, Compose with auto-migrations, dev hot-reload profile
- **Testing** — Jest unit tests for services

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Runtime        | Node.js 22                                   |
| Framework      | Express 5                                    |
| Language       | TypeScript 6                                 |
| Database       | PostgreSQL 16                                |
| ORM            | Prisma 7 (with adapter-pg)                   |
| Auth           | JWT (jsonwebtoken + bcryptjs)                |
| Validation     | Zod 4                                        |
| Logging        | Winston                                      |
| Testing        | Jest + Supertest                             |
| Container      | Docker (multi-stage) + Docker Compose        |

---

## Project Structure

```
├── Dockerfile                   # Multi-stage build (builder → deps → runtime)
├── docker-compose.yml           # Production Compose (db, migrate, app)
├── docker-compose.override.yml  # Dev profile (volumes, hot-reload)
├── .env.example                 # Environment variable template
├── prisma/
│   ├── schema.prisma            # 11 models, 5 enums
│   ├── migrations/              # Auto-generated migration history
│   └── seed.js                  # Development seed data
├── src/
│   ├── index.ts                 # Server entry point
│   ├── app.ts                   # Express app setup (middleware, routes)
│   ├── config/                  # Env, Prisma client, logger, DI container
│   ├── routes/                  # Route definitions (10 routers)
│   ├── controllers/             # HTTP handlers (thin)
│   ├── services/                # Business logic
│   ├── repositories/            # Prisma data access (8 repositories)
│   ├── validators/              # Zod schemas + validation middleware
│   ├── middleware/              # Auth, RBAC, error handler, not-found
│   ├── auth/                    # JWT sign/verify, password hash
│   ├── utils/                   # Response helpers, API error class
│   └── models/                  # TypeScript type definitions
├── tests/                       # Service unit tests
└── postman/                     # Postman collection with all endpoints
```

---

## Quick Start

### With Docker (recommended)

```bash
# Development (hot-reload on file changes)
docker compose up --build

# Production
docker compose -f docker-compose.yml up --build
```

The API is available at `http://localhost:3000/api/v1/health`.

### Without Docker

**Prerequisites:** Node.js 22, PostgreSQL 16.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your local PostgreSQL

# 3. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# 4. Seed development data
npm run prisma:seed

# 5. Start
npm run dev          # development with hot-reload
# or
npm run build        # production build
npm start
```

---

## Environment Variables

| Variable           | Required | Default                   | Description                        |
| ------------------ | -------- | ------------------------- | ---------------------------------- |
| `DATABASE_URL`     | Yes      | —                         | PostgreSQL connection string       |
| `JWT_SECRET`       | Yes      | —                         | Access token signing secret        |
| `JWT_REFRESH_SECRET` | No    | Falls back to `JWT_SECRET` | Refresh token signing secret      |
| `PORT`             | No       | `3000`                    | API server port                    |
| `NODE_ENV`         | No       | `development`             | Runtime environment                |
| `CORS_ORIGIN`      | No       | `*`                       | Allowed CORS origin                |
| `LOG_LEVEL`        | No       | `info`                    | Winston log level                  |

---

## Scripts

| Script                  | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start with ts-node-dev (hot-reload) |
| `npm run build`         | Compile TypeScript to `dist/`      |
| `npm start`             | Run compiled app                   |
| `npm test`              | Run Jest tests                     |
| `npm run lint`          | ESLint                             |
| `npm run prisma:generate` | Generate Prisma client           |
| `npm run prisma:migrate`  | Run Prisma migrations (dev)      |
| `npm run prisma:seed`   | Seed development data              |
| `npm run prisma:studio` | Open Prisma Studio                 |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Health

| Method | Path              | Auth   | Description    |
| ------ | ----------------- | ------ | -------------- |
| GET    | `/health`         | —      | Health check   |

### Auth

| Method | Path              | Auth   | Description                |
| ------ | ----------------- | ------ | -------------------------- |
| POST   | `/auth/register`  | —      | Register new user          |
| POST   | `/auth/login`     | —      | Login                      |
| POST   | `/auth/refresh`   | —      | Refresh tokens             |
| POST   | `/auth/logout`    | User   | Logout                     |
| GET    | `/auth/me`        | User   | Get profile                |
| PATCH  | `/auth/me`        | User   | Update profile             |
| PATCH  | `/auth/password`  | User   | Change password            |

### Products

| Method | Path                | Auth    | Description                          |
| ------ | ------------------- | ------- | ------------------------------------ |
| GET    | `/products`         | —       | List products (search, filter, sort) |
| GET    | `/products/:id`     | —       | Get product detail                   |
| POST   | `/products`         | Admin   | Create product                       |
| PATCH  | `/products/:id`     | Admin   | Update product                       |
| DELETE | `/products/:id`     | Admin   | Delete (soft)                        |

### Product Images

| Method | Path                                    | Auth    | Description        |
| ------ | --------------------------------------- | ------- | ------------------ |
| GET    | `/products/:productId/images`           | —       | List images        |
| POST   | `/products/:productId/images`           | Admin   | Create image       |
| PATCH  | `/products/:productId/images/:imageId`  | Admin   | Update image       |
| DELETE | `/products/:productId/images/:imageId`  | Admin   | Delete image       |

### Reviews

| Method | Path                              | Auth   | Description            |
| ------ | --------------------------------- | ------ | ---------------------- |
| GET    | `/products/:productId/reviews`    | —      | List product reviews   |
| POST   | `/products/:productId/reviews`    | User   | Create review          |
| DELETE | `/reviews/:id`                    | User*  | Delete review          |

*Owner or admin.

### Categories

| Method | Path                  | Auth    | Description          |
| ------ | --------------------- | ------- | -------------------- |
| GET    | `/categories`         | —       | List categories      |
| GET    | `/categories/:id`     | —       | Get category detail  |
| POST   | `/categories`         | Admin   | Create category      |
| PATCH  | `/categories/:id`     | Admin   | Update category      |
| DELETE | `/categories/:id`     | Admin   | Delete category      |

### Cart

| Method | Path                       | Auth   | Description         |
| ------ | -------------------------- | ------ | ------------------- |
| GET    | `/cart`                    | User   | Get current cart    |
| POST   | `/cart/items`              | User   | Add item            |
| PATCH  | `/cart/items/:productId`   | User   | Update item qty     |
| DELETE | `/cart/items/:productId`   | User   | Remove item         |
| DELETE | `/cart`                    | User   | Clear cart          |

### Orders

| Method | Path                      | Auth    | Description           |
| ------ | ------------------------- | ------- | --------------------- |
| POST   | `/orders`                 | User    | Create from cart      |
| GET    | `/orders/mine`            | User    | List my orders        |
| GET    | `/orders/:id`             | User*   | Get order detail      |
| GET    | `/orders/admin`           | Admin   | List all orders       |
| PATCH  | `/orders/:id/status`      | Admin   | Update status         |

*Owner or admin.

### Coupons

| Method | Path                  | Auth    | Description              |
| ------ | --------------------- | ------- | ------------------------ |
| GET    | `/coupons/validate`   | —       | Validate coupon code     |
| GET    | `/coupons`            | Admin   | List coupons             |
| GET    | `/coupons/:id`        | Admin   | Get coupon               |
| POST   | `/coupons`            | Admin   | Create coupon            |
| PATCH  | `/coupons/:id`        | Admin   | Update coupon            |
| DELETE | `/coupons/:id`        | Admin   | Delete coupon            |

---

## Database Schema

11 models with 5 enums:

```
User ──┐
       ├── Address (1:N)
       ├── Cart (1:1)
       ├── Order (1:N) ── OrderItem (N:N with Product)
       └── Review (N:1 with Product)

Category ── Product (1:N) ── ProductImage (1:N)
                            ├── CartItem (N:N with Cart)
                            ├── OrderItem (N:N with Order)
                            └── Review (1:N)

Coupon ── Order (1:N)
       └── Cart (1:N)
```

Order lifecycle: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED` (or `CANCELLED / RETURNED / REFUNDED`).

---

## Design Decisions

- **Controllers are thin** — They parse the request and delegate to services.
- **Services own business logic** — Validation, authorization, orchestration.
- **Repositories own Prisma queries** — Data access is isolated.
- **Dependency injection via container** — `Container` class wires all dependencies; no manual `new` in controllers.
- **UUID for user-facing IDs** — User, Order, Cart use UUID; auto-increment for internal entities (Product, Category).
- **Soft-delete for Products** — `deletedAt` field; filtered automatically via Prisma `$extends`.
- **Composite unique constraints** — One review per user per product; one cart item per product per cart.

---

## Testing

```bash
npm test
```

Tests cover auth, product, category, cart, and order services with mocked repositories.

---

## Postman

A Postman collection is available at [`postman/`](postman/Node-Express-Basic-Demo.postman_collection.json). Import it and set the `baseUrl` variable to `http://localhost:3000/api/v1`.

---

## License

[MIT](LICENSE)
