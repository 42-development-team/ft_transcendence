import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;

    // The client object is an instance of the Socket class provided by the Socket.io library.
    // handleConnection is a method predefined on OnGatewayConnection. We can't change the name
    // why "(client: Socket)" ? because client is an instance of Socket class 
    handleConnection(client: Socket){
        console.log('Client connected: ' + client.id);
        client.emit('welcome', 'Welcome to the chat');
        // add chat name
    }

    // handleDisconnect is a predefined method of the OnGatewayDisconnect interface
    handleDisconnect(client: Socket){
        console.log('Client disconnected: ' + client.id);
        // add logic for:
        // remove 
    }

    broadcast(message: Message){
        this.server.emit('message', message);
    }
}