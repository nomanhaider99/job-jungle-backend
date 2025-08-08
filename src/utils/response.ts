import { NextFunction, Response } from "express";
import createHttpError from "http-errors";

export const successResponse = (
    statusCode: number,
    message: string,
    data: unknown,
    res: Response
) => {
    res.status(statusCode).json(
        {
            message: message,
            data: data
        }
    )
}

export const errorResponse = (
    statusCode: number,
    message: string,
    next: NextFunction
) => {
    return next(createHttpError({message, statusCode}));
}