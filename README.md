# Encurtador de links - Back-end NoSQL

Comandos de criação do Banco:

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
```

```
CREATE TABLE sessions (
	id SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	online BOOLEAN NOT NULL DEFAULT TRUE,
	logout TIMESTAMP,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```
