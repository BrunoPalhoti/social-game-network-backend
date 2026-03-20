import type { PlatformSelection } from '../../types/users.types.js';
export declare function normalizePlatformSelections(platforms: PlatformSelection[] | undefined): {
    name: string;
    imageUrl: string | null;
}[];
