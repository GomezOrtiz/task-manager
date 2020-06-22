import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcryptjs";
import { ConflictException } from "@nestjs/common";
import { ErrorCode } from "../../shared/enums/error-code.enum";

let savedUser;

describe("UserRepository", () => {

    let userRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    })

    describe("signup", () => {

        beforeAll(() => {
            userRepository.create = jest.fn().mockReturnValue(new UserMock());
        })

        it("should signup a user with valid credentials", async () => {

            const credentials = { username: "Username", password: "P4ssw0rd" }

            await expect(userRepository.signup(credentials)).resolves.not.toThrow();
            expect(savedUser.username).toEqual(credentials.username);
            expect(bcrypt.compare(credentials.password, savedUser.password)).toBeTruthy();
        })

        it("should throw an exception if the username already exists", () => {

            const credentials = { username: "Existing", password: "P4ssw0rd" }

            expect(userRepository.signup(credentials)).rejects.toThrowError(new ConflictException(`Username ${credentials.username} already exists`));
        })
    })

    describe("validatePassword", () => {

        beforeAll(() => {
            userRepository.findOne = jest.fn().mockResolvedValue({ username: "Username", password: "$2a$10$U4zhhPNnv6gB2Fuk.EojMeNqqugkcTsJjrXdzbVvmJijurRHDmdRm" });
        })

        it("should validate a right password", async () => {

            const credentials = { username: "Username", password: "P4ssw0rd" }

            const result = await userRepository.validatePassword(credentials);
            expect(result).toEqual(credentials.username);
        })

        it("should not validate a wrong password", async () => {

            const credentials = { username: "Username", password: "wrong" }

            const result = await userRepository.validatePassword(credentials);
            expect(result).toBeNull();
        })

        it("should return null if a user cannot be found", async () => {

            const credentials = { username: "NonExisting", password: "P4ssw0rd" }
            userRepository.findOne = jest.fn().mockResolvedValue(null);

            const result = await userRepository.validatePassword(credentials);
            expect(result).toBeNull();
        })
    })
})

class UserMock {
    username: String = "";
    password: String = "";
    save() {
        savedUser = { username: this.username, password: this.password }
        return new Promise((resolve, reject) => {
            if(this.username === "Existing") reject({ code: ErrorCode.DUPLICATED_KEY });
            resolve(savedUser)
        })
    }
}