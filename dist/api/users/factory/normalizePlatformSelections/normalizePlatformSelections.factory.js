"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePlatformSelections = normalizePlatformSelections;
function normalizePlatformSelections(platforms) {
    return (platforms ?? [])
        .map((p) => ({ name: p.name.trim(), imageUrl: p.imageUrl ?? null }))
        .filter((p) => !!p.name);
}
//# sourceMappingURL=normalizePlatformSelections.factory.js.map