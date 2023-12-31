import { SocketService } from './../../socket/socket.service';
import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    UseGuards,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { CreateChatDTO } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

// import { MessegesGateway } from 'src/messeges/messeges.gateway';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        // private readonly messageGateway: MessegesGateway,
        private readonly socketService: SocketService,
        private eventEmitter: EventEmitter2,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createChat(@Req() request, @Body() dto: CreateChatDTO): Promise<boolean> {
        const user = request.user;
        return this.chatService.createChat(user, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    getAllChats(@Req() request): Promise<boolean> {
        const user = request.user;
        return this.chatService.getAllChats(user);
    }

    // On message chat list update

    @Get('/connection')
    getAllChatsConnection(
        @Req() request,
        @Res() response,
    ): Promise<boolean> | any {
        const user = request.user;
        response.writeHead(200, {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        });
        this.eventEmitter.on('new.message', (participants: any) => {
            const chats = this.chatService.getAllChats(user);
            response.write(`data: ${JSON.stringify(chats)} \n\n`);
        });
    }

    // Search

    @UseGuards(JwtAuthGuard)
    @Post('/search')
    searchChat(@Req() request, @Body() dto: CreateChatDTO): Promise<any> {
        const user = request.user;
        return this.chatService.searchChat(user, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/search/id')
    searchById(@Body() dto: { chatId: string }): Promise<any> {
        return this.chatService.searchById(dto);
    }

    // Pictures

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
    createProduct(@UploadedFiles() files, @Body() dto: any): Promise<any> {
        const { picture } = files;
        return this.chatService.sendWithPhotos(dto, picture);
    }

    @UseGuards(JwtAuthGuard)
    @Post('send/photo')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
    async sendWithPhotos(
        @UploadedFiles() files,
        @Body() dto: any,
    ): Promise<any> {
        const { picture } = files;
        const message = await this.chatService.sendWithPhotos(dto, picture);
        // this.messageGateway.server.to(dto.chatId).emit('message', message);
        this.socketService.socket.to(dto.chatId).emit('message', message);
        return message;
    }
}

// @UseGuards(JwtAuthGuard)

// response.status(HttpStatus.OK);
// response.set('Connection', 'keep-alive');
// response.set('Content-Type', 'text/event-stream');
// response.set('Cache-Control', 'no-cache');
// const user = request.user;
// return this.chatService.getAllChats(user);

// @UseGuards(JwtAuthGuard)
// @Get('/chat/all')
// getAllOrders(@Req() request): Promise<boolean> {
//     // return this.userService.getAllOrders(request);
//     return null;
// }
