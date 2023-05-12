import mongoose from "mongoose";
import { ICategory } from "../Models/ICategory";


const categorySchema = new mongoose.Schema<ICategory>({
    name: {type: String, required: true, unique: true },
    user:{type: mongoose.Schema.Types.ObjectId, ref:"category", required:true},
}, {timestamps: true})


export const categoryTable = mongoose.model<ICategory>('category', categorySchema);