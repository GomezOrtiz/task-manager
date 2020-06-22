import { ApiTags, ApiOperation, ApiNotFoundResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Body, Delete, Patch, Query, ValidationPipe, ParseIntPipe, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from '../service/tasks.service';
import { TaskStatus } from '../model/task-status.enum';
import { CreateTaskRequest } from './dto/create-task-request.dto';
import { TaskSearchCriteria } from './dto/task-search-criteria.dto';
import { TaskStatusValidator } from './validator/task-status-validator.pipe';
import { Task } from '../model/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../shared/decorators/get-user-decorator';
import { User } from '../../auth/model/user.entity';
import { BaseApiController } from '../../shared/rest/base.controller';
import { HttpExceptionResponse } from 'src/shared/rest/http-exception-response.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController extends BaseApiController {

    constructor(private readonly taskService: TasksService) { super() }

    @ApiOperation({ summary: "Find all taks or filtered by criteria (status, search term)" })
    @Get()
    getTasks(
        @Query(ValidationPipe) criteria: TaskSearchCriteria,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.taskService.findByCriteria(criteria, user);
    }

    @ApiOperation({ summary: "Find one task by ID" })
    @ApiNotFoundResponse({ description: "Not Found", type: HttpExceptionResponse })
    @Get("/:id")
    getOneTask(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.findById(id, user);
    }

    @ApiOperation({ summary: "Create a task" })
    @ApiBody({description: "Request object to create a task", type: CreateTaskRequest})
    @Post()
    createTask(
        @Body(ValidationPipe) request: CreateTaskRequest, 
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.create(request, user);
    }

    @ApiOperation({ summary: "Change a task status" })
    @ApiBody({description: "Target status", enum: TaskStatus})
    @ApiNotFoundResponse({ description: "Not Found", type: HttpExceptionResponse })
    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id", ParseIntPipe) id: number, 
        @Body("status", TaskStatusValidator) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.updateStatus(id, status, user);
    }

    @ApiOperation({ summary: "Delete a task by ID" })
    @ApiNotFoundResponse({ description: "Not Found", type: HttpExceptionResponse })
    @Delete("/:id")
    deleteTask(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskService.delete(id, user);
    }
}
