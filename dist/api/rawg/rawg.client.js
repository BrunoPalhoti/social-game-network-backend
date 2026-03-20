"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawgClient = void 0;
const common_1 = require("@nestjs/common");
const rawg_constants_js_1 = require("./rawg.constants.js");
let RawgClient = class RawgClient {
    baseUrl = (process.env.RAWG_API_BASE_URL ?? '').trim() || rawg_constants_js_1.RAWG_API_DEFAULT_BASE;
    getApiKey() {
        return (process.env.RAWG_API_KEY ??
            process.env.VITE_RAWG_API_KEY ??
            '').trim();
    }
    async request(resource, params) {
        const searchParams = new URLSearchParams();
        const key = this.getApiKey();
        if (key)
            searchParams.set('key', key);
        for (const [k, v] of Object.entries(params)) {
            if (!v)
                continue;
            searchParams.set(k, v);
        }
        const url = `${this.baseUrl.replace(/\/$/, '')}/${resource}?${searchParams.toString()}`;
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
        return this.request('games', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 12),
            search: params.search?.trim() || undefined,
            ordering: params.ordering,
        });
    }
    async platforms(params) {
        return this.request('platforms', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 20),
            ordering: params.ordering,
        });
    }
    async genres(params) {
        return this.request('genres', {
            page: String(params.page ?? 1),
            page_size: String(params.page_size ?? 20),
            ordering: params.ordering,
        });
    }
};
exports.RawgClient = RawgClient;
exports.RawgClient = RawgClient = __decorate([
    (0, common_1.Injectable)()
], RawgClient);
//# sourceMappingURL=rawg.client.js.map