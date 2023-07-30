/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop()
    messageId: string;

    @Prop()
    message: string;

    @Prop()
    writed: Date;

    @Prop()
    read: boolean;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    })
    userId: User;
}

export const ChatSchema = SchemaFactory.createForClass(Message);
