import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) { }

  async handleConnection(client: any) {
    try {
      const tokenHeader = client.handshake.headers.authorization;

      const token = tokenHeader?.split(' ')[1];

      if (!token) throw new UnauthorizedException();

      const payload = this.jwtService.verify(token);

      client.data.userId = payload.sub;
      
      
      
      const user = await this.usersService.findMe(payload.sub);
    
      if (user) {
        client.data.userName = user.name;
        client.data.userEmail = user.email;
      }
      
      const lastMessages = await this.chatService.findLast();
      client.emit('history', lastMessages.reverse());
      
      
      this.server.emit('user:joined', {
        userId: payload.sub,
        userName: user?.name || 'Usuário',
        userEmail: user?.email || '',
        timestamp: new Date(),
      });
      
      
    } catch (err) {
      client.disconnect();
    }

  }

  async handleDisconnect(client: any) {
    try {
      
      if (client.data.userId) {
        this.server.emit('user:left', {
          userId: client.data.userId,
          userName: client.data.userName || 'Usuário',
          userEmail: client.data.userEmail || '',
          timestamp: new Date(),
        });
        
        
      }
    } catch (error) {
      console.error('Erro ao processar desconexão:', error);
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
