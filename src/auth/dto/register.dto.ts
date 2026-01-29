import {
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    fullName: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    })
    password: string;
}
