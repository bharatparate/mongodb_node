import mongoose from "mongoose";
export interface ICategory {
    name : string;
    _id? : string;
    user: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}