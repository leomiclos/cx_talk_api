import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

describe('ChatService', () => {
  let service: ChatService;
  let repo: jest.Mocked<Repository<Message>>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<Message>>> = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Message),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    repo = module.get(getRepositoryToken(Message));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

it('should save a message', async () => {
  const mockMessage = { id: '1', content: 'Oi', user: { id: '1' } };

  jest.spyOn(repo, 'create').mockReturnValue(mockMessage as any);
  jest.spyOn(repo, 'save').mockResolvedValue(mockMessage as any);
  jest.spyOn(repo, 'findOne').mockResolvedValue(mockMessage as any);

  const result = await service.create({ id: '1' } as any, 'Oi');
  expect(result).toEqual(mockMessage);
});


  it('should fetch last messages', async () => {
    const mockMessages = [{ id: '1', content: 'Hi', user: { id: '1' } }] as any;

    repo.find.mockResolvedValue(mockMessages);

    const result = await service.findLast();
    expect(result).toEqual(mockMessages);
  });
});
