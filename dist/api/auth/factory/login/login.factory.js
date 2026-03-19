"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFactory = loginFactory;
const normalizeUsername_factory_js_1 = require("../normalizeUsername/normalizeUsername.factory.js");
function loginFactory(payload) {
    const username = (0, normalizeUsername_factory_js_1.normalizeUsername)(payload.username);
    const password = payload.password ?? '';
    return { username, password };
}
//# sourceMappingURL=login.factory.js.map