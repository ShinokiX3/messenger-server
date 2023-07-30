/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { Role } from './role.schema';
import { Chat } from 'src/modules/chat/schemas/chat.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    uniqName: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    joindate: Date;

    @Prop()
    birthdate: Date;

    @Prop()
    picture: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
    role: Role[];

    // TODO: rewrite adding to friends list with new object

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    })
    friends: User[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    })
    chats: Chat[];
}

export const UserSchema = SchemaFactory.createForClass(User);
