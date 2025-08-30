// src/chat/chat.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let service: Partial<ChatService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findLast: jest.fn().mockResolvedValue([]),
    };

    jwtService = {
      verify: jest.fn().mockReturnValue({ id: '1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: service },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should emit history on connect', async () => {
    const client: any = {
      handshake: { headers: { authorization: 'Bearer token' } },
      emit: jest.fn(),
    };

    await gateway.handleConnection(client);
    expect(jwtService.verify).toHaveBeenCalledWith('token');
    expect(client.emit).toHaveBeenCalledWith('history', []);
  });

  it('should broadcast message', async () => {
    const client: any = { data: { userId: '1' } };
    gateway.server = { emit: jest.fn() } as any;

    (service.create as jest.Mock).mockResolvedValue({ text: 'oi', user: { id: '1' } });

    await gateway.handleMessage(client, { text: 'oi' });
    expect(service.create).toHaveBeenCalledWith({ id: '1' }, 'oi');
    expect(gateway.server.emit).toHaveBeenCalledWith('message', { text: 'oi', user: { id: '1' } });
  });
});
