import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { HttpExceptionResponse } from './http-exception-response.dto';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {

    private logger = new Logger("HttpExceptionsFilter");
  
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const { url, method, query, body, user } = request;

        switch(exception.getStatus()) {
            case(HttpStatus.BAD_REQUEST):
                this.logger.debug(`Validation error when user with ID ${user.id} and username ${user.username} tried to call ${url} with method ${method}. Query: ${JSON.stringify(query)}. Body: ${JSON.stringify(body)}. Error: ${exception.message}`)
            break;       
            case(HttpStatus.INTERNAL_SERVER_ERROR):
                this.logger.error(`Uncontrolled error when user with ID ${user.id} and username ${user.username} tried to call ${url} with method ${method}. Query: ${JSON.stringify(query)}. Body: ${JSON.stringify(body)}.`, exception.stack)
            break;
        }

        response
            .status(exception.getStatus())
            .json(buildExceptionResponse(url, method, exception));
    }
}

const buildExceptionResponse = (
    url: string, 
    method: string, 
    exception: HttpException
): HttpExceptionResponse => {

    const exceptionResponse = <HttpExceptionResponse>exception.getResponse();
    exceptionResponse.timestamp = new Date().toISOString();
    exceptionResponse.path = url;
    exceptionResponse.method = method;

    return exceptionResponse;
}