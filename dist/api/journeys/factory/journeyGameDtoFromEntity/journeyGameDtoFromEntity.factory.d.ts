import type { JourneyGame } from '../../../../db/entities/JourneyGame';
import type { JourneyGameDTO } from '../../types/journeys.types.js';
export declare function normalizeDateValue(value: unknown): string | undefined;
export declare function journeyGameDtoFromEntity(entity: JourneyGame): JourneyGameDTO;
