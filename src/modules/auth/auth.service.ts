import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { AppError } from '../../common/constants/errors';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';
import * as bcrypt from 'bcrypt';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly chatService: ChatService,
    ) {}

    async registerUsers(dto: CreateUserDTO): Promise<AuthUserResponse | any> {
        try {
            const user = await this.userService.findUserByPhone(dto.phone);

            if (user.length > 0)
                throw new BadRequestException(AppError.USER_EXIST);

            const response = await this.userService.createUser(dto);

            const chat = await this.chatService.createChat([response], {
                revieving: response._id,
            });

            return this.userService.publicUser(dto.phone);
        } catch (e) {
            throw new BadRequestException('error');
        }
    }

    async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
        try {
            const user = await this.userService.findUserByPhone(dto.phone);

            if (user?.length < 1)
                throw new BadRequestException(AppError.USER_NOT_EXIST);
            const validatePassword = await bcrypt.compare(
                dto.password,
                user[0].password,
            );

            if (!validatePassword)
                throw new BadRequestException(AppError.WRONG_DATA);
            return this.userService.publicUser(dto.phone);
        } catch (e) {
            throw new Error(e);
        }
    }

    async loginAdmin(dto: UserLoginDTO): Promise<AuthUserResponse> {
        try {
            const user = await this.userService.findUserByEmail(dto.phone);

            if (user.length < 1)
                throw new BadRequestException(AppError.USER_NOT_EXIST);
            const validatePassword = await bcrypt.compare(
                dto.password,
                user[0].password,
            );

            if (!validatePassword)
                throw new BadRequestException(AppError.WRONG_DATA);

            const role = await this.userService.findRole(user[0].role[0]);

            if (role.value !== 'admin')
                throw new BadRequestException(AppError.PERMISSION_ERROR);

            return this.userService.publicUser(dto.phone);
        } catch (e) {
            throw new Error(e);
        }
    }

    async checkPhone(dto: { phone: string }): Promise<any> {
        try {
            const user = await this.userService.findUserByPhone(dto.phone);
            if (user.length < 1)
                throw new BadRequestException(AppError.USER_NOT_EXIST);
            else return { statusCode: 200 };
        } catch (e) {
            throw new Error(e);
        }
    }

    async check(dto: any): Promise<any> {
        try {
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    async test() {
        return 'hello world';
    }
}
