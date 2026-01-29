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
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ← NUEVO

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    create(@Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(createContactDto);
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