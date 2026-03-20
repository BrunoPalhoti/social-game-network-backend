"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesFromQueryFactory = gamesFromQueryFactory;
const paginationFromQuery_factory_js_1 = require("../paginationFromQuery/paginationFromQuery.factory.js");
const DEFAULT_SEARCH_ORDERING = '-rating';
function gamesFromQueryFactory(q) {
    const base = (0, paginationFromQuery_factory_js_1.paginationFromQueryFactory)(q);
    const search = q.search?.trim() || undefined;
    const ordering = q.ordering?.trim() || (search ? DEFAULT_SEARCH_ORDERING : undefined);
    return {
        ...base,
        search,
        ordering,
    };
}
//# sourceMappingURL=gamesFromQuery.factory.js.map