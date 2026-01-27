# Telegram Mini App — Link Shortener

Telegram Mini App для сокращения ссылок с аналитикой кликов.

## Технологии

### Frontend
- **React 18** + **TypeScript**
- **Vite** — сборка и dev-сервер
- **Tailwind CSS** — стилизация
- **@twa-dev/sdk** — Telegram Web App SDK
- **Recharts** — графики статистики
- **React Router** — маршрутизация

### Backend
- **Express** + **TypeScript**
- **Prisma** — ORM для PostgreSQL (ссылки, метаданные)
- **Mongoose** — ODM для MongoDB (клики, аналитика)
- **Redis** — кэширование и rate limiting
- **Biome** — линтинг и форматирование

## Структура проекта

```
telegram-mini-app/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/       # UI компоненты
│   │   │   ├── common/       # Button, Card, Input, CopyButton
│   │   │   ├── links/        # LinkCard, LinkGenerator, LinkList
│   │   │   ├── stats/        # ClicksChart, ClicksTable, StatsView
│   │   │   └── Layout/       # Header
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Home, Links, Stats
│   │   ├── routes/           # AppRoutes
│   │   ├── services/         # API, Telegram SDK
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript типы
│   │   └── utils/            # Утилиты
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/      # Обработчики запросов
│   │   ├── middleware/       # Валидация, rate limiting, ошибки
│   │   ├── models/           # Mongoose модели (Click)
│   │   ├── routes/           # API маршруты
│   │   ├── services/         # Бизнес-логика, кэширование
│   │   ├── config/           # Конфигурация
│   │   ├── types/            # TypeScript типы
│   │   └── utils/            # Утилиты
│   ├── prisma/
│   │   └── schema.prisma     # Схема PostgreSQL
│   ├── docker-compose.yml    # PostgreSQL, MongoDB, Redis
│   └── package.json
│
├── shared/                   # Общий код frontend/backend
│   ├── constants/
│   ├── types/
│   └── utils/
│
├── biome.json                # Конфигурация Biome
├── tsconfig.base.json        # Базовый TypeScript конфиг
└── package.json              # Корневой package.json
```

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установить все зависимости (root + frontend + backend)
pnpm run install:all

# Или по отдельности
pnpm install
cd frontend && pnpm install
cd backend && pnpm install
```

### 2. Запуск баз данных

```bash
cd backend
docker-compose up -d
```

Это запустит:
- **PostgreSQL** на порту `5432`
- **MongoDB** на порту `27017`
- **Redis** на порту `6379`

### 3. Настройка переменных окружения

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env` при необходимости.

### 4. Инициализация базы данных

```bash
# Генерация Prisma клиента
pnpm run db:generate

# Применение миграций
pnpm run db:migrate

# Или push схемы напрямую (для разработки)
pnpm run db:push
```

### 5. Запуск проекта

```bash
# Запуск frontend и backend одновременно
pnpm run dev

# Или по отдельности
pnpm run dev:frontend    # http://localhost:5173
pnpm run dev:backend     # http://localhost:3000
```

## Доступные команды

### Корневые команды

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск frontend + backend |
| `pnpm dev:frontend` | Только frontend |
| `pnpm dev:backend` | Только backend |
| `pnpm build` | Сборка frontend + backend |
| `pnpm start` | Запуск production backend |
| `pnpm install:all` | Установка всех зависимостей |
| `pnpm lint` | Проверка кода |
| `pnpm lint:fix` | Автоисправление lint ошибок |
| `pnpm db:generate` | Генерация Prisma клиента |
| `pnpm db:migrate` | Применение миграций |
| `pnpm db:push` | Push схемы в БД |

### Frontend команды (в папке `frontend/`)

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Dev-сервер на `localhost:5173` |
| `pnpm build` | Production сборка |
| `pnpm preview` | Превью production сборки |
| `pnpm lint` | Biome проверка |

### Backend команды (в папке `backend/`)

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Dev-сервер с hot reload |
| `pnpm build` | Компиляция TypeScript |
| `pnpm start` | Запуск production |
| `pnpm db:generate` | Генерация Prisma клиента |
| `pnpm db:migrate` | Создание и применение миграций |
| `pnpm db:push` | Push схемы без миграций |
| `pnpm lint` | Biome проверка |

## API Endpoints

### Ссылки

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/api/links` | Получить все ссылки |
| `POST` | `/api/links` | Создать короткую ссылку |
| `GET` | `/api/links/:shortCode` | Получить ссылку по коду |
| `DELETE` | `/api/links/:shortCode` | Удалить ссылку |
| `GET` | `/api/links/:shortCode/clicks` | Получить клики |
| `GET` | `/api/links/:shortCode/stats` | Получить статистику |

### Редирект

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/:shortCode` | Редирект на оригинальный URL |

### Health Check

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/health` | Статус сервера |

## Переменные окружения

```env
# Server
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/shortlink?schema=public"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/shortlink"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
CORS_ORIGIN="*"
IP_HASH_SALT="your-secret-salt-here"

# Rate Limiting
RATE_LIMIT_MAX=100
```
