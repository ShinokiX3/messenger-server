/* eslint-disable prettier/prettier */
export class CreateUserDTO {
    readonly name: string;
    readonly uniqName: string;
    readonly email: string;
    password: string;
    readonly phone: string;
    readonly birthdate: Date;
    _id?: string;
}
