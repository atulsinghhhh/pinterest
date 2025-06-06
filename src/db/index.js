import mongoose from "mongoose";

export async function dbConnect(){
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`DB connection successfully || DB host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed: ",error);
        process.exit(1);
    }
}