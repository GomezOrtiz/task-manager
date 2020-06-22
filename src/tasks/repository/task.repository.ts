import { EntityRepository, Repository } from "typeorm";
import { Task } from "../model/task.entity";
import { TaskSearchCriteria } from "../rest/dto/task-search-criteria.dto";
import { User } from "../../auth/model/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async findByCriteria(criteria: TaskSearchCriteria, user: User): Promise<Task[]> {

        const { status, search } = criteria;

        const query = this.createQueryBuilder("task");
        query.select(["task.id", "task.title", "task.description", "task.status", "user.id", "user.username"])
        query.leftJoin("task.user", "user")
        query.where("user.id = :userId", { userId: user.id })
        if(status) query.andWhere("task.status = :status", { status });
        if(search) query.andWhere("(UPPER(task.title) LIKE :search OR UPPER(task.description) LIKE :search)", { search: `%${search.toUpperCase()}%` });

        return await query.getMany();
    }

}