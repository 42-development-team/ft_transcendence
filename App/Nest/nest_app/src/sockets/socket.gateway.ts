import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatroomService } from '../chatroom/chatroom.service';


@Injectable()
@WebSocketGateway({cors:{
    credentials: true,
}})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private chatroomService: ChatroomService) {}
    
    @WebSocketServer()
    server: Server;

     // Todo: onModuleInit()
        // OnNewConnection()
            // Check for verifiedJWT in socket and disconnect if not OK
            // Connect the user back to all of this channels
        // OnDisconnect()

    // The client object is an instance of the Socket class provided by the Socket.io library.
    // handleConnection is a method predefined on OnGatewayConnection. We can't change the name
    // why "(client: Socket)" ? because client is an instance of Socket class 
    handleConnection(client: Socket){
        console.log('Client connected: ' + client.id);
        // Check for verifiedJWT in socket and disconnect if not OK
    }

    // handleDisconnect is a predefined method of the OnGatewayDisconnect interface
    handleDisconnect(client: Socket){
        console.log('Client disconnected: ' + client.id);
        // add logic for:
        // remove 
    }

    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, room: string){
        client.join(room);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket
        ) : Promise<void> {
        const user = await this.chatroomService.getUserFromSocket(client);

        // Todo: add the message to the database
        this.server.emit('new-message', 
            {message, user}
        );
    }

    // broadcast(message: Message){
    //     this.server.emit('message', message);
    // }
}