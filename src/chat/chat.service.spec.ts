// src/chat/chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

describe('ChatService', () => {
  let service: ChatService;
  let repo: Repository<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Message),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    repo = module.get<Repository<Message>>(getRepositoryToken(Message));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a message', async () => {
    const mockMessage = { content: 'Oi', user: { id: '1' } };
    jest.spyOn(repo, 'create').mockReturnValue(mockMessage as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...mockMessage, id: '1' } as any);

    const result = await service.create({ id: '1' } as any, 'Oi');
    expect(result).toEqual({ content: 'Oi', user: { id: '1' }, id: '1' });
  });

  it('should fetch last messages', async () => {
    const mockMessages = [{ id: '1', content: 'Hi', user: { id: '1' } }];
    jest.spyOn(repo, 'find').mockResolvedValue(mockMessages as any);

    const result = await service.findLast();
    expect(result).toEqual(mockMessages);
  });
});
