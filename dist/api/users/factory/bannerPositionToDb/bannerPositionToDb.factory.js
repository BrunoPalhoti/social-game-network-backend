"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerPositionToDb = bannerPositionToDb;
function bannerPositionToDb(bannerPosition) {
    if (bannerPosition === undefined)
        return null;
    if (typeof bannerPosition === 'number') {
        return Number.isFinite(bannerPosition)
            ? String(Math.round(bannerPosition))
            : null;
    }
    return bannerPosition;
}
//# sourceMappingURL=bannerPositionToDb.factory.js.map