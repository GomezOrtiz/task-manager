import { MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentials {

    @MinLength(4, {message: "Password should be 4 or more characters long"})
    @MaxLength(20, {message: "Password should not be more than 20 characters long"})
    username: string;

    @MinLength(8, {message: "Password should be 8 or more characters long"})
    @MaxLength(20, {message: "Password should not be more than 20 characters long"})
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {message: "Password should have at least 1 lowercase letter, 1 uppercase letter and 1 number or special character"} 
    )    
    password: string;
}