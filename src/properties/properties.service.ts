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
        page?: number;
        limit?: number;
    }): Promise<{
        data: Property[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        // Configurar paginación con valores por defecto
        const page = filters?.page || 1;
        const limit = filters?.limit || 6;
        const skip = (page - 1) * limit;

        console.log('🔍 Filtros recibidos:', filters);
        console.log('📄 Paginación: page=', page, 'limit=', limit, 'skip=', skip);

        // Construir query base
        const query = this.propertyRepository
            .createQueryBuilder('property')
            .leftJoinAndSelect('property.media', 'media')
            .where('property.isActive = :isActive', { isActive: true })
            .orderBy('property.createdAt', 'DESC')
            .addOrderBy('media.order', 'ASC');

        // Aplicar filtros si existen
        if (filters?.transactionType && filters.transactionType !== 'all') {
            // Buscar en el array usando LIKE
            query.andWhere('property.transactionType LIKE :transactionType', {
                transactionType: `%${filters.transactionType}%`,
            });
        }

        if (filters?.type && filters.type !== 'all') {
            query.andWhere('property.type = :type', { type: filters.type });
        }

        if (filters?.minPrice) {
            query.andWhere(
                '(property.salePrice >= :minPrice OR property.rentPrice >= :minPrice)',
                { minPrice: filters.minPrice }
            );
        }

        if (filters?.maxPrice) {
            query.andWhere(
                '(property.salePrice <= :maxPrice OR property.rentPrice <= :maxPrice)',
                { maxPrice: filters.maxPrice }
            );
        }

        // Obtener el total de resultados (antes de paginar)
        const total = await query.getCount();
        console.log('📊 Total de propiedades encontradas:', total);

        // Aplicar paginación
        const data = await query
            .skip(skip)
            .take(limit)
            .getMany();

        console.log('✅ Propiedades devueltas:', data.length);

        const totalPages = Math.ceil(total / limit);

        // IMPORTANTE: Retornar el objeto completo con la estructura correcta
        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }

    async findOne(id: number): Promise<Property> {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['media'],
            order: {
                media: {
                    order: 'ASC',
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
        Object.assign(property, updatePropertyDto);
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