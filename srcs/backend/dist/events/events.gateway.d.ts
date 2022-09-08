/// <reference types="node" />
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    handleDisconnect(client: any): Promise<void>;
    handleConnection(client: any, ...args: any[]): void;
    afterInit(server: any): void;
    getRandomInt(): Promise<number>;
    isOnChannel(channel_name: string): Promise<boolean>;
    handleChannel(client: any, data: any): Promise<any>;
    handleChannelJoin(client: any, data: any): Promise<any>;
    handleAdmin(client: Socket, data: any): Promise<boolean>;
    handleGetAll(client: any, data: any): Promise<void>;
    handleOnline(client: any, data: any): Promise<void>;
    handleLeave(client: any, data: any): Promise<void>;
    handleFinishGame(client: any, id: any): Promise<void>;
    handleEvent(client: any, data: any): Promise<string>;
    handlDirectMessage(client: any, data: any): Promise<any>;
}
