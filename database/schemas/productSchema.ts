import mongoose from "mongoose";
import { IProduct } from "../Models/IProduct";


const productSchema = new mongoose.Schema<IProduct>({
    name: {type: String, required: true, unique: true },
    user:{type: mongoose.Schema.Types.ObjectId, ref:"products", required:true},
    imgUrl: {type: String, required: true},
    categoryId: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    quantity: {type: String, required: true}
}, {timestamps: true})


export const productTable = mongoose.model<IProduct>('products', productSchema)