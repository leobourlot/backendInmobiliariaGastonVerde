import {
    IsString,
    IsEnum,
    IsNumber,
    IsArray,
    IsBoolean,
    IsOptional,
    MinLength,
    Min,
} from 'class-validator';

export class CreatePropertyDto {
    @IsString()
    @MinLength(5)
    title: string;

    @IsString()
    @MinLength(20)
    description: string;

    @IsEnum(['sale', 'rent'])
    transactionType: string;

    @IsString()
    type: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    location: string;

    @IsNumber()
    @Min(0)
    bedrooms: number;

    @IsNumber()
    @Min(0)
    bathrooms: number;

    @IsNumber()
    @Min(0)
    area: number;

    @IsArray()
    @IsOptional()
    features?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}
