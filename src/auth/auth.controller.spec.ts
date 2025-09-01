import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('Auth E2E', () => {
  let app: INestApplication;

  const mockUser = {
    id: '1',
    name: 'John',
    email: 'john@test.com',
    password: '', 
  };

  beforeAll(async () => {

    mockUser.password = await bcrypt.hash('123456', 10);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue({
        findByEmail: jest.fn().mockImplementation((email: string) => {
          if (email === mockUser.email) return Promise.resolve(mockUser);
          return Promise.resolve(null);
        }),
      })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn().mockReturnValue('token-mock'),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login and get access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: mockUser.email, password: '123456' })
      .expect(201);

    expect(res.body).toHaveProperty('access_token', 'token-mock');
  });

  it('should deny access without token', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .expect(401);
  });

  it('should deny access with invalid token', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });
});
