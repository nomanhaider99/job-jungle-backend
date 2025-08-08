import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";
import { StatusCode } from "../utils/variables";

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.cookies;
        if (!token) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Token Not Found!',
                next
            )
            return
        }

        next();
    } catch (error: any) {
        errorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        )
        return
    }
}