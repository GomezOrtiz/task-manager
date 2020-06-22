import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../../model/task-status.enum";

export class TaskStatusValidator implements PipeTransform {

    transform(value: any) {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)) throw new BadRequestException(`${value} is an invalid status`);
        return value;
    }

    private isStatusValid(status: any): boolean {
        for (let value in TaskStatus) {
            if(value == status) return true;
        }
    }
}