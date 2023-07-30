/* eslint-disable prettier/prettier */
class UserResponse {
    name: string;
    email: string;
}

export class AuthUserResponse {
    user: UserResponse;
    token: string;
}
