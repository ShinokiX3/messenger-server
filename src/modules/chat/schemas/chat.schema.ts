/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

// TODO: move to type file

export type TMessageUnreadImportance = 'regular' | 'important';
export type TMessageDeliveryStatus = 'sended' | 'read';

export interface IRead {
    importance: TMessageUnreadImportance;
    quantity: number;
}

export interface IMessage {
    userId: string;
    messageId: string;
    message: string;
    writed: Date;
    read: TMessageDeliveryStatus;
}

export interface IMessages {
    [day: string]: IMessage[];
}

export interface IChat {
    chatId: string;
    created: Date;
    messages: IMessages[];
    last: IMessage;
    read: IRead;
    participants: string[];
    pinned: boolean;
}

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
    @Prop()
    chatId: string;

    @Prop()
    created: Date;

    @Prop()
    pinned: boolean;

    @Prop({ type: Object })
    messages: IMessages;

    @Prop({ type: Object })
    last: IMessage;

    @Prop({ type: Object })
    read: IRead;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    })
    participants: User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
