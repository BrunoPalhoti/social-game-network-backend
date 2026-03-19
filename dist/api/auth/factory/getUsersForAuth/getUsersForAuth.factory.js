"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForAuthFactory = getUsersForAuthFactory;
const toAuthSnapshotFromUser_factory_js_1 = require("../toAuthSnapshotFromUser/toAuthSnapshotFromUser.factory.js");
const normalizeUsername_factory_js_1 = require("../normalizeUsername/normalizeUsername.factory.js");
function getUsersForAuthFactory(users) {
    const result = {};
    for (const user of users) {
        result[(0, normalizeUsername_factory_js_1.normalizeUsername)(user.username)] = (0, toAuthSnapshotFromUser_factory_js_1.toAuthSnapshotFromUser)(user);
    }
    return result;
}
//# sourceMappingURL=getUsersForAuth.factory.js.map