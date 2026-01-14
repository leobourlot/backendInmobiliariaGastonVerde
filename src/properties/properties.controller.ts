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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { multerConfig } from '../config/multer.config';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) { }

    @Post()
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
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePropertyDto: UpdatePropertyDto,
    ) {
        return this.propertiesService.update(id, updatePropertyDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.propertiesService.remove(id);
    }

    @Post(':id/media')
    @UseInterceptors(FilesInterceptor('files', 20, multerConfig))
    uploadMedia(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.propertiesService.addMedia(id, files);
    }

    @Delete('media/:mediaId')
    removeMedia(@Param('mediaId', ParseIntPipe) mediaId: number) {
        return this.propertiesService.removeMedia(mediaId);
    }
}