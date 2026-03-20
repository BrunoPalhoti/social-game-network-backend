import type { AddJourneyGameDto } from './dto/add-journey-game.dto.js';
import type { UpdateJourneyGameDto } from './dto/update-journey-game.dto.js';
import { JourneysRepository } from './journeys.repository.js';
import type { JourneyYearData } from './types/journeys.types.js';
export declare class JourneysService {
    private readonly journeysRepository;
    constructor(journeysRepository: JourneysRepository);
    private getUserId;
    private emptyYearData;
    getJourneyData(username: string, year: number): Promise<JourneyYearData>;
    addJourneyGame(username: string, year: number, payload: AddJourneyGameDto): Promise<JourneyYearData>;
    updateJourneyGame(username: string, year: number, rawgGameId: string, updates: UpdateJourneyGameDto): Promise<JourneyYearData>;
    clearAllJourneyGames(username: string, year: number): Promise<JourneyYearData>;
}
