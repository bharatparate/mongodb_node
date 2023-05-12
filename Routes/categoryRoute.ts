import express, {Request, Response, Router } from "express";
import { body } from "express-validator";
import * as categoryController from "../Controller/categoryController"
import { authMiddleware } from "../Middleware/authmiddleware";

const categoryRouter:Router = Router();
//Get Data
categoryRouter.get("/", authMiddleware, async (request: Request, response: Response) => {
  return await categoryController.getAllCategory(request, response)
  });

  categoryRouter.get("/:categoryId", authMiddleware, async (request: Request, response: Response) => {
    return await categoryController.getCategory(request, response)
    });


categoryRouter.post("/add", authMiddleware, [body('name').isLength({min:4, max:8}).withMessage('name is required')
], async (request: Request, response: Response) => {
    return await categoryController.createCategory(request, response)
  });
 

export default categoryRouter;
