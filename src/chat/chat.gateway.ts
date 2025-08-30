import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { log } from 'console';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) { }

  async handleConnection(client: any) {
    try {
      const tokenHeader = client.handshake.headers.authorization;

      const token = tokenHeader?.split(' ')[1];

      if (!token) throw new UnauthorizedException();

      const payload = this.jwtService.verify(token);

      client.data.userId = payload.sub;
      const lastMessages = await this.chatService.findLast();
      client.emit('history', lastMessages.reverse());
      console.log('Conexão WebSocket autorizada para usuário:', payload.sub);
    } catch (err) {
      client.disconnect();
    }

  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: { text: string }) {
    try {
      
      if (!client.data.userId) {
        console.error('Usuário não autenticado para enviar mensagem');
        return;
      }

      if (!payload.text || !payload.text.trim()) {
        console.error('Mensagem vazia recebida');
        return;
      }

      const message = await this.chatService.create(
        { id: client.data.userId } as any,
        payload.text
      );
      
      this.server.emit('message', message);

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  }



}
