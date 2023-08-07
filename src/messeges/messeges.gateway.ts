import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { MessegesService } from './messeges.service';
import { CreateMessegeDto } from './dto/create-messege.dto';
import { UpdateMessegeDto } from './dto/update-messege.dto';
import { WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinUserDto } from './dto/join-user.dto';
import { TypingMessageDto } from './dto/typing-message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MessegesGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messegesService: MessegesService) {}

    @SubscribeMessage('createMessege')
    async create(
        @MessageBody() createMessegeDto: CreateMessegeDto,
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.messegesService.create(
            createMessegeDto,
            client.id,
        );

        this.server.to(createMessegeDto.room).emit('message', message);
        return message;
    }

    @SubscribeMessage('createWithImage')
    async createWithImage(
        @MessageBody() createMessegeDto: CreateMessegeDto,
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.messegesService.create(
            createMessegeDto,
            client.id,
        );

        this.server.to(createMessegeDto.room).emit('message', message);
        return message;
    }

    @SubscribeMessage('findAllMesseges')
    findAll(@MessageBody('room') room: string) {
        return this.messegesService.findAll(room);
    }

    @SubscribeMessage('findOneMessege')
    findOne(@MessageBody() id: number) {
        return this.messegesService.findOne(id);
    }

    @SubscribeMessage('updateMessege')
    update(@MessageBody() updateMessegeDto: UpdateMessegeDto) {
        return this.messegesService.update(
            updateMessegeDto.id,
            updateMessegeDto,
        );
    }

    @SubscribeMessage('removeMessege')
    remove(@MessageBody() id: number) {
        return this.messegesService.remove(id);
    }

    @SubscribeMessage('join')
    joinRoom(
        @MessageBody() joinUserDto: JoinUserDto,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(joinUserDto.room);
        return this.messegesService.identify(joinUserDto.name, client.id);
        // client.to(joinUserDto.room).emit('message', { text: joinUserDto.room });
    }

    @SubscribeMessage('typing')
    async typing(
        // @MessageBody('isTyping') isTyping: boolean,
        @MessageBody() typingMessageDto: TypingMessageDto,
        @ConnectedSocket() client: Socket,
    ) {
        const name = await this.messegesService.getClientName(client.id);
        client.broadcast
            .to(typingMessageDto.room)
            .emit('typing', { name, isTyping: typingMessageDto.isTyping });
    }
}
