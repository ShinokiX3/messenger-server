import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from '../../strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [UsersModule, TokenModule, ChatModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
