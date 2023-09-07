import mongoose from "mongoose";
// import PostureSchema from "../models/PostureSchema";
import Pose  from "../models/PostureSchema";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }
        console.log("MongoDB connected successfully");

        // let Posture = mongoose.model('dbPosture', PostureSchema);
        let Posture = Pose;

        const query = Posture.find().where({ name: "Archer" });

        console.log('query', query);

        // const dbPosture = new Posture();
    // await Posture.find({name: "Archer"}).then((result) => console.log("find results", result))
        // await PostureSchema.create({})

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
 };

export default connectDB;