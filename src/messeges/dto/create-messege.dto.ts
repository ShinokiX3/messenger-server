import { Messege } from '../entities/messege.entity';

export class CreateMessegeDto extends Messege {
    userId: string;
    message: string;
    room: string;
}
