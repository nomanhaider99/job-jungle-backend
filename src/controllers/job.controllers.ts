import { errorResponse, successResponse } from "../utils/response";
import { StatusCode } from "../utils/variables";
import { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { Job } from "../models/job.models";

config();

export async function createJob(data: { title: string, description: string, location: string, employmentType: string, salary: number, skillsRequired: string[], postedBy: string, isActive: boolean }, next: NextFunction, res: Response) {
    try {
        const { title, description, location, employmentType, isActive, postedBy, salary, skillsRequired } = data;
        if (!data) {
            errorResponse(
                StatusCode.BAD_REQUEST,
                'Invalid Data!',
                next
            )
            return;
        }

        const job = await Job.create(
            {
                title,
                description,
                location,
                employmentType,
                isActive,
                postedBy, 
                salary,
                skillsRequired
            }
        )

        
        successResponse(
            StatusCode.OK,
            'Job Created Successfully!',
            job,
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

export async function getJobListings(next: NextFunction, res: Response) {
    try {
        const jobs = await Job.find();
        if (!jobs.length) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Jobs Not Found!',
                next
            )
            return
        }

        successResponse(
            StatusCode.OK,
            'Jobs Found Successfully!',
            jobs,
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

export async function getJobById(data: { id: string }, next: NextFunction, res: Response, req: Request) {
    try {
        const { id } = data;
        if (!id) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Id Not Found!',
                next
            )
            return;
        }

        const job = await Job.findById(id);

        successResponse(
            StatusCode.OK,
            'Job Found!',
            job,
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

export async function deleteJob(data: { id: string }, next: NextFunction, res: Response, req: Request) {
    try {
        const { id } = data;
        if (!id) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Id Not Found!',
                next
            )
            return;
        }

        const job = await Job.findByIdAndDelete(id);

        if (!job) {
            errorResponse(
                StatusCode.NOT_FOUND,
                'Job Not Found!',
                next
            )
            return;
        }

        successResponse(
            StatusCode.OK,
            'Job Deleted!',
            job,
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