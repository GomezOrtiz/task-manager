import { ApiBearerAuth, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { HttpExceptionResponse } from './http-exception-response.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Unauthorized", type: HttpExceptionResponse })
@ApiBadRequestResponse({ description: "Bad Request", type: HttpExceptionResponse })
@ApiInternalServerErrorResponse({ description: "Internal Server Error", type: HttpExceptionResponse })
export class BaseApiController {

    constructor() {}
}