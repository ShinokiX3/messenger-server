/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { UsersModule } from '../users/users.module';
import { FileService } from '../file/file.service';

// import { FileService } from '../file/file.service';
// import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        UsersModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, FileService],
    exports: [ChatService],
})
export class ChatModule {}
