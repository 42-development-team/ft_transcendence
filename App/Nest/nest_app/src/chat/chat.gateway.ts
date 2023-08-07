import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({cors: {
    credentials: true,
}})
export class ChatGateway {
    @WebSocketServer()
    server;

    // To get the information from the client:
    // handleMessage(client, data) : void {
        
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string) : void {
        // Broadcast to everyone on the server, including the sender
        this.server.emit('new-message', message);
    }
}