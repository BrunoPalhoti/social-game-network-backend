"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeToYYYYMMDD = normalizeToYYYYMMDD;
exports.monthKeyFromJourneyFields = monthKeyFromJourneyFields;
const common_1 = require("@nestjs/common");
const journey_status_enum_1 = require("../../../../db/journey-status.enum");
function normalizeToYYYYMMDD(value) {
    if (typeof value !== 'string')
        return null;
    const s = value.trim();
    if (!s)
        return null;
    return s.length >= 10 ? s.slice(0, 10) : null;
}
function toMonthKeyFromDate(date) {
    if (!date)
        return null;
    if (date.length < 10)
        return null;
    const mk = date.slice(0, 7);
    if (!/^[0-9]{4}-[0-9]{2}$/.test(mk))
        return null;
    return mk;
}
function monthKeyFromJourneyFields(args) {
    const { status, startedAt, completedAt, droppedAt, releaseDate } = args;
    if (status === journey_status_enum_1.JourneyStatus.PLAYING) {
        const mk = toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('startedAt inválido para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.DROPPED) {
        const mk = toMonthKeyFromDate(startedAt) ?? toMonthKeyFromDate(droppedAt);
        if (!mk)
            throw new common_1.BadRequestException('startedAt/droppedAt inválidos para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.COMPLETED || status === journey_status_enum_1.JourneyStatus.PLATINUM) {
        const mk = toMonthKeyFromDate(completedAt) ?? toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('completedAt inválido para gerar monthKey.');
        return mk;
    }
    if (status === journey_status_enum_1.JourneyStatus.WISHLIST) {
        const mk = toMonthKeyFromDate(releaseDate) ?? toMonthKeyFromDate(startedAt);
        if (!mk)
            throw new common_1.BadRequestException('releaseDate inválido para gerar monthKey.');
        return mk;
    }
    throw new common_1.BadRequestException('Status inválido.');
}
//# sourceMappingURL=monthKey.factory.js.map