import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentials } from '../rest/dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class AuthService {

    private logger = new Logger("AuthService");

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signup(credentials: AuthCredentials): Promise<void> {

        try {
            return this.userRepository.signup(credentials);
        } catch (error) {
            this.logger.error(`Failed to create user ${credentials.username}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async signin(credentials: AuthCredentials): Promise<{accessToken: string}> {

        try {
            const username = await this.userRepository.validatePassword(credentials);
            if(!username) {
                this.logger.debug(`Invalid credentials: User ${credentials.username} failed to signup`);
                throw new UnauthorizedException("Invalid credentials");
            } 

            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } catch (error) {
            this.logger.error(`Failed to create access token for user ${credentials.username}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

}
