import { IsString, IsEmail, IsNumber } from "class-validator";

export class UserDTO{

    // valid name
    @IsString()
    name: string;
    // valid email
    @IsEmail()
    email: string;
    // valid password
    @IsString()
    password: string;
}