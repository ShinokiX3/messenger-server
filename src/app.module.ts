/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
// import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';

import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TokenModule } from './modules/token/token.module';

import * as path from 'path';
import { FileModule } from './modules/file/file.module';
import { MessegesModule } from './messeges/messeges.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '../static'),
        }),
        MongooseModule.forRoot(
            'mongodb+srv://shinoki:baiTe17roLeLH1al@cluster0.9dosere.mongodb.net/messenger?retryWrites=true&w=majority',
        ),
        UsersModule,
        // ChatModule,
        AuthModule,
        TokenModule,
        FileModule,
        MessegesModule,
        EventEmitterModule.forRoot(),
    ],
})
export class AppModule {}
