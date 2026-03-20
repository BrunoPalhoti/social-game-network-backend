import { JourneyStatus } from '../../../../db/journey-status.enum';
export declare function normalizeToYYYYMMDD(value: unknown): string | null;
export declare function monthKeyFromJourneyFields(args: {
    status: JourneyStatus;
    startedAt: string | null;
    completedAt: string | null;
    droppedAt: string | null;
    releaseDate: string | null;
}): string;
