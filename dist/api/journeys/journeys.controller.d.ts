import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { Genre } from '../../db/entities/Genre';
import { JourneyGame } from '../../db/entities/JourneyGame';
import { JourneyGameGenre } from '../../db/entities/JourneyGameGenre';
import { JourneyStatus } from '../../db/journey-status.enum';
type JourneyMonth = {
    key: string;
    label: string;
    games: JourneyGameDTO[];
};
type MissionStats = {
    jogosZeradosNoAno: number;
    totalHoursInvested: number;
};
type JogosZeradosNaVida = {
    totalJogos: number;
    totalHoras: number;
    plataformas: string[];
};
type GenreShare = {
    genre: string;
    percent: number;
    hours?: number;
};
type JourneyGameDTO = {
    id: string;
    name: string;
    coverImageUrl: string;
    startedAt?: string;
    completedAt?: string;
    droppedAt?: string;
    hoursPlayed?: number;
    rating?: number;
    status: JourneyStatus;
    notes?: string;
    verdict?: string;
    genres?: string[];
    platform?: string;
    monthKey: string;
    is100Percent?: boolean;
    droppedReason?: string;
    releaseDate?: string;
    hasDemo?: boolean;
};
type JourneyYearData = {
    year: number;
    missionStats: MissionStats;
    jogosZeradosNaVida?: JogosZeradosNaVida;
    months: JourneyMonth[];
    genreHeatMap: GenreShare[];
    games: JourneyGameDTO[];
};
export declare class AddJourneyGameDto {
    id: string;
    name: string;
    coverImageUrl?: string;
    startedAt: string;
    completedAt?: string;
    droppedAt?: string;
    hoursPlayed?: number | null;
    rating?: number | null;
    notes?: string;
    verdict?: string;
    status: JourneyStatus;
    genres?: string[];
    platform?: string;
    droppedReason?: string;
    releaseDate?: string;
    hasDemo?: boolean;
    is100Percent?: boolean;
}
export declare class UpdateJourneyGameDto {
    name?: string;
    coverImageUrl?: string;
    startedAt?: string;
    completedAt?: string;
    droppedAt?: string;
    hoursPlayed?: number | null;
    rating?: number | null;
    notes?: string;
    verdict?: string;
    status?: JourneyStatus;
    genres?: string[];
    platform?: string;
    droppedReason?: string;
    releaseDate?: string;
    hasDemo?: boolean;
    is100Percent?: boolean;
}
export declare class JourneysService {
    private readonly usersRepo;
    private readonly platformsRepo;
    private readonly genresRepo;
    private readonly journeyGameRepo;
    private readonly journeyGameGenreRepo;
    constructor(usersRepo: Repository<User>, platformsRepo: Repository<Platform>, genresRepo: Repository<Genre>, journeyGameRepo: Repository<JourneyGame>, journeyGameGenreRepo: Repository<JourneyGameGenre>);
    private normalizeUsername;
    private getUserId;
    private emptyYearData;
    private toJourneyGameDTO;
    private buildYearData;
    getJourneyData(username: string, year: number): Promise<JourneyYearData>;
    private upsertGenresForJourneyGame;
    private resolvePlatformId;
    private computeAndValidateMonthKey;
    addJourneyGame(username: string, year: number, payload: AddJourneyGameDto): Promise<JourneyYearData>;
    updateJourneyGame(username: string, year: number, rawgGameId: string, updates: UpdateJourneyGameDto): Promise<JourneyYearData>;
    clearAllJourneyGames(username: string, year: number): Promise<JourneyYearData>;
}
export declare class JourneysController {
    private readonly journeysService;
    constructor(journeysService: JourneysService);
    getJourneyData(username: string, year: string): Promise<JourneyYearData>;
    addJourneyGame(username: string, year: string, body: AddJourneyGameDto): Promise<JourneyYearData>;
    updateJourneyGame(username: string, year: string, rawgGameId: string, body: UpdateJourneyGameDto): Promise<JourneyYearData>;
    clearAllJourneyGames(username: string, year: string): Promise<JourneyYearData>;
}
export {};
