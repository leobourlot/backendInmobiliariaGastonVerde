import {
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    IsEnum,
    IsNumber,
} from 'class-validator';

export class CreateContactDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    phone: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsEnum(['sell', 'rent', 'invest'])
    @IsOptional()
    serviceType?: string;

    @IsNumber()
    @IsOptional()
    propertyId?: number;
}