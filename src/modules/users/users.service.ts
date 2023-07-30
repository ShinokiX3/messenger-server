import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from '../auth/response';

import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { Role, RoleDocument } from './schemas/role.schema';
import { Favourites, FavouritesDocument } from './schemas/favourites.schema';
import { Orders, OrdersDocument } from './schemas/orders.schema';

import { InjectModel } from '@nestjs/mongoose';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Orders.name) private orderModel: Model<OrdersDocument>,
        @InjectModel(Favourites.name)
        private favouritesModel: Model<FavouritesDocument>,
        @InjectModel(Orders.name) private OrdersModel: Model<OrdersDocument>,
        private readonly tokenService: TokenService,
    ) {}

    async hashPassword(password: string): Promise<string> {
        try {
            return bcrypt.hash(password, 10);
        } catch (e) {
            throw new Error(e);
        }
    }

    async findUserByEmail(email: string): Promise<User | any> {
        try {
            return await this.userModel.find({
                email: email,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async findUserByPhone(phone: string): Promise<User | any> {
        try {
            return await this.userModel.find({
                phone: phone,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async findUserById(id: string): Promise<User | any> {
        try {
            return await this.userModel.find({
                _id: id,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async findUsersByIds(ids: string[] | User[]): Promise<User | any> {
        return await Promise.all(
            ids.map(async (userId) => {
                return await this.userModel.find({ _id: userId });
            }),
        );
    }

    async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
        try {
            dto.password = await this.hashPassword(dto.password);

            const user = await this.userModel.create({
                ...dto,
                password: dto.password,
                joindate: new Date(),
                role: await this.roleModel.find({
                    value: 'user',
                }),
                friends: [],
                chats: [],
            });

            return user;
        } catch (e) {
            throw new Error(e);
        }
    }

    async publicUser(phone: string): Promise<AuthUserResponse | any> {
        try {
            const user = await this.userModel.find(
                {
                    phone: phone,
                },
                { password: 0 },
            );
            const token = await this.tokenService.generateJwtToken(user);
            return { user, token };
        } catch (e) {
            throw new Error(e);
        }
    }

    async findRole(id: string): Promise<any> {
        return await this.roleModel.findById({ _id: id });
    }

    // Chat

    async pushChat(users: string[], chatId: string): Promise<any> {
        return await Promise.all(
            users.map(async (userId) => {
                return await this.userModel.updateOne(
                    { _id: userId },
                    { $push: { chats: chatId } },
                );
            }),
        );
    }

    async getChatsByUser(userId: string): Promise<any> {
        try {
            // return await this.userModel.find({ chat })
        } catch (error) {
            console.log(error);
        }
    }

    // User

    async getAllUsers(request: any): Promise<any> {
        try {
            const reqUser = request.user._id;
            const users = await this.userModel.find();

            return { users, reqUser };
        } catch (error) {
            console.log(error);
        }
    }

    async searchUsers(request: any, dto: { query: string }): Promise<any> {
        try {
            // const users = await this.userModel.find({ name: dto.query });
            const users = await this.userModel.find({
                name: { $regex: new RegExp(dto.query, 'i') },
            });

            return users;
        } catch (error) {
            console.log(error);
        }
    }
}
