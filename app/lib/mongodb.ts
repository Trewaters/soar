import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("MongoDB Connected");
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
 };

export default connectDB;