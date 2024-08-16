import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class loginRequestDTO{
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
    password: string;
}