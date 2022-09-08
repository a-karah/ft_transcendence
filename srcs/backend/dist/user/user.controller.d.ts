/// <reference types="multer" />
import { ChangeNickDto } from './dto/changenick.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    authUser(code: string): Promise<any>;
    getUserByNick(nickname: any): Promise<import(".prisma/client").User>;
    getUserById(id: any): Promise<import(".prisma/client").User>;
    updateNickanme(changeNickDto: ChangeNickDto): Promise<{
        nick: string;
    }>;
    updateAvatar(file: Express.Multer.File, id: number): Promise<import(".prisma/client").User>;
    generate2FA(id: any): Promise<any>;
    verify2fa(id: any, token: any): Promise<any>;
    changeFactor(id: any): Promise<import(".prisma/client").User>;
    addFriend(id: any, nick: any): Promise<{
        nick: any;
    }>;
    getFriends(id: any): Promise<any[]>;
    blockFriend(id: any, nick: string, isFriend: Boolean): Promise<{
        nick: any;
    }>;
    getBlocks(id: any): Promise<any[]>;
    getUsers(id: any): Promise<import(".prisma/client").User[]>;
    getBlockedBys(id: any): Promise<any[]>;
    removeBlock(id: any, nick: any): Promise<{
        nick: any;
    }>;
    getMatchesById(id: any): Promise<any[]>;
    getAchievementsById(id: any): Promise<import(".prisma/client").Achievements[]>;
    changeUserStatus(id: any, status: any): Promise<import(".prisma/client").User>;
    getHi(): string;
}
