import { Module } from '@nestjs/common';
import { TasksController } from './rest/tasks.controller';
import { TasksService } from './service/tasks.service';
import { TaskRepository } from './repository/task.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskRepository]),
        AuthModule
    ],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule {}