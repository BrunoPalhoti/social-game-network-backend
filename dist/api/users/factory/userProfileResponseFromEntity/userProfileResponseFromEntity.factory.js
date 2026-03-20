"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileResponseFromEntity = userProfileResponseFromEntity;
function userProfileResponseFromEntity(user) {
    const platforms = (user.userPlatforms ?? [])
        .map((up) => up.platform)
        .filter((p) => !!p)
        .map((p) => ({ name: p.name, imageUrl: p.imageUrl ?? null }));
    return {
        username: user.username,
        name: user.name,
        nickname: user.nickname,
        platforms: platforms.length > 0 ? platforms : undefined,
        favoriteGame: user.favoriteGameName ?? undefined,
        favoriteGameCover: user.favoriteGameCover ?? undefined,
        favoriteGenre: user.favoriteGenreName ?? undefined,
        favoriteGenreCover: user.favoriteGenreCover ?? undefined,
        avatarUrl: user.avatarUrl ?? null,
        bannerUrl: user.bannerUrl ?? null,
        bannerPosition: user.bannerPosition === null || user.bannerPosition === undefined
            ? 'center'
            : user.bannerPosition === 'top' ||
                user.bannerPosition === 'center' ||
                user.bannerPosition === 'bottom'
                ? user.bannerPosition
                : Number.isFinite(Number(user.bannerPosition))
                    ? Number(user.bannerPosition)
                    : 'center',
    };
}
//# sourceMappingURL=userProfileResponseFromEntity.factory.js.map