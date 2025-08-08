import { Candidate } from "../models/candidate.models";
import { compare, hash } from "bcryptjs";
import { errorResponse, successResponse } from "../utils/response";
import { Roles, StatusCode } from "../utils/variables";
import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { sign, verify } from 'jsonwebtoken';
import { Company } from "../models/company.models";

config();

export async function registerCompany (data: {companyName: string, email: string, password: string}, next: NextFunction, res: Response) {
    try {
        const { companyName, email, password } = data;
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
        const company = await Company.create({
            companyName,
            email,
            password: hashedPassword
        });

        successResponse(
            StatusCode.OK,
            'Company Created Successfully!',
            company,
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

export async function loginCompany (data: {email: string, password: string}, next: NextFunction, res: Response) {
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

        const companyExists = await Company.findOne({ email });
        const isCompanyExistsinCandidate = await Candidate.findOne({ email });
        if (!companyExists) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Company Does not Exists!',
                next
            )
            return
        } else if (isCompanyExistsinCandidate) {
            errorResponse(
                StatusCode.FORBIDDEN,
                'Email used with diffrent User Type!',
                next
            )
            return
        }

        const isPasswordCorrect = await compare(password, companyExists.password);
        
        if (!isPasswordCorrect) {
            errorResponse(
                StatusCode.UNAUTHORIZED,
                'Incorrect Email or Password',
                next
            )
            return;
        }

        const payload = {
            _id: companyExists._id,
            email: companyExists.email,
            logoUrl: companyExists.logoUrl,
            companyName: companyExists.companyName,
            role: Roles.COMPANY
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
            'Company LoggedIn Successfully!',
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

export async function getLoggedInCompany (next: NextFunction, res: Response, req: Request) {
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
                logoUrl: decodedToken.logoUrl,
                companyName: decodedToken.companyName,
                role: decodedToken.role
            }

            successResponse(
                StatusCode.OK,
                'LoggedIn Company Found!',
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