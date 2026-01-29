import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'tu-secreto-super-seguro',
        });

    }

    async validate(payload: any) {
        
        const { id } = payload;
        const user = await this.userRepository.findOne({ where: { id } });
        
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Usuario no autorizado');
        }

        return user;
    }
}