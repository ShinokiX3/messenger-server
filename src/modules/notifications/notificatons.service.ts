import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewMessageEvent } from '../../events/new.message.event';

@Injectable()
export class NotificatonsService {
    @OnEvent('new.message')
    async notifyUser(payload: NewMessageEvent) {
        console.log(`Hello new message, ${payload}`);
    }
}
