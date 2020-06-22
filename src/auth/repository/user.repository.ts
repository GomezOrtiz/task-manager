import { Repository, EntityRepository } from "typeorm";
import { User } from "../model/user.entity";
import { AuthCredentials } from "../rest/dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ErrorCode } from "../../shared/enums/error-code.enum";
import * as bcrypt from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signup(credentials: AuthCredentials): Promise<void> {

        const { username, password } = credentials;

        const user = this.create();
        user.username = username;
        user.password = await bcrypt.hash(password, 10);

        try {
            await user.save();
        } catch (error) {
            switch(error.code) {
                case (ErrorCode.DUPLICATED_KEY):
                    throw new ConflictException(`Username ${username} already exists`);
                default:
                    throw new InternalServerErrorException();
            }            
        }
    }

    async validatePassword(credentials: AuthCredentials): Promise<string> {

        const { username, password } = credentials;
        const user = await this.findOne({ username });

        return user && await bcrypt.compare(password, user.password) ? user.username : null;
    }
}