
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export const authMiddleware = async(request:Request, response:Response, next:NextFunction) =>{

    try{
        // Read the Token from header
        const token:any = request.headers['x-auth-token'];
        
        if(!token){
            return response.status(401).json({
                msg: "No Token Provided",
              });
        }

        const secretKey: any = process.env.JWT_SECRET_KEY;

        // decode the token
        const decode:any = jwt.verify(token, secretKey, {
            algorithms:['HS256']
        })

        if(!decode){
            return response.status(401).json({
                msg: "Invalid Token",
              });
        }

        const{user} = decode;
        request.headers['user-info'] = user;

        next(); // must for middlewares

    }catch(error:any){
       
            return response.status(500).json({ msg: "Token verification Failed" });
       
    }
   
}