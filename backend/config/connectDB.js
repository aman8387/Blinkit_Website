import mongoose from "mongoose";
import dotenv from 'dotenv';
import ProductModel from "../models/product.model.js"; 
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI in .env file");
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // ✅ Ensure text index is created
        await ProductModel.syncIndexes();
        console.log("ProductModel indexes synced");

    } catch (error) {
        console.log("MongoDB failed to connect:", error);
        process.exit(1);
    }
}

export default connectDB;
