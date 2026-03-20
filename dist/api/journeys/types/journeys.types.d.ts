import type { JourneyStatus } from '../../../db/journey-status.enum';
export declare const MONTH_LABELS: Record<string, string>;
export type JourneyMonth = {
    key: string;
    label: string;
    games: JourneyGameDTO[];
};
export type MissionStats = {
    jogosZeradosNoAno: number;
    totalHoursInvested: number;
};
export type JogosZeradosNaVida = {
    totalJogos: number;
    totalHoras: number;
    plataformas: string[];
};
export type GenreShare = {
    genre: string;
    percent: number;
    hours?: number;
};
export type JourneyGameDTO = {
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
export type JourneyYearData = {
    year: number;
    missionStats: MissionStats;
    jogosZeradosNaVida?: JogosZeradosNaVida;
    months: JourneyMonth[];
    genreHeatMap: GenreShare[];
    games: JourneyGameDTO[];
};
