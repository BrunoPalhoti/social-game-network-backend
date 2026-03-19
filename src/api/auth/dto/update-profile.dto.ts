export class UpdateProfileDto {
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  platforms?: Array<{ name: string; imageUrl: string | null }>;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
}
