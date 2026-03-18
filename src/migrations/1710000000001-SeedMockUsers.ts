import { MigrationInterface, QueryRunner } from "typeorm";
import { readFile } from "fs/promises";
import { User } from "../db/entities/User";
import { Platform } from "../db/entities/Platform";
import { Genre } from "../db/entities/Genre";
import { UserPlatform } from "../db/entities/UserPlatform";
import { JourneyGame } from "../db/entities/JourneyGame";
import { JourneyGameGenre } from "../db/entities/JourneyGameGenre";
import { JourneyStatus } from "../db/journey-status.enum";

type MockUser = {
  id: string;
  username: string;
  email: string;
  password?: string;
  name?: string;
  nickname?: string;
  platform?: string;
  platforms?: Array<{ name: string; imageUrl?: string | null }>;
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  favoriteGenres?: Array<{ name: string; imageUrl?: string | null }>;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: "top" | "center" | "bottom" | number;
  journeyByYear?: Record<string, Array<MockJourneyGame>>;
  createdAt?: string;
};

type MockJourneyGame = {
  id: string;
  name: string;
  coverImageUrl?: string | null;
  startedAt?: string;
  completedAt?: string;
  droppedAt?: string;
  hoursPlayed?: number;
  rating?: number;
  status: string;
  platform?: string;
  genres?: string[];
  monthKey?: string; // YYYY-MM
  notes?: string;
  verdict?: string;
  droppedReason?: string;
  releaseDate?: string;
  hasDemo?: boolean;
};

