import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_media')
export class PropertyMedia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    url: string;

    @Column({
        type: 'enum',
        enum: ['image', 'video'],
        default: 'image',
    })
    type: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @ManyToOne(() => Property, (property) => property.media, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column()
    propertyId: number;
}