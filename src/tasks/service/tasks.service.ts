import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from '../model/task-status.enum';
import { CreateTaskRequest } from '../rest/dto/create-task-request.dto';
import { TaskSearchCriteria } from '../rest/dto/task-search-criteria.dto';
import { TaskRepository } from '../repository/task.repository';
import { Task } from '../model/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/model/user.entity';

@Injectable()
export class TasksService {

    private logger = new Logger("TasksService");

    constructor(
        @InjectRepository(TaskRepository) 
        private taskRepository: TaskRepository
    ) {}

    async findById(id: number, user: User): Promise<Task> {

        let found;
        try {
            found = await this.taskRepository.findOne({ where: { id, user: { id: user.id } } });
        } catch (error) {
            this.logger.error(`Failed to find task with ID ${id} for user ${user.username} with ID ${user.id}`, error.stack);
            throw new InternalServerErrorException();
        }

        if(!found) {
            this.logger.debug(`Task with ID ${id} could not be found`);
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }

        return found;
    }

    async findByCriteria(criteria: TaskSearchCriteria, user: User): Promise<Task[]> {

        try {
            return this.taskRepository.findByCriteria(criteria, user);
        } catch(error) {
            this.logger.error(`Failed to get tasks for user ${user.username} with ID ${user.id}. Criteria: ${JSON.stringify(criteria)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async create(request : CreateTaskRequest, user: User): Promise<Task> {

        const { title, description } = request;

        try {
            const saved = await this.taskRepository.save(
                {title, description, status: TaskStatus.OPEN, user}
            );
            delete saved.user;

            return saved;
        } catch (error) {
            this.logger.error(`Failed to create task for user ${user.username} with ID ${user.id}. Request: ${request}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async updateStatus(id: number, status: TaskStatus, user: User): Promise<Task> {

        const found = await this.findById(id, user);
        found.status = status;

        try {
            return this.taskRepository.save(found);
        } catch (error) {
            this.logger.error(`Failed to update task ${id} for user ${user.username} with ID ${user.id}. Target status: ${status}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async delete(id: number, user: User): Promise<void> {

        let result;
        try {
            result = await this.taskRepository.delete({ id, user: { id: user.id } });
        } catch (error) {
            this.logger.error(`Failed to delete task ${id} for user ${user.username} with ID ${user.id}`, error.stack);
            throw new InternalServerErrorException();
        }

        if(!result.affected) {
            this.logger.debug(`Task with ID ${id} could not be found`);
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }
    }
}