import { Socket, Server } from 'socket.io';
export declare class GameGateway {
    wss: Server;
    private logger;
    afterInit(server: Server): void;
    init_function(id: any[]): void;
    delete_match_info(match_id: any, user_id: any): void;
    handleDisconnect(client: Socket): void;
    lobby_send_function(): void;
    win_loss_function(info: any): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleNewConnectionFunction(client: Socket, data: any): void;
    showWaitingRoom(): void;
    showMatches(): void;
    game: (match_id: string, match_info_id: any) => void;
    alreadyInGameHandleFunction(client: Socket, invited_id: number): void;
    userMouseMovementHandle(client: Socket, side: string): void;
    outRoomRequestHandler(client: Socket, match_id: any): void;
    handleMessage(client: Socket, match_id: number): void;
    handleJoinRoomFromAnotherPage(client: Socket, user_id: number): void;
}
