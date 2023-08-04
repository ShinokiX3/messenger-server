/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateChatDTO } from './dto';
import { v4 as uuid } from 'uuid';

import { Model } from 'mongoose';

import {
    Chat,
    ChatDocument,
    IChat,
    IMessage,
    TCombinedMessageTypes,
    TWithImageMessage,
} from './schemas/chat.schema';

import { InjectModel } from '@nestjs/mongoose';
import { parseToStringTime } from '../../utils/parseToStringTime';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewMessageEvent } from '../../events/new.message.event';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private readonly userService: UsersService,
        private eventEmitter: EventEmitter2,
        private fileService: FileService,
    ) {}

    async createChat(user: any, dto: CreateChatDTO) {
        try {
            const asking = await this.userService.findUserById(user[0]._id);
            const stranger = await this.userService.findUserById(dto.revieving);

            const participants = [asking[0]._id, stranger[0]._id].sort();
            // TODO: rework and move to new special file
            const chatId = `${String(participants[0]).substring(5, 10)}${String(
                participants[1],
            ).substring(5, 10)}`;

            const search = await this.chatModel.find({ chatId: chatId });

            // TODO: rework checking for exist chat
            // const search = asking[0].chats.some((chat) =>
            //     stranger[0].chats.some(
            //         (s_chat) => String(s_chat) === String(chat),
            //     ),
            // );

            if (search.length >= 1)
                throw new Error('Chat with this person is already exist.');

            const initial: IMessage = {
                userId: 'system',
                messageId: uuid(),
                message: 'Channel created',
                writed: new Date(),
                read: 'sended',
            };

            // chatId: uuid()

            const chat: IChat = {
                chatId: chatId,
                created: new Date(),
                pinned:
                    String(participants[0]) !== String(participants[1])
                        ? false
                        : true,
                messages: [
                    {
                        [parseToStringTime(new Date(), 'message')]: [initial],
                    },
                ],
                last: initial,
                read: {
                    importance: 'important',
                    quantity: 1,
                },
                participants: participants,
            };

            const createdChat = await this.chatModel.create(chat);

            const response = await this.userService.pushChat(
                participants,
                createdChat._id,
            );

            return [{ chatId: chatId }, response];
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // TODO: prob. this msut be other type of t-sided connection or eth websocket
    // create new user type

    async getAllChats(user: any) {
        try {
            const asking = await this.userService.findUserById(user[0]._id);

            const chats = await this.chatModel.find({
                _id: [...asking[0].chats.map((chat) => String(chat))],
            });

            const response = await Promise.all(
                chats.map(async (chat: any) => {
                    const stranger = chat.participants.filter(
                        (id) => String(id) !== String(user[0]._id),
                    );
                    const response =
                        stranger.length > 0
                            ? await this.userService.findUserById(
                                  String(stranger[0]),
                              )
                            : [{ _id: asking[0]._id, name: 'Saved Messages' }];
                    const newChat = {
                        ...chat._doc,
                        participants: [
                            { id: response[0]._id, title: response[0].name },
                        ],
                    };
                    return newChat;
                }),
            );

            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async searchChat(tUser: any, dto: CreateChatDTO) {
        try {
            // TODO: rework to search by multiply ids
            const user = await this.userService.findUserById(tUser[0]._id);
            const stranger = await this.userService.findUserById(dto.revieving);

            const participants = [user[0]._id, stranger[0]._id].sort();

            const chatId = `${String(participants[0]).substring(5, 10)}${String(
                participants[1],
            ).substring(5, 10)}`;

            const chat = await this.chatModel.find({
                chatId: chatId,
            });

            if (chat.length < 1) return await this.createChat(tUser, dto);
            else return chat;
        } catch (error) {
            console.log(error);
        }
    }

    // TODO: rework, two same functions...

    async search(chatId: string) {
        try {
            const chat = await this.chatModel.find({ chatId: chatId });
            return chat[0].messages;
        } catch (error) {
            console.log(error);
        }
    }

    async searchById(dto: { chatId: string }) {
        try {
            const chat = await this.chatModel.find({ chatId: dto.chatId });
            const users = await this.userService.findUsersByIds(
                chat[0].participants,
            );
            return [chat[0], users];
        } catch (error) {
            console.log(error);
        }
    }

    async sendMessage({
        userId,
        chatId,
        message,
    }: {
        userId: string;
        chatId: string;
        message: TCombinedMessageTypes;
    }) {
        try {
            const user = await this.userService.findUserById(userId);
            const date = parseToStringTime(new Date(), 'message');
            const messageId = uuid();

            const newMessage: IMessage = {
                userId: userId,
                messageId: messageId,
                message: message,
                writed: new Date(),
                read: 'sended',
            };

            const chat: IChat[] = await this.chatModel.find({
                chatId: chatId,
            });
            const isNewDate =
                Object.keys(
                    chat[0].messages[chat[0].messages.length - 1],
                )[0] !== date;

            if (isNewDate) {
                await this.chatModel.updateOne(
                    { chatId: chatId },
                    { $push: { messages: { [date]: [newMessage] } } },
                );
            } else {
                await this.chatModel.updateOne(
                    { chatId: chatId },
                    {
                        $push: {
                            [`messages.${String(
                                chat[0].messages.length - 1,
                            )}.${date}`]: newMessage,
                        },
                    },
                );
            }

            await this.chatModel.updateOne(
                { chatId: chatId },
                {
                    $set: { last: { ...newMessage, from: user[0].name } },
                },
            );

            this.eventEmitter.emit(
                'new.message',
                new NewMessageEvent(chat[0].participants),
            );

            return newMessage;
        } catch (error) {
            console.log(error);
        }
    }

    // Photos

    async sendWithPhotos(
        dto: { userId: string; chatId: string; message: string },
        picture,
    ): Promise<any> {
        try {
            // TODO: make to multiply photos upload

            const picturePath = this.fileService.createFile(
                FileType.IMAGE,
                picture,
            );

            const withImageMessage: TWithImageMessage = {
                pictures: [picturePath],
                message: dto.message,
            };

            const sendedMessage = await this.sendMessage({
                ...dto,
                message: withImageMessage,
            });

            return sendedMessage && null;
        } catch (error) {
            console.log(error);
        }
    }
}

//     @Prop()
//     chatId: string;

//     @Prop()
//     created: Date;

//     @Prop({ type: Object })
//     messages: IMessages;

//     @Prop({ type: Object })
//     last: IMessage;

//     @Prop({ type: Object })
//     read: IRead;

//     @Prop({
//         type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
//     })
//     participants: User[];

// export type TMessageUnreadImportance = 'regular' | 'important';
// export type TMessageDeliveryStatus = 'sended' | 'read';

// interface IRead {
//     importance: TMessageUnreadImportance;
//     quantity: number;
// }

// interface IMessage {
//     message: string;
//     userId: string;
//     writed: Date;
//     read: TMessageDeliveryStatus;
// }

// interface IMessages {
//     [day: string]: {
//         [messageId: string]: IMessage;
//     };
// }

// private readonly tokenService: TokenService,

// async createProduct(dto: CreateProductDTO, picture): Promise<any> {
//     try {
//         const product = await this.productsModel.find({
//             title: dto.title,
//         });

//         if (product.length < 1) {
//             const picturePath = this.fileService.createFile(
//                 FileType.IMAGE,
//                 picture,
//             );

//             const product = this.productsModel.create({
//                 ...dto,
//                 picture: picturePath,
//             });

//             return product;
//         }
//         return { error: '', message: 'Product already exist' };
//     } catch (e) {
//         throw new BadRequestException('error');
//     }
// }
