"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFactory = registerFactory;
const normalizeUsername_factory_js_1 = require("../normalizeUsername/normalizeUsername.factory.js");
function registerFactory(payload) {
    const username = (0, normalizeUsername_factory_js_1.normalizeUsername)(payload.username);
    const email = payload.email.trim().toLowerCase();
    const password = payload.password ?? '';
    return { username, email, password };
}
//# sourceMappingURL=register.factory.js.map