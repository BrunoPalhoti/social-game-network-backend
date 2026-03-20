import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { Genre } from '../../db/entities/Genre';
import { JourneyGame } from '../../db/entities/JourneyGame';
import { JourneyGameGenre } from '../../db/entities/JourneyGameGenre';
export declare class JourneysRepository {
    private readonly usersRepo;
    private readonly platformsRepo;
    private readonly genresRepo;
    private readonly journeyGameRepo;
    private readonly journeyGameGenreRepo;
    constructor(usersRepo: Repository<User>, platformsRepo: Repository<Platform>, genresRepo: Repository<Genre>, journeyGameRepo: Repository<JourneyGame>, journeyGameGenreRepo: Repository<JourneyGameGenre>);
    findUserByUsername(normalizedUsername: string): Promise<User | null>;
    findJourneyGamesForUserYear(userId: string, year: number): Promise<JourneyGame[]>;
    findJourneyGameByUserAndRawgId(userId: string, rawgGameId: string): Promise<JourneyGame | null>;
    insertJourneyGame(entity: JourneyGame): Promise<JourneyGame>;
    createJourneyGameEntity(partial: Parameters<Repository<JourneyGame>['create']>[0]): JourneyGame;
    saveJourneyGame(entity: JourneyGame): Promise<JourneyGame>;
    deleteJourneyGamesForUserYear(userId: string, year: number): Promise<void>;
    replaceGenresForJourneyGame(journeyGameId: number, genresInput: string[] | undefined): Promise<void>;
    resolvePlatformId(platformName?: string): Promise<number | null>;
}
