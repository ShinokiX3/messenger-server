import {
    Body,
    Controller,
    Delete,
    Post,
    Get,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { AdminRoleGuard } from '../../guards/roles-guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // Users

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    getAllUsers(@Req() request): Promise<any> {
        return this.userService.getAllUsers(request);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/search')
    searchUsers(@Req() request, @Body() dto: { query: string }): Promise<any> {
        return this.userService.searchUsers(request, dto);
    }
}
