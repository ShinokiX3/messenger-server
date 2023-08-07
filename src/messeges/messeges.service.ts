import { Injectable } from '@nestjs/common';
import { CreateMessegeDto } from './dto/create-messege.dto';
import { UpdateMessegeDto } from './dto/update-messege.dto';
import { ChatService } from 'src/modules/chat/chat.service';

@Injectable()
export class MessegesService {
    constructor(private readonly chatService: ChatService) {}
    // messeges: Messege[] = [{ name: 'Marius', text: 'hello' }];

    // TODO: change any to defined type

    messeges: any = { '11111': [{ name: 'Marius', text: 'hello' }] };
    clientToUser = {};

    identify(name: string, clientId: string) {
        this.clientToUser[clientId] = name;
        return clientId;
    }

    getClientName(clientId: string) {
        return this.clientToUser[clientId];
    }

    async create(createMessegeDto: CreateMessegeDto, clientId: string) {
        const { userId, message, room } = createMessegeDto;
        const messege = {
            name: this.getClientName(clientId),
            text: createMessegeDto.text,
        };

        if (this.messeges[room] === undefined) this.messeges[room] = [];

        this.messeges[room].push(messege);

        const messages = await this.chatService.sendMessage({
            userId: userId,
            chatId: room,
            message: message,
        });

        return messages;
    }

    async createWithImage(createMessegeDto: CreateMessegeDto, picture: File) {
        const { userId, message, room } = createMessegeDto;

        if (this.messeges[room] === undefined) this.messeges[room] = [];

        this.messeges[room].push(message);

        const messages = await this.chatService.sendWithPhotos(
            {
                userId: userId,
                chatId: room,
                message: message,
            },
            picture,
        );

        return messages;
    }

    async findAll(room: string) {
        return await this.chatService.search(room);
    }

    findOne(id: number) {
        return `This action returns a #${id} messege`;
    }

    update(id: number, updateMessegeDto: UpdateMessegeDto) {
        return updateMessegeDto;
    }

    remove(id: number) {
        return `This action removes a #${id} messege`;
    }
}
