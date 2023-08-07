/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
    public socket: Server = null;
}
