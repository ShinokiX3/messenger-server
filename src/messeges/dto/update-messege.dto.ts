import { PartialType } from '@nestjs/mapped-types';
import { CreateMessegeDto } from './create-messege.dto';

export class UpdateMessegeDto extends PartialType(CreateMessegeDto) {
  id: number;
}