function normalizeDateToYYYYMMDD(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Aceita "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm:ssZ"
  const s = value.trim();
  if (!s) return null;
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function normalizeMonthKey(game: MockJourneyGame): string | null {
  const mk = (game.monthKey ?? "").trim();
  if (/^[0-9]{4}-[0-9]{2}$/.test(mk)) return mk;
  // fallback: tenta inferir por data
  const date = game.completedAt ?? game.startedAt ?? game.droppedAt;
  const d = normalizeDateToYYYYMMDD(date);
  if (!d) return null;
  return d.slice(0, 7);
}

function normalizeHoursPlayed(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : NaN;
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

function normalizeStatus(value: unknown): JourneyStatus {
  const s = typeof value === "string" ? value.trim() : "";
  if (s in JourneyStatus) return s as JourneyStatus;
  // seed para dev: em caso de valor inesperado, coloca como COMPLETED.
  return JourneyStatus.COMPLETED;
}

export class SeedMockUsers1710000000001 implements MigrationInterface {
  name = "SeedMockUsers1710000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const mockUsersPath =
      process.env.MOCK_USERS_PATH?.trim() || "/app/mockUsers.json";

    const userCount = await queryRunner.manager.getRepository(User).count();
    if (userCount > 0) return;

    const raw = await readFile(mockUsersPath, "utf-8");
    const parsed = JSON.parse(raw) as { users?: MockUser[] };
    const mockUsers = Array.isArray(parsed.users) ? parsed.users : [];

    // Deduplicadores globais (para criar plataformas/genres primeiro)
    const platformNames = new Set<string>();
    const genreNames = new Set<string>();

    for (const u of mockUsers) {
      const userPlatforms =
        Array.isArray(u.platforms) && u.platforms.length > 0
          ? u.platforms
              .map((p) => (p?.name ?? "").trim())
              .filter(Boolean)
          : u.platform
            ? [u.platform.trim()]
            : [];

      for (const pn of userPlatforms) platformNames.add(pn);

      // favoriteGenre (ou primeiro da lista)
      const favGenre =
        (u.favoriteGenre ?? "").trim() ||
        (Array.isArray(u.favoriteGenres) && u.favoriteGenres[0]?.name
          ? u.favoriteGenres[0].name.trim()
          : "");
      if (favGenre) genreNames.add(favGenre);

      const journeyByYear = u.journeyByYear ?? {};
      for (const year of Object.keys(journeyByYear)) {
        const games = journeyByYear[year] ?? [];
        for (const g of games) {
          const p = (g.platform ?? "").trim();
          if (p) platformNames.add(p);
          for (const gn of g.genres ?? []) {
            const clean = (gn ?? "").trim();
            if (clean) genreNames.add(clean);
          }
        }
      }
    }

    // Cria platforms e genres
    const platformRepo = queryRunner.manager.getRepository(Platform);
    const genreRepo = queryRunner.manager.getRepository(Genre);

    const platforms = Array.from(platformNames).map((name) =>
      platformRepo.create({ name, imageUrl: null })
    );
    await platformRepo.save(platforms);
    const platformByName = new Map<string, Platform>(
      platforms.map((p) => [p.name, p])
    );

    const genres = Array.from(genreNames).map((name) =>
      genreRepo.create({ name })
    );
    await genreRepo.save(genres);
    const genreByName = new Map<string, Genre>(
      genres.map((g) => [g.name, g])
    );

    // Cria users
    const userRepo = queryRunner.manager.getRepository(User);
    const users = mockUsers.map((u) => {
      const username = (u.username ?? "").trim().toLowerCase();
      const email = (u.email ?? "").trim().toLowerCase();
      const password = (u.password ?? "123456").toString();

      return userRepo.create({
        id: u.id,
        username,
        email,
        passwordHash: password, // seed dev: nao faz hash
        name: (u.name ?? u.username ?? username).toString(),
        nickname: (u.nickname ?? username).toString(),
        createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
        avatarUrl: u.avatarUrl ?? null,
        bannerUrl: u.bannerUrl ?? null,
        bannerPosition:
          typeof u.bannerPosition === "number"
            ? String(u.bannerPosition)
            : u.bannerPosition ?? null,
        favoriteGameName: u.favoriteGame ?? null,
        favoriteGameCover: u.favoriteGameCover ?? null,
        favoriteGenreName:
          (u.favoriteGenre ??
            u.favoriteGenres?.[0]?.name ??
            null)?.toString() ?? null,
        favoriteGenreCover:
          u.favoriteGenreCover ??
          u.favoriteGenres?.[0]?.imageUrl ??
          null,
      });
    });
    await userRepo.save(users);

    // Cria user_platforms
    const userPlatformRepo = queryRunner.manager.getRepository(UserPlatform);
    const userPlatformsToSave: UserPlatform[] = [];

    for (const u of mockUsers) {
      const user = users.find((x) => x.id === u.id);
      if (!user) continue;

      const userPlatforms =
        Array.isArray(u.platforms) && u.platforms.length > 0
          ? u.platforms
              .map((p) => (p?.name ?? "").trim())
              .filter(Boolean)
          : u.platform
            ? [u.platform.trim()]
            : [];

      for (const pn of userPlatforms) {
        const p = platformByName.get(pn);
        if (!p) continue;
        userPlatformsToSave.push(
          userPlatformRepo.create({ userId: user.id, platformId: p.id })
        );
      }
    }
    if (userPlatformsToSave.length > 0) {
      await userPlatformRepo.save(userPlatformsToSave);
    }

    // Cria journey_games
    const journeyGameRepo = queryRunner.manager.getRepository(JourneyGame);
    const pendingGenresByGameKey = new Map<
      string,
      { genres: string[] }
    >();

    const journeyGamesToSave: JourneyGame[] = [];

    for (const u of mockUsers) {
      const user = users.find((x) => x.id === u.id);
      if (!user) continue;
      const journeyByYear = u.journeyByYear ?? {};

      for (const year of Object.keys(journeyByYear)) {
        const games = journeyByYear[year] ?? [];
        for (const g of games) {
          const monthKey = normalizeMonthKey(g);
          if (!monthKey) continue;

          const platformName = (g.platform ?? "").trim();
          const platform = platformName
            ? platformByName.get(platformName)
            : undefined;

          const status = normalizeStatus(g.status);

          const entity = journeyGameRepo.create({
            userId: user.id,
            rawgGameId: (g.id ?? "").toString(),
            name: (g.name ?? "").toString(),
            coverImageUrl: g.coverImageUrl ?? null,
            status,
            startedAt: normalizeDateToYYYYMMDD(g.startedAt),
            completedAt: normalizeDateToYYYYMMDD(g.completedAt),
            droppedAt: normalizeDateToYYYYMMDD(g.droppedAt),
            hoursPlayed: normalizeHoursPlayed(g.hoursPlayed),
            rating: g.rating ?? null,
            platformId: platform?.id ?? null,
            monthKey,
            notes: g.notes ?? null,
            verdict: g.verdict ?? null,
            // Campos não mapeados pelo mockUsers: ficam null.
            droppedReason: g.droppedReason ?? null,
            releaseDate: normalizeDateToYYYYMMDD(g.releaseDate),
            hasDemo: g.hasDemo ?? null,
          });

          const key = `${entity.userId}|${entity.monthKey}|${entity.rawgGameId}`;
          pendingGenresByGameKey.set(key, { genres: (g.genres ?? []).filter(Boolean) });
          journeyGamesToSave.push(entity);
        }
      }
    }

    if (journeyGamesToSave.length > 0) {
      await journeyGameRepo.save(journeyGamesToSave);
    }

    // Cria journey_game_genres
    const journeyGameGenreRepo =
      queryRunner.manager.getRepository(JourneyGameGenre);

    const joinsToSave: JourneyGameGenre[] = [];

    for (const jg of journeyGamesToSave) {
      if (!jg.id) continue;
      const key = `${jg.userId}|${jg.monthKey}|${jg.rawgGameId}`;
      const pending = pendingGenresByGameKey.get(key);
      if (!pending) continue;

      for (const genreName of pending.genres) {
        const clean = (genreName ?? "").trim();
        if (!clean) continue;
        const genre = genreByName.get(clean);
        if (!genre) continue;
        joinsToSave.push(
          journeyGameGenreRepo.create({
            journeyGameId: jg.id,
            genreId: genre.id,
          })
        );
      }
    }

    if (joinsToSave.length > 0) {
      await journeyGameGenreRepo.save(joinsToSave);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Seed/descarte é intencionalmente manual (dev). Evita apagar dados em produção.
  }
}

