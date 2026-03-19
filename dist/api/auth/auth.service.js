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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_repository_js_1 = require("./auth.repository.js");
const register_factory_js_1 = require("./factory/register/register.factory.js");
const login_factory_js_1 = require("./factory/login/login.factory.js");
const getUsersForAuth_factory_js_1 = require("./factory/getUsersForAuth/getUsersForAuth.factory.js");
const toAuthSnapshotFromUser_factory_js_1 = require("./factory/toAuthSnapshotFromUser/toAuthSnapshotFromUser.factory.js");
let AuthService = class AuthService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async register(payload) {
        const { username, email, password } = (0, register_factory_js_1.registerFactory)(payload);
        if (!username || !email || !password) {
            throw new common_1.HttpException('Dados inválidos.', common_1.HttpStatus.BAD_REQUEST);
        }
        const exists = await this.authRepository.countUsersByUsernameOrEmail(username, email);
        if (exists > 0) {
            throw new common_1.HttpException('Username ou e-mail já cadastrado.', common_1.HttpStatus.CONFLICT);
        }
        await this.authRepository.createUser({
            username,
            email,
            passwordHash: password,
            name: username,
            nickname: username,
        });
        return { username };
    }
    async login(payload) {
        const { username, password } = (0, login_factory_js_1.loginFactory)(payload);
        const user = await this.authRepository.findUserWithPlatformsByUsername(username);
        if (!user) {
            throw new common_1.HttpException('Usuário ou senha inválidos.', 401);
        }
        if (user.passwordHash !== password) {
            throw new common_1.HttpException('Usuário ou senha inválidos.', 401);
        }
        const snapshot = (0, toAuthSnapshotFromUser_factory_js_1.toAuthSnapshotFromUser)(user);
        return { user: snapshot };
    }
    async getUsersForAuth() {
        const users = await this.authRepository.findAllUsersWithPlatformsOrdered();
        return (0, getUsersForAuth_factory_js_1.getUsersForAuthFactory)(users);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_js_1.AuthRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map