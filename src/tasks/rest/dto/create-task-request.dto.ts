import { IsNotEmpty } from "class-validator";

export class CreateTaskRequest {
    
    @IsNotEmpty({message: "Title should not be empty"})
    title: string;

    @IsNotEmpty({message: "Description should not be empty"})
    description: string;
}