import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFiles,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { multerConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createPropertyDto: CreatePropertyDto) {
        return this.propertiesService.create(createPropertyDto);
    }

    @Get()
    async findAll(
        @Query('transactionType') transactionType?: string,
        @Query('type') type?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        console.log('🌐 GET /properties - Query params:', {
            transactionType,
            type,
            minPrice,
            maxPrice,
            page,
            limit
        });

        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 6;

        console.log('🔢 Valores parseados:', {
            pageNumber,
            limitNumber
        });

        const result = await this.propertiesService.findAll({
            transactionType,
            type,
            minPrice,
            maxPrice,
            page: pageNumber,
            limit: limitNumber,
        });

        console.log('📤 Respuesta del servicio:', {
            totalPropiedades: result.data.length,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        });

        return result;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePropertyDto: UpdatePropertyDto,
    ) {
        return this.propertiesService.update(id, updatePropertyDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.remove(id);
    }

    @Post(':id/media')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 20, multerConfig))
    uploadMedia(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.propertiesService.addMedia(id, files);
    }

    @Delete('media/:mediaId')
    @UseGuards(JwtAuthGuard)
    removeMedia(@Param('mediaId', ParseIntPipe) mediaId: number) {
        return this.propertiesService.removeMedia(mediaId);
    }
}