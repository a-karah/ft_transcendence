export declare class ChannelService {
    private data;
    private socket;
    private game_list;
    private socket_flag;
    constructor(data: any);
    sendAll(data: any): Promise<boolean>;
    getChannelName(): Promise<string>;
    getChanId(): Promise<number>;
    join(user: any): Promise<boolean>;
    getInfo(): Promise<any>;
    getInfoLow(): Promise<any>;
    getUserById(id: any): {
        socket: any;
        user_id: number;
        user_nick: string;
        is_owner: boolean;
        is_muted: boolean;
        is_online: boolean;
    };
    inviteGame(user_id: number, invited_id: number, busy: number[]): boolean;
    acceptInvite(user_id: number, opponent_id: number): boolean;
    addUser(user: any): Promise<boolean>;
    addOwner(prev_owner: number, new_owner: number): Promise<boolean>;
    setOffline(client: any): Promise<void>;
    setOnline(user_id: number, client: any): Promise<void>;
    changeStatus(user_id: number, status: number, pass: string): Promise<boolean>;
    isInChannel(user_id: number): Promise<boolean>;
    isMuted(user_id: number): Promise<boolean>;
    isOwner(user_id: number): Promise<boolean>;
    isBanned(user_id: number): Promise<boolean>;
    banUser(user_id: number, banned_id: number): Promise<boolean>;
    unBanUser(user_id: number, banned_id: number): Promise<boolean>;
    muteUser(user_id: number, muted_id: number): Promise<boolean>;
    unMuteUser(user_id: number, unmuted_id: number): Promise<boolean>;
    changePassw(user_id: number, pass: string): Promise<boolean>;
    leaveChannel(user_id: number): Promise<void>;
}
