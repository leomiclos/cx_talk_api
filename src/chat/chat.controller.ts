import {  Controller, Get, Query,} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('last')
  async findLast(@Query('limit') limit?: number): Promise<Message[]> {
    return this.chatService.findLast(limit ? +limit : 50);
  }
  
}
