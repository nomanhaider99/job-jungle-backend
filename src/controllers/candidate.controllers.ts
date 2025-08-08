import { Candidate } from "../models/candidate.models";
import { compare, hash } from "bcryptjs";
import { errorResponse, successResponse } from "../utils/response";
import { Roles, StatusCode } from "../utils/variables";
import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { sign, verify } from 'jsonwebtoken';
import { Company } from "../models/company.models";

config();

export async function registerUser(data: { fullName: string, email: string, password: string }, next: NextFunction, res: Response) {
    try {
        const { fullName, email, password } = data;
        if (!data) {
            errorResponse(
                StatusCode.BAD_REQUEST,
                'Invalid Data!',
                next
            )
            return;
        }

        const userExistsinCandidate = await Candidate.findOne({ email });
        const userExistsinCompany = await Company.findOne({ email });
        if (userExistsinCandidate || userExistsinCompany) {
            errorResponse(
                StatusCode.FORBIDDEN,
                'User Already Exists!',
                next
            )
            return
        }

        const hashedPassword = await hash(password, 15);
        const user = await Candidate.create({
            fullName,
            email,
            password: hashedPassword
        });

        successResponse(
            StatusCode.OK,
            'User Created Successfully!',
            user,
            res
        )
        return;
    } catch (error) {
        errorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error as string,
            next
        )
        return;
    }
}

export async function loginUser(data: { email: string, password: string }, next: NextFunction, res: Response) {
    try {
        const { email, password } = data;
        if (!data) {
            errorResponse(
                StatusCode.BAD_REQUEST,
                'Invalid Data!',
                next
            )
            return;
        }

        const userExists = await Candidate.findOne({ email });
        const isUserExistsinCompany = await Company.findOne({ email });
        if (!userExists) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'User Does not Exists!',
                next
            )
            return
        } else if (isUserExistsinCompany) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Email used with diffrent User Type!',
                next
            )
            return
        }

        const isPasswordCorrect = await compare(password, userExists.password);

        if (!isPasswordCorrect) {
            errorResponse(
                StatusCode.UNAUTHORIZED,
                'Incorrect Email or Password',
                next
            )
            return;
        }

        const payload = {
            _id: userExists._id,
            email: userExists.email,
            profileImage: userExists.profileImage,
            fullName: userExists.fullName,
            role: Roles.CANDIDATE
        };

        const token = sign(payload, process.env.JWT_SECRET as string);

        res.cookie('token', token, {
            httpOnly: true,
            path: '/',
            sameSite: 'none',
            secure: true
        });

        successResponse(
            StatusCode.OK,
            'User LoggedIn Successfully!',
            token,
            res
        )
        return;
    } catch (error) {
        errorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error as string,
            next
        )
        return;
    }
}

export async function getMe(next: NextFunction, res: Response, req: Request) {
    try {
        const { token } = req.cookies;
        if (!token) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Token Not Found!',
                next
            )
            return;
        }

        const decodedToken = verify(token, process.env.JWT_SECRET as string);

        if (typeof decodedToken === "object") {
            const data = {
                _id: decodedToken._id,
                email: decodedToken.email,
                profileImage: decodedToken.profileImage,
                fullName: decodedToken.fullName,
                role: decodedToken.role
            }

            successResponse(
                StatusCode.OK,
                'LoggedIn User Found!',
                data,
                res
            )
            return;
        }
    } catch (error) {
        errorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error as string,
            next
        )
        return;
    }
}