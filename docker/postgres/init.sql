-- init do Postgres
-- Este script roda SOMENTE na primeira inicialização do volume.
-- Agora o schema/tabelas vêm de TypeORM migrations.
-- Nome do banco configurado no docker-compose: `gamerverse`.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Type ENUM usado em `journey_games.status`
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'journey_status') THEN
    CREATE TYPE journey_status AS ENUM (
      'COMPLETED',
      'PLAYING',
      'DROPPED',
      'PLATINUM',
      'WISHLIST'
    );
  END IF;
END
$$;

