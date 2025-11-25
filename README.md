# association-rca-backend

Backend API for managing associations, members, contributions, and activities in the Central African Republic.

## Setup

Install dependencies:

```bash
bun install
```

Create a `.env` file with the connection string and JWT secret:

```bash
DATABASE_URL=postgres://app:app@localhost:5432/association
JWT_SECRET=change-me-please
PORT=3000
```

Start Postgres locally (optional):

```bash
bunx docker compose up -d
```

Generate and run database migrations with Drizzle:

```bash
bunx drizzle-kit generate
bunx drizzle-kit push
```

## Development

Run the API with Bun:

```bash
bun run index.ts
```

The server exposes authentication, associations, members, contributions, and activities routes under the base URL. Protected routes expect a `Bearer` token created by the `/auth/login` endpoint.
