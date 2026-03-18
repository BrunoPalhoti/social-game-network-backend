"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1710000000000 = void 0;
class InitSchema1710000000000 {
    name = "InitSchema1710000000000";
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'journey_status'
        ) THEN
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
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,

        name text NOT NULL,
        nickname text NOT NULL,

        created_at timestamptz NOT NULL DEFAULT now(),

        avatar_url text,
        banner_url text,
        banner_position text
          CHECK (
            banner_position IS NULL
            OR banner_position IN ('top','center','bottom')
            OR banner_position ~ '^[0-9]{1,3}$'
          ),

        favorite_game_name text,
        favorite_game_cover text,

        favorite_genre_name text,
        favorite_genre_cover text
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS platforms (
        id bigserial PRIMARY KEY,
        name text NOT NULL UNIQUE,
        image_url text
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_platforms (
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform_id bigint NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, platform_id)
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id bigserial PRIMARY KEY,
        name text NOT NULL UNIQUE
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS journey_games (
        id bigserial PRIMARY KEY,

        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rawg_game_id text NOT NULL,
        name text NOT NULL,
        cover_image_url text,

        status journey_status NOT NULL,

        started_at date,
        completed_at date,
        dropped_at date,

        hours_played integer CHECK (hours_played IS NULL OR hours_played >= 0),
        rating numeric(4,2) CHECK (rating IS NULL OR rating >= 0),

        platform_id bigint REFERENCES platforms(id) ON DELETE SET NULL,

        month_key char(7) NOT NULL CHECK (month_key ~ '^[0-9]{4}-[0-9]{2}$'),

        notes text,
        verdict text,
        is_100_percent boolean,
        dropped_reason text,
        release_date date,
        has_demo boolean,

        UNIQUE (user_id, month_key, rawg_game_id)
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS journey_game_genres (
        journey_game_id bigint NOT NULL REFERENCES journey_games(id) ON DELETE CASCADE,
        genre_id bigint NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (journey_game_id, genre_id)
      );
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_journey_games_user_month
      ON journey_games(user_id, month_key);
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_journey_games_user_status
      ON journey_games(user_id, status);
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS journey_game_genres;`);
        await queryRunner.query(`DROP TABLE IF EXISTS journey_games;`);
        await queryRunner.query(`DROP TABLE IF EXISTS genres;`);
        await queryRunner.query(`DROP TABLE IF EXISTS user_platforms;`);
        await queryRunner.query(`DROP TABLE IF EXISTS platforms;`);
        await queryRunner.query(`DROP TABLE IF EXISTS users;`);
        await queryRunner.query(`DROP TYPE IF EXISTS journey_status;`);
    }
}
exports.InitSchema1710000000000 = InitSchema1710000000000;
//# sourceMappingURL=1710000000000-InitSchema.js.map