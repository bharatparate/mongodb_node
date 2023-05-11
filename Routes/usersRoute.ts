import express, {Request, Response, Router } from "express";
import {body} from 'express-validator';
const userRouter:Router = Router();
import * as userController from "../Controller/userController"
import { authMiddleware } from "../Middleware/authmiddleware";


// Register User /////////////////////////////////////////////////////////////

// {username, password, email}
userRouter.post("/register",[body('username').not().isEmpty().isLength({ min: 5, max:25}).withMessage('username is required'),
body('email').isEmail().withMessage('Proper Email is required'),
body('password').isStrongPassword().withMessage('AddStrong password')]
, async (request: Request, response: Response) => {
  return await userController.createUser(request, response)
});


// Login User ///////////////////////////////////////////////////////////////////

// {password, email}
userRouter.post("/login",[body('email').isEmail().withMessage('Proper Email is required'),
body('password').isStrongPassword().withMessage('Add Strong password'),

], async (request: Request, response: Response) => {
  return await userController.loginUser(request, response)
});


// Me ///////////////////////////////////////////////////////////////////


userRouter.get("/me", authMiddleware, async (request: Request, response: Response) => {
  return await userController.getUsrInfo(request, response)
});


export default userRouter;

