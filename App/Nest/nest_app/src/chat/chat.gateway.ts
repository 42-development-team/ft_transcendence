import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({cors: {
    credentials: true,
}})

// Todo: do we need - implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class ChatGateway {
    constructor(private ChatService: ChatService)  {}

    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket
        ) : Promise<void> {
        const user = await this.ChatService.getUserFromSocket(client);

        // Todo: add the message to the database

        console.log("Message received: " + message + " from ID " + user.username);
        this.server.emit('new-message', 
            {message, user}
        );
    }
}