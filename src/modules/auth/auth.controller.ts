import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { AdminRoleGuard } from 'src/guards/roles-guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    @Post('register')
    register(@Body() dto: CreateUserDTO): Promise<AuthUserResponse> {
        return this.authService.registerUsers(dto);
    }

    @Post('login')
    login(
        @Body() dto: UserLoginDTO,
    ): Promise<AuthUserResponse | BadRequestException> {
        return this.authService.loginUser(dto);
    }

    @Post('admin-login')
    adminLogin(
        @Body() dto: UserLoginDTO,
    ): Promise<AuthUserResponse | BadRequestException> {
        return this.authService.loginAdmin(dto);
    }

    @Post('check-phone')
    checkPhone(@Body() dto: { phone: string }): Promise<any> {
        return this.authService.checkPhone(dto);
    }

    @UseGuards(AdminRoleGuard)
    @UseGuards(JwtAuthGuard)
    @Post('check')
    check(@Body() dto: any): Promise<any> {
        return this.authService.check(dto);
    }

    @Get('login')
    test() {
        return 'hello worldd';
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-public-user-info')
    getPublicUserInfo(@Req() request) {
        const user = request.user;
        return this.userService.publicUser(user.email);
    }
}
