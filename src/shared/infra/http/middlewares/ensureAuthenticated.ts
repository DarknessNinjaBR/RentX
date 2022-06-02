import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const authHeader = request.headers.authorization;

    if(!authHeader)
        throw new AppError("Token missing", 401);
        
    const [, token] = authHeader.split(" ");

    try{
        const { sub } = verify(token, "3cf1238d33b8c69d305e1a22429a6f34") as IPayload;

        const usersRepository = new UsersRepository();

        const user = await usersRepository.findById(sub);

        if(!user)
            throw new AppError("User does not exists", 401);

        request.user = {
            id: sub
        };

        return next();
    } catch {
        throw new AppError("Invalid token", 401);
    }
}