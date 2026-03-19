export type ProfileOverrides = {
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  platforms?: Array<{ name: string; imageUrl: string | null }>;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
};

export type AuthUserSnapshot = {
  password: string;
  name: string;
  nickname: string;
  platform?: string;
  platforms?: Array<{ name: string; imageUrl: string | null }>;
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
};

