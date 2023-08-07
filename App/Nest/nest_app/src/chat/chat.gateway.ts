import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({cors: {
    credentials: true,
}})

// Todo: do we need - implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class ChatGateway {
    constructor(private ChatService: ChatService)  {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket
        ) : Promise<void> {
        const user = await this.ChatService.getUserFromSocket(client);

        // Todo: add the message to the database
        this.server.emit('new-message', 
            {message, user}
        );
    }
}