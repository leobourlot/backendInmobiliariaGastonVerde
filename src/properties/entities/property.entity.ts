import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { PropertyMedia } from './property-media.entity';

@Entity('properties')
export class Property {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column('text')
    description: string;

    @Column('simple-array', { default: 'sale' })
    transactionType: string[];

    @Column({ length: 100 })
    type: string; // Casa, Departamento, Terreno, Galpón

    // @Column('decimal', { precision: 12, scale: 2 })
    // price: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    salePrice?: number;

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    rentPrice?: number;

    @Column({ length: 255 })
    location: string;

    @Column({ type: 'int', default: 0 })
    bedrooms: number;

    @Column({ type: 'int', default: 0 })
    bathrooms: number;

    @Column('decimal', { precision: 10, scale: 2 })
    area: number;

    // @Column('json', { nullable: true })
    // features: string[];

    @Column({ default: true })
    isActive: boolean;

    // @Column({ default: false })
    // isFeatured: boolean;

    @OneToMany(() => PropertyMedia, (media) => media.property, {
        cascade: true,
        eager: true,
    })
    media: PropertyMedia[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}