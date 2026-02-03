import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyMedia } from './entities/property-media.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
        @InjectRepository(PropertyMedia)
        private mediaRepository: Repository<PropertyMedia>,
    ) { }

    async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
        const property = this.propertyRepository.create(createPropertyDto);
        return await this.propertyRepository.save(property);
    }

    async findAll(filters?: {
        transactionType?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<Property[]> {
        const query = this.propertyRepository
            .createQueryBuilder('property')
            .leftJoinAndSelect('property.media', 'media') // IMPORTANTE: Cargar la relación media
            .where('property.isActive = :isActive', { isActive: true })
            .orderBy('media.order', 'ASC'); // Ordenar media por orden

        if (filters?.transactionType && filters.transactionType !== 'all') {
            query.andWhere('property.transactionType = :transactionType', {
                transactionType: filters.transactionType,
            });
        }

        if (filters?.type && filters.type !== 'all') {
            query.andWhere('property.type = :type', { type: filters.type });
        }

        if (filters?.minPrice) {
            query.andWhere('property.price >= :minPrice', {
                minPrice: filters.minPrice,
            });
        }

        if (filters?.maxPrice) {
            query.andWhere('property.price <= :maxPrice', {
                maxPrice: filters.maxPrice,
            });
        }
        
        return await query.orderBy('property.createdAt', 'DESC').getMany();
    }
    
    async findAllInactives(filters?: {
        transactionType?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<Property[]> {
        const query = this.propertyRepository
            .createQueryBuilder('property')
            .leftJoinAndSelect('property.media', 'media') // IMPORTANTE: Cargar la relación media
            .where('property.isActive = :isActive', { isActive: false })
            .orderBy('media.order', 'ASC'); // Ordenar media por orden

        if (filters?.transactionType && filters.transactionType !== 'all') {
            query.andWhere('property.transactionType = :transactionType', {
                transactionType: filters.transactionType,
            });
        }

        if (filters?.type && filters.type !== 'all') {
            query.andWhere('property.type = :type', { type: filters.type });
        }

        if (filters?.minPrice) {
            query.andWhere('property.price >= :minPrice', {
                minPrice: filters.minPrice,
            });
        }

        if (filters?.maxPrice) {
            query.andWhere('property.price <= :maxPrice', {
                maxPrice: filters.maxPrice,
            });
        }
        
        return await query.orderBy('property.createdAt', 'DESC').getMany();
    }

    async findOne(id: number): Promise<Property> {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['media'], // IMPORTANTE: Cargar la relación media
            order: {
                media: {
                    order: 'ASC', // Ordenar media por orden
                },
            },
        });

        if (!property) {
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
        }

        return property;
    }

    async update(
        id: number,
        updatePropertyDto: UpdatePropertyDto,
    ): Promise<Property> {
        const property = await this.findOne(id);
        console.log('propiedad antes de object es: ', property)
        Object.assign(property, updatePropertyDto);
        console.log('Propiedad actualizada es: ', property);
        return await this.propertyRepository.save(property);
    }

    async remove(id: number): Promise<void> {
        const property = await this.findOne(id);
        await this.propertyRepository.remove(property);
    }

    async addMedia(
        propertyId: number,
        files: Express.Multer.File[],
    ): Promise<PropertyMedia[]> {
        const property = await this.findOne(propertyId);

        // Obtener el orden máximo actual
        const existingMedia = await this.mediaRepository.find({
            where: { propertyId },
            order: { order: 'DESC' },
            take: 1,
        });

        const startOrder = existingMedia.length > 0 ? existingMedia[0].order + 1 : 0;

        const mediaEntities = files.map((file, index) => {
            const media = new PropertyMedia();
            media.property = property;
            media.url = `/uploads/properties/${file.filename}`;
            media.type = file.mimetype.startsWith('video') ? 'video' : 'image';
            media.order = startOrder + index;
            return media;
        });

        return await this.mediaRepository.save(mediaEntities);
    }

    async removeMedia(mediaId: number): Promise<void> {
        const media = await this.mediaRepository.findOne({
            where: { id: mediaId },
        });
        if (!media) {
            throw new NotFoundException(`Media con ID ${mediaId} no encontrado`);
        }
        await this.mediaRepository.remove(media);
    }
}