import mongoose from "mongoose";

export interface IProduct {
    name : string;
    user: mongoose.Types.ObjectId;
    imgUrl: string;
    categoryId: string;
    description: string;
    price: string;
    quantity: string;
    _id? : string;
    createdAt?: Date;
    updatedAt?: Date;
}