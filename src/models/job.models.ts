import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description: string;
    location: string;
    companyName: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
    salary?: number;
    skillsRequired: string[];
    postedBy: Types.ObjectId; 
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const jobSchema = new Schema<IJob>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        employmentType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship'],
            required: true,
        },
        salary: Number,
        skillsRequired: [{ type: String }],
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Company', 
            required: true,
        },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true, 
    }
);

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);