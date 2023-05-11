import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { userTable } from "../database/schemas/userSchema";
import { IUser } from "../database/Models/IUser";

export const getAuthUser = async( request:Request, response:Response):Promise<IUser | Boolean |any> =>{
try{

   return new Promise(async (resolve, reject)=>{
    const usrInfo:any = request.headers['user-info'];
    
    if(usrInfo && usrInfo.id){
        const mondoDbId = new mongoose.Types.ObjectId(usrInfo.id)
        const user = await userTable.findById(mondoDbId);
        if(!user){
            reject(false)
            return response.status(500).json({ msg: 'No user Found' });
        }
        resolve(user)
    }
   })
  
}catch(error:any){
    return response.status(500).json({ msg: "unable to get user" });
}
};
