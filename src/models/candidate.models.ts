import mongoose, { Schema } from "mongoose";

const candidateSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
    },
    appliedJobs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
