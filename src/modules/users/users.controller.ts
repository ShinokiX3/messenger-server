/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Post,
    Get,
    Patch,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { AdminRoleGuard } from '../../guards/roles-guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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

    // Edit Profile

    @UseGuards(JwtAuthGuard)
    @Post('profile/photo')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
    async sendWithPhotos(
        @UploadedFiles() files,
        @Body() dto: any,
    ): Promise<any> {
        const { picture } = files;
        const photo = await this.userService.setProfilePhoto(dto, picture);
        
        return photo;
    }
}
