import { AddJourneyGameDto } from './dto/add-journey-game.dto.js';
import { UpdateJourneyGameDto } from './dto/update-journey-game.dto.js';
import { JourneysService } from './journeys.service.js';
export declare class JourneysController {
    private readonly journeysService;
    constructor(journeysService: JourneysService);
    getJourneyData(username: string, year: string): Promise<import("./types/journeys.types.js").JourneyYearData>;
    addJourneyGame(username: string, year: string, body: AddJourneyGameDto): Promise<import("./types/journeys.types.js").JourneyYearData>;
    updateJourneyGame(username: string, year: string, rawgGameId: string, body: UpdateJourneyGameDto): Promise<import("./types/journeys.types.js").JourneyYearData>;
    clearAllJourneyGames(username: string, year: string): Promise<import("./types/journeys.types.js").JourneyYearData>;
}
