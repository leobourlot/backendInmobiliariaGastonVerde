import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
    ) { }

    async create(createContactDto: CreateContactDto): Promise<Contact> {
        const contact = this.contactRepository.create(createContactDto);
        return await this.contactRepository.save(contact);
    }

    async findAll(status?: string): Promise<Contact[]> {
        const query = this.contactRepository.createQueryBuilder('contact');

        if (status) {
            query.where('contact.status = :status', { status });
        }

        return await query.orderBy('contact.createdAt', 'DESC').getMany();
    }

    async updateStatus(id: number, status: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ where: { id } });
        contact.status = status;
        return await this.contactRepository.save(contact);
    }
}
