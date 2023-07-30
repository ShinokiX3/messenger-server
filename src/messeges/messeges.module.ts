import { Module } from '@nestjs/common';
import { MessegesService } from './messeges.service';
import { MessegesGateway } from './messeges.gateway';
import { ChatModule } from 'src/modules/chat/chat.module';

@Module({
    imports: [ChatModule],
    providers: [MessegesGateway, MessegesService],
})
export class MessegesModule {}
