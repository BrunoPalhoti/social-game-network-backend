"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedMockUsers1710000000001 = void 0;
const promises_1 = require("fs/promises");
const User_1 = require("../db/entities/User");
const Platform_1 = require("../db/entities/Platform");
const Genre_1 = require("../db/entities/Genre");
const UserPlatform_1 = require("../db/entities/UserPlatform");
const JourneyGame_1 = require("../db/entities/JourneyGame");
const JourneyGameGenre_1 = require("../db/entities/JourneyGameGenre");
const journey_status_enum_1 = require("../db/journey-status.enum");
function normalizeDateToYYYYMMDD(value) {
    if (typeof value !== 'string')
        return null;
    const s = value.trim();
    if (!s)
        return null;
    return s.length >= 10 ? s.slice(0, 10) : s;
}
function normalizeMonthKey(game) {
    const mk = (game.monthKey ?? '').trim();
    if (/^[0-9]{4}-[0-9]{2}$/.test(mk))
        return mk;
    const date = game.completedAt ?? game.startedAt ?? game.droppedAt;
    const d = normalizeDateToYYYYMMDD(date);
    if (!d)
        return null;
    return d.slice(0, 7);
}
function normalizeHoursPlayed(value) {
    if (value === undefined || value === null)
        return null;
    const n = typeof value === 'number'
        ? value
        : typeof value === 'string'
            ? Number.parseFloat(value)
            : NaN;
    if (!Number.isFinite(n) || n < 0)
        return null;
    return Math.round(n);
}
function normalizeStatus(value) {
    const s = typeof value === 'string' ? value.trim() : '';
    if (s in journey_status_enum_1.JourneyStatus)
        return s;
    return journey_status_enum_1.JourneyStatus.COMPLETED;
}
class SeedMockUsers1710000000001 {
    name = 'SeedMockUsers1710000000001';
    async up(queryRunner) {
        if (process.env.ENABLE_MOCK_SEED !== 'true')
            return;
        const mockUsersPath = process.env.MOCK_USERS_PATH?.trim() || '/app/mockUsers.json';
        const userCount = await queryRunner.manager.getRepository(User_1.User).count();
        if (userCount > 0)
            return;
        const raw = await (0, promises_1.readFile)(mockUsersPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const mockUsers = Array.isArray(parsed.users) ? parsed.users : [];
        const platformNames = new Set();
        const genreNames = new Set();
        for (const u of mockUsers) {
            const userPlatforms = Array.isArray(u.platforms) && u.platforms.length > 0
                ? u.platforms.map((p) => (p?.name ?? '').trim()).filter(Boolean)
                : u.platform
                    ? [u.platform.trim()]
                    : [];
            for (const pn of userPlatforms)
                platformNames.add(pn);
            const favGenre = (u.favoriteGenre ?? '').trim() ||
                (Array.isArray(u.favoriteGenres) && u.favoriteGenres[0]?.name
                    ? u.favoriteGenres[0].name.trim()
                    : '');
            if (favGenre)
                genreNames.add(favGenre);
            const journeyByYear = u.journeyByYear ?? {};
            for (const year of Object.keys(journeyByYear)) {
                const games = journeyByYear[year] ?? [];
                for (const g of games) {
                    const p = (g.platform ?? '').trim();
                    if (p)
                        platformNames.add(p);
                    for (const gn of g.genres ?? []) {
                        const clean = (gn ?? '').trim();
                        if (clean)
                            genreNames.add(clean);
                    }
                }
            }
        }
        const platformRepo = queryRunner.manager.getRepository(Platform_1.Platform);
        const genreRepo = queryRunner.manager.getRepository(Genre_1.Genre);
        const platforms = Array.from(platformNames).map((name) => platformRepo.create({ name, imageUrl: null }));
        await platformRepo.save(platforms);
        const platformByName = new Map(platforms.map((p) => [p.name, p]));
        const genres = Array.from(genreNames).map((name) => genreRepo.create({ name }));
        await genreRepo.save(genres);
        const genreByName = new Map(genres.map((g) => [g.name, g]));
        const userRepo = queryRunner.manager.getRepository(User_1.User);
        const users = mockUsers.map((u) => {
            const username = (u.username ?? '').trim().toLowerCase();
            const email = (u.email ?? '').trim().toLowerCase();
            const password = (u.password ?? '123456').toString();
            return userRepo.create({
                id: u.id,
                username,
                email,
                passwordHash: password,
                name: (u.name ?? u.username ?? username).toString(),
                nickname: (u.nickname ?? username).toString(),
                createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
                avatarUrl: u.avatarUrl ?? null,
                bannerUrl: u.bannerUrl ?? null,
                bannerPosition: typeof u.bannerPosition === 'number'
                    ? String(u.bannerPosition)
                    : (u.bannerPosition ?? null),
                favoriteGameName: u.favoriteGame ?? null,
                favoriteGameCover: u.favoriteGameCover ?? null,
                favoriteGenreName: (u.favoriteGenre ??
                    u.favoriteGenres?.[0]?.name ??
                    null)?.toString() ?? null,
                favoriteGenreCover: u.favoriteGenreCover ?? u.favoriteGenres?.[0]?.imageUrl ?? null,
            });
        });
        await userRepo.save(users);
        const userPlatformRepo = queryRunner.manager.getRepository(UserPlatform_1.UserPlatform);
        const userPlatformsToSave = [];
        for (const u of mockUsers) {
            const user = users.find((x) => x.id === u.id);
            if (!user)
                continue;
            const userPlatforms = Array.isArray(u.platforms) && u.platforms.length > 0
                ? u.platforms.map((p) => (p?.name ?? '').trim()).filter(Boolean)
                : u.platform
                    ? [u.platform.trim()]
                    : [];
            for (const pn of userPlatforms) {
                const p = platformByName.get(pn);
                if (!p)
                    continue;
                userPlatformsToSave.push(userPlatformRepo.create({ userId: user.id, platformId: p.id }));
            }
        }
        if (userPlatformsToSave.length > 0) {
            await userPlatformRepo.save(userPlatformsToSave);
        }
        const journeyGameRepo = queryRunner.manager.getRepository(JourneyGame_1.JourneyGame);
        const pendingGenresByGameKey = new Map();
        const journeyGamesToSave = [];
        for (const u of mockUsers) {
            const user = users.find((x) => x.id === u.id);
            if (!user)
                continue;
            const journeyByYear = u.journeyByYear ?? {};
            for (const year of Object.keys(journeyByYear)) {
                const games = journeyByYear[year] ?? [];
                for (const g of games) {
                    const monthKey = normalizeMonthKey(g);
                    if (!monthKey)
                        continue;
                    const platformName = (g.platform ?? '').trim();
                    const platform = platformName
                        ? platformByName.get(platformName)
                        : undefined;
                    const status = normalizeStatus(g.status);
                    const entity = journeyGameRepo.create({
                        userId: user.id,
                        rawgGameId: (g.id ?? '').toString(),
                        name: (g.name ?? '').toString(),
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
                        droppedReason: g.droppedReason ?? null,
                        releaseDate: normalizeDateToYYYYMMDD(g.releaseDate),
                        hasDemo: g.hasDemo ?? null,
                    });
                    const key = `${entity.userId}|${entity.monthKey}|${entity.rawgGameId}`;
                    pendingGenresByGameKey.set(key, {
                        genres: (g.genres ?? []).filter(Boolean),
                    });
                    journeyGamesToSave.push(entity);
                }
            }
        }
        if (journeyGamesToSave.length > 0) {
            await journeyGameRepo.save(journeyGamesToSave);
        }
        const journeyGameGenreRepo = queryRunner.manager.getRepository(JourneyGameGenre_1.JourneyGameGenre);
        const joinsToSave = [];
        for (const jg of journeyGamesToSave) {
            if (!jg.id)
                continue;
            const key = `${jg.userId}|${jg.monthKey}|${jg.rawgGameId}`;
            const pending = pendingGenresByGameKey.get(key);
            if (!pending)
                continue;
            for (const genreName of pending.genres) {
                const clean = (genreName ?? '').trim();
                if (!clean)
                    continue;
                const genre = genreByName.get(clean);
                if (!genre)
                    continue;
                joinsToSave.push(journeyGameGenreRepo.create({
                    journeyGameId: jg.id,
                    genreId: genre.id,
                }));
            }
        }
        if (joinsToSave.length > 0) {
            await journeyGameGenreRepo.save(joinsToSave);
        }
    }
    down(_queryRunner) {
        void _queryRunner;
        return Promise.resolve();
    }
}
exports.SeedMockUsers1710000000001 = SeedMockUsers1710000000001;
//# sourceMappingURL=1710000000001-SeedMockUsers.js.map