import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerOptions = new DocumentBuilder()
.setTitle("Task Manager")
.setDescription('An API to manage tasks')
.setVersion('1.0')
.addTag('tasks', 'Endpoints to find, create, update and delete tasks')
.addTag('auth', 'Endpoints to register (signup) and login (signin)')
.addBearerAuth()
.build();