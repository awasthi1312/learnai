import mongoose from "mongoose";

const connectmongo = (handler) => async (req, res) => {
    try {
        mongoose.set("strictQuery", false);

        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }
        console.log("connecting to database..");
        await mongoose.connect(process.env.MONGODB_URI);
        return handler(req, res);
    }
    catch (error) {
        console.log("error connecting to database..");
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export default connectmongo;