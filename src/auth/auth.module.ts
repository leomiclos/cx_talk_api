import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; 
import { JwtStrategy } from './jwt.strategy';
import * as env from 'dotenv';
import { AuthController } from './auth.controller';

env.config();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'cx_talk',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [ AuthController ],
})
export class AuthModule {}
