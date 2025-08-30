// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ChatModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, __dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, 
      ssl: { rejectUnauthorized: false }, // necessário no Neon
    }),
  ],
})
export class AppModule {}
