import { JourneyStatus } from '../../../db/journey-status.enum';

export class AddJourneyGameDto {
  id!: string; // rawgGameId
  name!: string;
  coverImageUrl?: string;
  startedAt!: string;
  completedAt?: string;
  droppedAt?: string;
  hoursPlayed?: number | null;
  rating?: number | null;
  notes?: string;
  verdict?: string;
  status!: JourneyStatus;
  genres?: string[];
  platform?: string;
  droppedReason?: string;
  releaseDate?: string;
  hasDemo?: boolean;
  is100Percent?: boolean;
}
