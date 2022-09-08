import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeNickDto } from './dto/changenick.dto';
import { User } from '.prisma/client';
export declare class UserService {
    private context;
    private config;
    private readonly httpService;
    constructor(context: PrismaService, config: ConfigService, httpService: HttpService);
    getToken(code: string): Promise<any>;
    getIntraUser(accessObject: any): Promise<any>;
    getUserById(id: any): Promise<User>;
    getUserByLogin(login: string): Promise<User>;
    getUserByNick(nick: string): Promise<User>;
    addNewUser(userData: any): any;
    authUser(code: string): Promise<any>;
    changeNickName(changeNickDto: ChangeNickDto): Promise<{
        nick: string;
    }>;
    changeAvatar(id: any): Promise<User>;
    changeFactor(id: any): Promise<User>;
    generateSecretAndQRCode(id: any): Promise<any>;
    verify2fa(id: any, token: any): Promise<any>;
    isBlocked(user: any, friendId: any): Promise<boolean>;
    isAlreadyFriend(user: any, friendId: any): Promise<boolean>;
    addFriend(id: any, nick: any): Promise<{
        nick: any;
    }>;
    getFriends(id: any): Promise<any[]>;
    blockFriend(id: any, nick: any, isFriend: any): Promise<{
        nick: any;
    }>;
    getBlocks(id: any): Promise<any[]>;
    getBlockedBys(id: any): Promise<any[]>;
    removeBlock(id: any, nick: any): Promise<{
        nick: any;
    }>;
    getMatchesById(id: any): Promise<any[]>;
    amIBlocked(user: User, id: number): Promise<boolean>;
    getAllUsers(id: number): Promise<User[]>;
    getAchievementsById(id: any): Promise<import(".prisma/client").Achievements[]>;
    changeStatusById(id: any, status: any): Promise<User>;
}
