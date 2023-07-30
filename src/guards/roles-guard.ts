/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const userRoleId = request?.user[0].role[0];
            const role = await this.usersService.findRole(userRoleId);

            return role.value === 'admin';
        }

        return false;
    }
}
