import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
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

     // The client object is an instance of the Socket class provided by the Socket.io library.
     // handleConnection is a method predefined on OnGatewayConnection. We can't change the name
     // why "(client: Socket)" ? because client is an instance of Socket class 
     handleConnection(client: Socket){
         console.log('Client connected: ' + client.id);
         // todo:
         // Check for verifiedJWT in socket and disconnect if not OK
         // and retrieve all the channels the user is member of
    }

    // handleDisconnect is a predefined method of the OnGatewayDisconnect interface
    handleDisconnect(client: Socket){
        console.log('Client disconnected: ' + client.id);
        // add logic for:
        // remove 
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(client: Socket, room: string){
        console.log(`Client ${client.id} joined room ${room}`);
        client.join(room);
        const user = await this.chatroomService.getUserFromSocket(client);
        // Todo: emit on socket to announce new user joined
        this.server.to(room).emit('newConnection', 
            {room, user}
        );
    }

    /* 
        if in the future we come back to the idea of centralizing socket.emit + adding user to channel in DB
        for now not considered the best choice in order to keep HTTP status response and separation of concerns
    */
    // @SubscribeMessage('joinRoom')
    // async joinRoom(@ConnectedSocket() client: Socket, room: string) {
    //     console.log("room name got when emit joinroom: ", room);
    //     const userId = await this.chatroomService.getUserIdFromSocket(client); 
    //     const password = await this.chatroomService.getPasswordFromChannelName(room);
    //     const channelId = await this.chatroomService.getIdFromChannelName(room);
        
    //     try {
    //         const updateResult = await this.chatroomService.join(channelId, userId, password);
    //         client.join(room);
    //         console.log(`Client ${client.id} joined room ${room}`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        console.log(`Client ${client.id} left room ${room}`);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket
        ) : Promise<void> {
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        const {roomId, message} = body;
        const newMessage = await this.chatroomService.addMessageToChannel(roomId, userId, message);
        const room = await this.chatroomService.getChannelNameFromId(roomId);
        this.server.to(room).emit('new-message', 
            {newMessage, room}
        );
    }
    
}