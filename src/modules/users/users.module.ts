/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { FileService } from '../file/file.service';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { Favourites, FavouritesSchema } from './schemas/favourites.schema';
import { Orders, OrdersSchema } from './schemas/orders.schema';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenModule } from '../token/token.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        MongooseModule.forFeature([
            { name: Favourites.name, schema: FavouritesSchema },
        ]),
        MongooseModule.forFeature([
            { name: Orders.name, schema: OrdersSchema },
        ]),
        TokenModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
