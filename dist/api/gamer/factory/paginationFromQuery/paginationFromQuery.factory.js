"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationFromQueryFactory = paginationFromQueryFactory;
function paginationFromQueryFactory(q) {
    const pageN = q.page !== undefined && q.page !== '' ? Number(q.page) : undefined;
    const sizeN = q.page_size !== undefined && q.page_size !== ''
        ? Number(q.page_size)
        : undefined;
    return {
        page: pageN !== undefined && !Number.isNaN(pageN) ? pageN : undefined,
        page_size: sizeN !== undefined && !Number.isNaN(sizeN) ? sizeN : undefined,
        ordering: q.ordering?.trim() || undefined,
    };
}
//# sourceMappingURL=paginationFromQuery.factory.js.map