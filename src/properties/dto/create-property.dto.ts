import {
    IsString,
    IsEnum,
    IsNumber,
    IsArray,
    IsBoolean,
    IsOptional,
    MinLength,
    Min,
    ValidateIf,
} from 'class-validator';

export class CreatePropertyDto {
    @IsString()
    @MinLength(5)
    title: string;

    @IsString()
    @MinLength(20)
    description: string;

    @IsArray()
    @IsEnum(['sale', 'rent'], { each: true })
    transactionType: string[];

    @IsString()
    type: string;

    @ValidateIf((o) => o.transactionType.includes('sale'))
    @IsNumber()
    @Min(0)
    salePrice?: number;
    
    @ValidateIf((o) => o.transactionType.includes('rent'))
    @IsNumber()
    @Min(0)
    rentPrice?: number;

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

    // @IsArray()
    // @IsOptional()
    // features?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    // @IsBoolean()
    // @IsOptional()
    // isFeatured?: boolean;
}
