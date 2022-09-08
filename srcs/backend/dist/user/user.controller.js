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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const changenick_dto_1 = require("./dto/changenick.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async authUser(code) {
        return await this.userService.authUser(code);
    }
    getUserByNick(nickname) {
        return this.userService.getUserByNick(nickname);
    }
    async getUserById(id) {
        return await this.userService.getUserById(parseInt(id));
    }
    async updateNickanme(changeNickDto) {
        return await this.userService.changeNickName(changeNickDto);
    }
    async updateAvatar(file, id) {
        return await this.userService.changeAvatar(id);
    }
    async generate2FA(id) {
        return await this.userService.generateSecretAndQRCode(Number(id));
    }
    async verify2fa(id, token) {
        return await this.userService.verify2fa(id, token);
    }
    async changeFactor(id) {
        return await this.userService.changeFactor(id);
    }
    async addFriend(id, nick) {
        return await this.userService.addFriend(Number(id), nick);
    }
    async getFriends(id) {
        return await this.userService.getFriends(id);
    }
    async blockFriend(id, nick, isFriend) {
        return await this.userService.blockFriend(Number(id), nick, isFriend);
    }
    async getBlocks(id) {
        return await this.userService.getBlocks(id);
    }
    async getUsers(id) {
        return await this.userService.getAllUsers(Number(id));
    }
    async getBlockedBys(id) {
        return await this.userService.getBlockedBys(id);
    }
    async removeBlock(id, nick) {
        return await this.userService.removeBlock(Number(id), nick);
    }
    async getMatchesById(id) {
        console.log(id);
        return await this.userService.getMatchesById(Number(id));
    }
    async getAchievementsById(id) {
        return await this.userService.getAchievementsById(Number(id));
    }
    async changeUserStatus(id, status) {
        return await this.userService.changeStatusById(Number(id), Number(status));
    }
    getHi() {
        return 'Hello from server';
    }
};
__decorate([
    (0, common_1.Get)('auth'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "authUser", null);
__decorate([
    (0, common_1.Get)('nick/:nick'),
    __param(0, (0, common_1.Param)('nick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserByNick", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('change-nickname'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changenick_dto_1.ChangeNickDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNickanme", null);
__decorate([
    (0, common_1.Post)('change-avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './public',
            filename: (req, file, callback) => {
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.originalname}`;
                callback(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            console.log(file);
            const ext = (0, path_1.extname)(file.originalname);
            if (ext === '.jpeg') {
                cb(null, true);
            }
            else {
                console.log('false');
                cb(new common_1.BadRequestException('Only use jpeg files'), false);
            }
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generate2FA", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verify2fa", null);
__decorate([
    (0, common_1.Post)('change-factor'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeFactor", null);
__decorate([
    (0, common_1.Post)('add-friend'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('nick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Post)('get-friends'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('block-friend'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('nick')),
    __param(2, (0, common_1.Body)('is_friend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockFriend", null);
__decorate([
    (0, common_1.Post)('get-blocks'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlocks", null);
__decorate([
    (0, common_1.Get)('get-users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('get-blocked-bys'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlockedBys", null);
__decorate([
    (0, common_1.Post)('remove-block'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('nick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeBlock", null);
__decorate([
    (0, common_1.Get)('get-matches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMatchesById", null);
__decorate([
    (0, common_1.Get)('get-achievements/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAchievementsById", null);
__decorate([
    (0, common_1.Post)('set-status'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUserStatus", null);
__decorate([
    (0, common_1.Get)('get-hi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getHi", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map