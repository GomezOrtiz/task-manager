import { JwtStrategy } from "./jwt.strategy";
import { Test } from "@nestjs/testing";
import { UserRepository } from "../repository/user.repository";
import { UnauthorizedException } from "@nestjs/common";

const PAYLOAD = { username: "Username"};

let found;

describe("JwtStrategy", () => {

    let jwtStrategy: JwtStrategy;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository, useFactory: userRepositoryMockFactory}
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    })

    it("should validate a user from a JWT payload", async () => {

        found = { username : PAYLOAD.username };
        
        expect(await jwtStrategy.validate(PAYLOAD)).toEqual(found);
    })

    it("should throw an exception if a user is not found", () => {

        found = null;

        expect(jwtStrategy.validate(PAYLOAD)).rejects.toThrow(UnauthorizedException);
    })
})

const userRepositoryMockFactory = () => ({
    findOne: jest.fn(conditions => {
        expect(conditions).toEqual(PAYLOAD);
        return found;
    })
})