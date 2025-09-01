import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: { create: jest.fn(), findLast: jest.fn() } },
        { provide: JwtService, useValue: { verify: jest.fn().mockReturnValue({ sub: '1' }) } },
        { provide: UsersService, useValue: { findMe: jest.fn().mockResolvedValue({ id: '1', name: 'Leo', email: 'leo@test.com' }) } },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    service = module.get<ChatService>(ChatService);
    gateway.server = { emit: jest.fn() } as any;
  });

  it('should emit history on connect', async () => {
    (service.findLast as jest.Mock).mockResolvedValue([{ id: '1', text: 'oi' }]);

    const client: any = {
      handshake: { headers: { authorization: 'Bearer token' } },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(), 
    };

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('history', expect.any(Array));
    expect(gateway.server.emit).toHaveBeenCalledWith('user:joined', expect.objectContaining({ userId: '1' }));
  });

  it('should broadcast message', async () => {
    const client: any = {
      data: { userId: '1' }, 
    };

    (service.create as jest.Mock).mockResolvedValue({ id: '1', text: 'oi', user: { id: '1' } });

    await gateway.handleMessage(client, { text: 'oi' });

    expect(service.create).toHaveBeenCalledWith({ id: '1' }, 'oi');
    expect(gateway.server.emit).toHaveBeenCalledWith('message', { id: '1', text: 'oi', user: { id: '1' } });
  });
});
