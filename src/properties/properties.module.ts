import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { PropertyMedia } from './entities/property-media.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Property, PropertyMedia]),
        AuthModule,
    ],
    controllers: [PropertiesController],
    providers: [PropertiesService],
    exports: [PropertiesService],
})
export class PropertiesModule { }