"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearFromParamFactory = yearFromParamFactory;
const common_1 = require("@nestjs/common");
function yearFromParamFactory(year) {
    const y = Number(year);
    if (!Number.isFinite(y))
        throw new common_1.BadRequestException('year inválido.');
    return y;
}
//# sourceMappingURL=yearFromParam.factory.js.map