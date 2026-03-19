"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamerController = exports.RawgProxyService = void 0;
const common_1 = require("@nestjs/common");
class RawgProxyService {
    baseUrl = 'https://api.rawg.io/api';
    getApiKey() {
        return (process.env.RAWG_API_KEY ??
            process.env.VITE_RAWG_API_KEY ??
            '').trim();
    }
    async fetchRawg(resource, params) {
        const searchParams = new URLSearchParams();
        const key = this.getApiKey();
        if (key)
            searchParams.set('key', key);
        for (const [k, v] of Object.entries(params)) {
            if (!v)
                continue;
            searchParams.set(k, v);
        }
        const url = `${this.baseUrl}/${resource}?${searchParams.toString()}`;
        let res;
        try {
            res = await fetch(url);
        }
        catch {
            throw new common_1.BadGatewayException('Falha ao consultar RAWG.');
        }
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new common_1.HttpException(`RAWG error: ${res.status} ${res.statusText} ${text}`.trim(), common_1.HttpStatus.BAD_GATEWAY);
        }
        return (await res.json());
    }
    async games(params) {
        return this.fetchRawg('games', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 12),
            search: params.search?.trim() || undefined,
            ordering: params.ordering,
        });
    }
    async platforms(params) {
        return this.fetchRawg('platforms', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 20),
            ordering: params.ordering,
        });
    }
    async genres(params) {
        return this.fetchRawg('genres', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 20),
            ordering: params.ordering,
        });
    }
}
exports.RawgProxyService = RawgProxyService;
let GamerController = class GamerController {
    rawg;
    constructor(rawg) {
        this.rawg = rawg;
    }
    getGames(page, pageSize, search, ordering) {
        const pageN = page ? Number(page) : undefined;
        const sizeN = pageSize ? Number(pageSize) : undefined;
        return this.rawg.games({ page: pageN, page_size: sizeN, search, ordering });
    }
    getPlatforms(page, pageSize, ordering) {
        const pageN = page ? Number(page) : undefined;
        const sizeN = pageSize ? Number(pageSize) : undefined;
        return this.rawg.platforms({ page: pageN, page_size: sizeN, ordering });
    }
    getGenres(page, pageSize, ordering) {
        const pageN = page ? Number(page) : undefined;
        const sizeN = pageSize ? Number(pageSize) : undefined;
        return this.rawg.genres({ page: pageN, page_size: sizeN, ordering });
    }
};
exports.GamerController = GamerController;
__decorate([
    (0, common_1.Get)('games'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('ordering')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getGames", null);
__decorate([
    (0, common_1.Get)('platforms'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('ordering')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getPlatforms", null);
__decorate([
    (0, common_1.Get)('genres'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('ordering')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GamerController.prototype, "getGenres", null);
exports.GamerController = GamerController = __decorate([
    (0, common_1.Controller)('api/gamer'),
    __metadata("design:paramtypes", [RawgProxyService])
], GamerController);
//# sourceMappingURL=gamer.controller.js.map