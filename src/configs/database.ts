import mongoose from "mongoose";

export async function connectMongoDBDatabase () {
    await mongoose.connect(process.env.DATABASE_URI as string)
    .then(() => {
        console.log('MongoDB Connected Successfully!');
    })
    .catch((err) => {
        console.log(`Error COnnecting MongoDB: ${err}`);
    });
}