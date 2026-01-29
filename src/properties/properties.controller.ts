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
    UseGuards, // ← NUEVO
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
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    create(@Body() createPropertyDto: CreatePropertyDto) {
        return this.propertiesService.create(createPropertyDto);
    }

    @Get()
    findAll(
        @Query('transactionType') transactionType?: string,
        @Query('type') type?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
    ) {
        return this.propertiesService.findAll({
            transactionType,
            type,
            minPrice,
            maxPrice,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePropertyDto: UpdatePropertyDto,
    ) {
        console.log('updatePropertyDto es: ', updatePropertyDto)
        return this.propertiesService.update(id, updatePropertyDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.remove(id);
    }

    @Post(':id/media')
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    @UseInterceptors(FilesInterceptor('files', 20, multerConfig))
    uploadMedia(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.propertiesService.addMedia(id, files);
    }

    @Delete('media/:mediaId')
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    removeMedia(@Param('mediaId', ParseIntPipe) mediaId: number) {
        return this.propertiesService.removeMedia(mediaId);
    }
}