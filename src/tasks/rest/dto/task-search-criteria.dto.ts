import { TaskStatus } from "../../model/task-status.enum";
import { IsOptional, IsEnum, IsNotEmpty } from "class-validator";

export class TaskSearchCriteria {

    @IsOptional()
    @IsEnum(TaskStatus, {message: "Status must be OPEN, IN_PROGRESS or DONE"})
    status?: TaskStatus;

    @IsOptional()
    @IsNotEmpty({message: "Search should not be empty"})
    search?: string;
}