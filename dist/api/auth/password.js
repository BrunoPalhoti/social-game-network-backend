"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const bcrypt_1 = require("bcrypt");
const SALT_ROUNDS = 10;
function looksLikeBcrypt(stored) {
    return /^\$2[aby]\$\d{2}\$/.test(stored);
}
async function hashPassword(plain) {
    return (0, bcrypt_1.hash)(plain, SALT_ROUNDS);
}
async function verifyPassword(plain, stored) {
    if (looksLikeBcrypt(stored)) {
        return (0, bcrypt_1.compare)(plain, stored);
    }
    return plain === stored;
}
//# sourceMappingURL=password.js.map