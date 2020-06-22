import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { Task } from "../../tasks/model/task.entity";

@Entity("users")
@Unique(["username"])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Task, task => task.user, {eager: true})
    tasks: Task[];
}