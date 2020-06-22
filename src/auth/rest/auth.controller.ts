import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';

@ApiTags('auth')
@ApiBadRequestResponse({ description: "Bad Request" })
@ApiInternalServerErrorResponse({ description: "Internal Server Error" })
@Controller("auth")
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "Register a new user" })
    @Post("/signup")
    signup(@Body(ValidationPipe) credentials: AuthCredentials): Promise<void> {
        return this.authService.signup(credentials);
    }

    @ApiOperation({ summary: "Get auth token for a registered user" })
    @ApiResponse({ status: 201, description: 'Access token to authenticate in securized endpoints' })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @Post("/signin")
    signin(@Body(ValidationPipe) credentials: AuthCredentials): Promise<{accessToken: string}> {
        return this.authService.signin(credentials);
    }
}
