import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [TokenService, JwtService, ConfigService],
    exports: [TokenService],
})
export class TokenModule {}
