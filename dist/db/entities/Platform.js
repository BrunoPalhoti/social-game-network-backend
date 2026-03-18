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
exports.Platform = void 0;
const typeorm_1 = require("typeorm");
const UserPlatform_1 = require("./UserPlatform");
let Platform = class Platform {
    id;
    name;
    imageUrl;
    userPlatforms;
};
exports.Platform = Platform;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Platform.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Platform.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", name: "image_url", nullable: true }),
    __metadata("design:type", Object)
], Platform.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserPlatform_1.UserPlatform, (up) => up.platform),
    __metadata("design:type", Array)
], Platform.prototype, "userPlatforms", void 0);
exports.Platform = Platform = __decorate([
    (0, typeorm_1.Entity)({ name: "platforms" })
], Platform);
//# sourceMappingURL=Platform.js.map