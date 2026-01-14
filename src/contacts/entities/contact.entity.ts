import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 50 })
    phone: string;

    @Column('text', { nullable: true })
    message: string;

    @Column({ length: 100, nullable: true })
    serviceType: string; // sell, rent, invest

    @Column({ type: 'int', nullable: true })
    propertyId: number;

    @Column({
        type: 'enum',
        enum: ['pending', 'contacted', 'closed'],
        default: 'pending',
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}