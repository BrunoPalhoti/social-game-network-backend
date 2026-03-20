"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthSnapshotFromUser = toAuthSnapshotFromUser;
function extractPlatforms(user) {
    return (user.userPlatforms ?? [])
        .map((up) => up.platform)
        .filter((p) => !!p);
}
function toBannerPosition(bannerPosition) {
    if (bannerPosition === null || bannerPosition === undefined)
        return 'center';
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
function toAuthSnapshotFromUser(user) {
    const platforms = extractPlatforms(user);
    return {
        name: user.name,
        nickname: user.nickname,
        platforms: platforms.length > 0
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
//# sourceMappingURL=toAuthSnapshotFromUser.factory.js.map