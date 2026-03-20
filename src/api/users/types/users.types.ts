export type PlatformSelection = { name: string; imageUrl: string | null };

export type UserProfileResponse = {
  username: string;
  name: string;
  nickname: string;
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
};
