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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const dgram_1 = require("dgram");
const socket_io_1 = require("socket.io");
const channel_service_1 = require("./channel.service");
const argon = require("argon2");
const prisma_service_1 = require("../prisma/prisma.service");
const channels = [];
const db = new prisma_service_1.PrismaService();
const onlineUsers = [];
const busy = [];
let EventsGateway = class EventsGateway {
    async handleDisconnect(client) {
        console.log('disconnected');
        for (let i = 0; i < channels.length; i++) {
            await channels[i].setOffline(client);
        }
        for (let i = 0; i < onlineUsers.length; i++) {
            if (client.id === onlineUsers[i].client.id) {
                console.log('Disconnected ===', onlineUsers[i].user_id);
                if (onlineUsers[i].user_id > 0) {
                    await db.user.update({
                        where: {
                            id: onlineUsers[i].user_id
                        },
                        data: {
                            status: 0
                        }
                    });
                }
                onlineUsers.splice(i, 1);
                break;
            }
        }
        await this.handleGetAll(client, {});
    }
    handleConnection(client, ...args) {
        console.log('connected = ' + client.id);
    }
    afterInit(server) {
        console.log('init');
    }
    async getRandomInt() {
        return Math.floor(Math.random() * 10000);
    }
    async isOnChannel(channel_name) {
        for (let i = 0; i < channels.length; i++) {
            if (channel_name === await channels[i].getChannelName())
                return true;
        }
        return false;
    }
    async handleChannel(client, data) {
        let com = JSON.parse(data);
        const check = await this.isOnChannel(com.channel_name);
        if (check) {
            return false;
        }
        else {
            let id = await this.getRandomInt();
            channels.push(new channel_service_1.ChannelService({
                channel_name: com.channel_name,
                channel_id: id,
                users: [],
                channel_status: com.status,
                password: await argon.hash(com.password),
                owners: [],
                banned_users: []
            }));
            await this.handleChannelJoin(client, data);
            await this.handleGetAll(client, data);
            return true;
        }
    }
    async handleChannelJoin(client, data) {
        let com = JSON.parse(data);
        let res;
        for (let i = 0; i < channels.length; i++) {
            if (com.channel_name === await channels[i].getChannelName()) {
                res = await channels[i].addUser({
                    socket: client,
                    user_id: com.user_id,
                    user_nick: com.user_nick,
                    is_owner: false,
                    is_muted: false,
                    is_online: true,
                    password: com.password,
                });
                if (res === false) {
                    client.emit('JOIN_STATUS', false);
                    return false;
                }
                else {
                    this.handleGetAll(client, data);
                    client.emit('JOIN_STATUS', true);
                    return true;
                }
            }
        }
    }
    async handleAdmin(client, data) {
        let com = JSON.parse(data);
        for (let i = 0; i < channels.length; i++) {
            if (com.channel_name === await channels[i].getChannelName()) {
                if (com.command === "change_password")
                    await channels[i].changePassw(com.user_id, com.param1);
                else if (com.command === "mute_user") {
                    await channels[i].muteUser(com.user_id, com.param1);
                    setTimeout(async () => {
                        await channels[i].unMuteUser(com.user_id, com.param1);
                        await this.handleGetAll(client, data);
                    }, 20000);
                }
                else if (com.command === "unmute_user")
                    await channels[i].unMuteUser(com.user_id, com.param1);
                else if (com.command === "ban_user")
                    await channels[i].banUser(com.user_id, com.param1);
                else if (com.command === "unban_user")
                    await channels[i].unBanUser(com.user_id, com.param1);
                else if (com.command === "change_status")
                    await channels[i].changeStatus(Number(com.user_id), Number(com.param1), com.param2);
                else if (com.command === "add_admin")
                    await channels[i].addOwner(com.user_id, com.param1);
                else if (com.command === "invite_game") {
                    for (let i = 0; i < busy.length; i++) {
                        const g = busy[i];
                        if (g === com.param1) {
                            client.emit('FEEDBACK', `Cannot be invited. Player is busy!`);
                            client.emit('INVITE_RES', false);
                            return false;
                        }
                    }
                    busy.push(com.user_id);
                    busy.push(com.param1);
                    channels[i].inviteGame(com.user_id, com.param1, busy);
                }
                else if (com.command === "accept_invite") {
                    channels[i].acceptInvite(com.user_id, com.param1);
                }
                await this.handleGetAll(client, data);
                return (true);
            }
        }
        client.emit('FEEDBACK', "Command not found");
        return false;
    }
    async handleGetAll(client, data) {
        const all = [];
        for (let index = 0; index < channels.length; index++) {
            all.push(await channels[index].getInfoLow());
        }
        console.log('bad geldi  all ===', all);
        for (let i = 0; i < onlineUsers.length; i++) {
            const my = [];
            for (let j = 0; j < channels.length; j++) {
                if (await channels[j].isInChannel(onlineUsers[i].user_id)) {
                    my.push(await channels[j].getInfo());
                }
            }
            onlineUsers[i].client.emit('GET_ALL', JSON.stringify({ my_channels: my, all_channels: all }));
        }
    }
    async handleOnline(client, data) {
        let com = JSON.parse(data);
        if (com.user_id > 0) {
            onlineUsers.push({ client: client, user_id: com.user_id });
            for (let i = 0; i < channels.length; i++) {
                if (await channels[i].isInChannel(com.user_id))
                    await channels[i].setOnline(com.user_id, client);
            }
        }
        await this.handleGetAll(client, data);
    }
    async handleLeave(client, data) {
        let com = JSON.parse(data);
        for (let i = 0; i < channels.length; i++) {
            if (com.channel_name === await channels[i].getChannelName()) {
                await channels[i].leaveChannel(com.user_id);
            }
        }
        await this.handleGetAll(client, data);
    }
    async handleFinishGame(client, id) {
        busy.splice(busy.indexOf(id), 1);
    }
    async handleEvent(client, data) {
        let com = JSON.parse(data);
        if (com.sender != '' && com.target != '') {
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
    }
    async handlDirectMessage(client, data) {
        const com = JSON.parse(data);
        if (com.sender != '' && com.target != '') {
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('CHAN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('JOIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleChannelJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dgram_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('GET_ALL'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleGetAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ONLINE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('LEAVE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('FINISH_GAME'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleFinishGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('PRIV'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('DM'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handlDirectMessage", null);
EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } })
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map