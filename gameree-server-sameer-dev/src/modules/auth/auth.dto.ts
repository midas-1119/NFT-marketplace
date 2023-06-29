import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(7)
    password: string;
}


export class LoginDto {
    @IsNotEmpty()
    identifier: string;
    
    @IsNotEmpty()
    password: string;
}

export class MetamaskLoginDto {
    @IsNotEmpty()
    identifier: string;
}
export class verifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    pin: number;
}
export class resetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    pin: number;

    @IsNotEmpty()
    @MinLength(7)
    password: string;
}

export class forgetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
export class validateEmailUsernameDto {
    @IsString()
    identifier: string;
}