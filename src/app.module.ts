import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Chat } from './chat/entities/chat.entity';

@Module({
  imports: [
    UsersModule, 
    ChatModule, 
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [User, Chat],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
