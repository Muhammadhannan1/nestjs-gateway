import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  @IsString()
  message: string;
}
