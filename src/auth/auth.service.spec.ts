// auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt', () => ({
  hash: jest.fn((pass: string) => Promise.resolve(`hashed-${pass}`)),
  compare: jest.fn((pass: string, hashed: string) => Promise.resolve(hashed === `hashed-${pass}`)),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('token-mock'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const dto = { id: '1', name: 'John', email: 'john@test.com', password: '123456' };
      (usersService.create as jest.Mock).mockResolvedValue({
        ...dto,
        password: `hashed-${dto.password}`,
      });

      const result = await service.register(dto);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
          password: expect.any(String),
        }),
      );
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('login', () => {
    it('should return token if credentials are valid', async () => {
      const dto = { email: 'john@test.com', password: '123456' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        password: `hashed-${dto.password}`,
      });

      const result = await service.login(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({ access_token: 'token-mock' });
    });

    it('should throw if user does not exist', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(service.login({ email: 'invalid@test.com', password: '123456' })).rejects.toThrow();
    });

    it('should throw if password is incorrect', async () => {
      const dto = { email: 'john@test.com', password: 'wrongpass' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: '1',
        email: dto.email,
        password: `hashed-123456`,
      });

      await expect(service.login(dto)).rejects.toThrow();
    });
  });
});
