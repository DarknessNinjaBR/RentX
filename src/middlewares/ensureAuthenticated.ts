import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
    userId: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const authHeader = request.headers.authorization;

    if(!authHeader)
        throw new Error("Token missing");
        
    const [, token] = authHeader.split(" ");

    try{
        const { userId } = verify(token, "3cf1238d33b8c69d305e1a22429a6f34") as IPayload;

        const usersRepository = new UsersRepository();

        const user = await usersRepository.findById(userId)

        if(!user)
            throw new Error("User does not exists");

        next();
    } catch {
        throw new Error("Invalid token");
    }
}