import { Test } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { TaskRepository } from "../repository/task.repository";
import { TaskSearchCriteria } from "../rest/dto/task-search-criteria.dto";
import { TaskStatus } from "../model/task-status.enum";
import { NotFoundException } from "@nestjs/common";

const USER = { id: 101, username: "Username" };
const TASK = {id: 202, title: "Title", description: "Description", status: TaskStatus.OPEN, user: USER};

let found;

describe("TasksService", () => {

    let tasksService, taskRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide : TaskRepository, useFactory: taskRepositoryMockFactory}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    })

    describe("findByCriteria", () => {

        it("should find all tasks", async () => {

            const criteria: TaskSearchCriteria = {status: TaskStatus.OPEN, search: "title"};
            found = [TASK];

            const result = await tasksService.findByCriteria(criteria, USER);

            expect(taskRepository.findByCriteria).toHaveBeenCalledWith(criteria, USER);
            expect(result).toEqual(found);
        })
    })

    describe("findById", () => {

        it("should find an existing task", async () => {

            const expectedOptions = { where: {id: TASK.id, user: { id: USER.id } } };
            found = TASK

            const result = await tasksService.findById(TASK.id, USER);

            expect(taskRepository.findOne).toHaveBeenCalledWith(expectedOptions);
            expect(result).toEqual(found);
        })

        it("should throw an error if not found", async () => {

            const notFoundId = 303;

            expect(tasksService.findById(notFoundId, USER))
                .rejects.toThrowError(new NotFoundException(`Task with ID ${notFoundId} could not be found`));
        })
    })

    describe("create", () => {

        it("should create a task", async () => {

            const request = {title: "Title", description: "Description"};
            const expectedArg = {title: "Title", description: "Description", status: TaskStatus.OPEN, user: USER};
            const expectedResult = {id: TASK.id, title: "Title", description: "Description", status: TaskStatus.OPEN};

            const result = await tasksService.create(request, USER);

            expect(taskRepository.save).toHaveBeenCalledWith(expectedArg);
            expect(result).toEqual(expectedResult);
        })
    })

    describe("updateStatus", () => {

        it("should update a tasks' status", async () => {

            const expectedStatus = TaskStatus.IN_PROGRESS;
            const expected = {id: TASK.id, title: TASK.title, description: TASK.description, status: expectedStatus, user: TASK.user};
            found = TASK;

            const result = await tasksService.updateStatus(TASK.id, expectedStatus, USER);

            expect(taskRepository.save).toHaveBeenCalledWith(expected);
            expect(result).toEqual(expected);
        })
    })

    describe("delete", () => {

        it("should delete a tasks", async () => {

            const options = { id: TASK.id, user: { id: USER.id } };

            expect(tasksService.delete(TASK.id, USER)).resolves.not.toThrowError
            expect(taskRepository.delete).toHaveBeenCalledWith(options);
        })

        it("should throw an error if not deleted", async () => {

            const notFoundId = 303;
            const options = { id: notFoundId, user: { id: USER.id } };

            expect(tasksService.delete(notFoundId, USER))
                .rejects.toThrowError(new NotFoundException(`Task with ID ${notFoundId} could not be found`));
            expect(taskRepository.delete).toHaveBeenCalledWith(options);
        })
    })
})

const taskRepositoryMockFactory = () => ({
    findByCriteria: jest.fn((criteria, user) => {
        return found;
    }),
    findOne: jest.fn(options => {
        return options.where.id === TASK.id ? found : null;
    }),
    save: jest.fn(task => {
        const result = Object.assign({}, task);
        if(!result.id) result.id = TASK.id;
        return result;
    }),
    delete: jest.fn(options => {
        return options.id === TASK.id ? {affected: 1} : {affected: 0};
    })
});