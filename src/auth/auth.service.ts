import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { username, email, password, fullName } = registerDto;

        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findOne({
            where: [{ username }, { email }],
        });

        if (existingUser) {
            throw new ConflictException('El usuario o email ya existe');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = this.userRepository.create({
            username,
            email,
            fullName,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        // Generar token
        const payload = { id: user.id, username: user.username };
        const token = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            },
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        // Buscar usuario
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token
        const payload = { id: user.id, username: user.username };
        const token = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            },
            token,
        };
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({
                where: { id: payload.id },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Token inválido');
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            };
        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }
    }

    async getAllUsers() {
        return await this.userRepository.find({
            select: ['id', 'username', 'email', 'fullName', 'isActive', 'createdAt'],
        });
    }
}