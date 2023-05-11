import express, { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { userTable } from "../database/schemas/userSchema";
import { IUser } from "../database/Models/IUser";
import bcryptjs from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {getAuthUser} from '../util/getAuthUser'

export interface UserTokerPayload {
  id: string | undefined;
  email: string;
}

//{name, imgUrl, category, description, price, quantity }

// Create Product
export const createUser = async (request: Request, response: Response) => {
  try {

  //  Validations
    const result = await validationResult(request);
    if (!result.isEmpty()) {
      return response.status(401).json({ errors: result.array() });
    }

    //Get Data  from
    const { username, password, email } = request.body;

    // check in email exsits
    const user:IUser | undefined | null= await userTable.findOne({$or: [{email: email}, {username: username}]});


    if (user) {
      return response.status(401).json({
        msg: "User with username or Email is already exists",
      });
    }

    //  encrypt Password
    const salt = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password, salt);

    // Get Image
    const imgUrl: string = gravatar.url(email, {
      size: "200",
      rating: "pg",
      default: "mm",
    });

    const newUser: IUser = {
      username: username,
      password: hashPass,
      email: email,
      imgUrl: imgUrl,
      isAdmin: false,
      isSuperAdmin: false,
    };

    const createdUser = await new userTable(newUser).save();
    
    if (createdUser) {
      return response.status(201).json({
        msg: "Registration is Successful",
        user: createdUser,
      });
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Login User
export const loginUser = async (request: Request, response: Response) => {
  try {
    const result = await validationResult(request);
    if (!result.isEmpty()) {
      return response.status(401).json({ errors: result.array() });
    }

    const { password, email } = request.body;

    // check in email exsits
    const user: IUser | undefined | null = await userTable.findOne({
      email: email,
    });
    if (!user) {
      return response.status(401).json({
        msg: "User Dose not Exsists with Email",
      });
    }

    //Check/Compare Password
    const isMatch: boolean = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({
        msg: "Invalid Password",
      });
    }

    // JWT Token implimentation 

    // secretKey will be any from .env
    const secretKey: string | undefined = process.env.JWT_SECRET_KEY;

    // Payload Will be Data which need for login
    const payload: { user: UserTokerPayload } = {
      user: {
        id: user._id,
        email: user.email,
      },
    };


    if (secretKey) {
      jwt.sign(
        payload,
        secretKey,
        {
          algorithm: "HS256",
          expiresIn: 1000000000000000,
        },
        (error, encoded) => {
          if (error) {
            return response.status(401).json({
              msg: "unable to generate the token",
            });
          }
          if (encoded) {
            return response.status(200).json({
              msg: "login is Success",
              token: encoded,
              user: user,
            });
          }
        }
      );
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};




// Me //////////////////////
// Private

export const getUsrInfo = async (request: Request, response: Response) => {
   try{
    const user = await getAuthUser(request, response);
     return response.status(200).json(user) 
        
    }
   catch(error:any){
    return response.status(500).json({ errors: [error.message] });
   }


  };


