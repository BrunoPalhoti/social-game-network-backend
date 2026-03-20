import type { Platform } from '../../../../db/entities/Platform';
import type { User } from '../../../../db/entities/User';
import type { AuthUserSnapshot } from '../../types/auth.types.js';

function extractPlatforms(user: User): Platform[] {
  return (user.userPlatforms ?? [])
    .map((up) => up.platform)
    .filter((p): p is Platform => !!p);
}

function toBannerPosition(
  bannerPosition: User['bannerPosition'],
): AuthUserSnapshot['bannerPosition'] {
  if (bannerPosition === null || bannerPosition === undefined) return 'center';

  if (bannerPosition === 'top' || bannerPosition === 'center') {
    return bannerPosition;
  }
  if (bannerPosition === 'bottom') {
    return bannerPosition;
  }

  return /^[0-9]{1,3}$/.test(bannerPosition)
    ? Number(bannerPosition)
    : 'center';
}

export function toAuthSnapshotFromUser(user: User): AuthUserSnapshot {
  const platforms = extractPlatforms(user);

  return {
    name: user.name,
    nickname: user.nickname,
    platforms:
      platforms.length > 0
        ? platforms.map((p) => ({
            name: p.name,
            imageUrl: p.imageUrl ?? null,
          }))
        : undefined,
    favoriteGame: user.favoriteGameName ?? undefined,
    favoriteGameCover: user.favoriteGameCover ?? undefined,
    favoriteGenre: user.favoriteGenreName ?? undefined,
    favoriteGenreCover: user.favoriteGenreCover ?? undefined,
    avatarUrl: user.avatarUrl ?? null,
    bannerUrl: user.bannerUrl ?? null,
    bannerPosition: toBannerPosition(user.bannerPosition),
  };
}
