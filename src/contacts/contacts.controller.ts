import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    ParseIntPipe,
    UseGuards, // ← NUEVO
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ← NUEVO

@Controller('contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
        private readonly emailService: EmailService,
    ) { }

    @Post()
    async create(@Body() createContactDto: CreateContactDto) {
        const contact = await this.contactsService.create(createContactDto);
        // Enviar email al recibir el contacto
        await this.emailService.sendContactEmail(createContactDto);
        return contact;
    }

    @Get()
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    findAll(@Query('status') status?: string) {
        return this.contactsService.findAll(status);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard) // ← PROTEGIDO
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.contactsService.updateStatus(id, status);
    }
}