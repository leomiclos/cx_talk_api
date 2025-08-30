import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) { }
  
  async create(user: { id: string }, content: string): Promise<Message> {
    const message = this.messagesRepository.create({
      userId: user.id, 
      content,
      createdAt: new Date(),
    });
    const savedMessage = await this.messagesRepository.save(message);
    
    // Carrega a mensagem com a relação do usuário
    const messageWithUser = await this.messagesRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['user'],
    });
    
    if (!messageWithUser) {
      throw new Error('Erro ao carregar mensagem com usuário');
    }
    
    return messageWithUser;
  }

  async findLast(limit = 50): Promise<Message[]> {
    return this.messagesRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
