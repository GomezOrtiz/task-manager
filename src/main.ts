import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from "@nestjs/swagger";
import * as config from 'config';
import { swaggerOptions } from "./shared/config/swagger.config";
import { HttpExceptionsFilter } from './shared/rest/exceptions.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionsFilter());

  // CORS
  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'docker') app.enableCors();
  // SWAGGER
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, swaggerOptions));

  await app.listen(process.env.PORT || config.get('server.port'));
}
bootstrap();