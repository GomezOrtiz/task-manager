import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './rest/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import * as config from 'config';

const { expiresIn, secret } = config.get("jwt");

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt"
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || secret,
            signOptions: {
                expiresIn: expiresIn,
            }
        }),
        TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
