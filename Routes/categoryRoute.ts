import express, {Request, Response, Router } from "express";
import { body } from "express-validator";
import * as categoryController from "../Controller/categoryController"

const categoryRouter:Router = Router();
//Get Data
categoryRouter.get("/", async (request: Request, response: Response) => {
  return await categoryController.getAllCategory(request, response)
  });

  categoryRouter.get("/:categoryId", async (request: Request, response: Response) => {
    return await categoryController.getCategory(request, response)
    });


categoryRouter.post("/add", [body('name').isLength({min:4, max:8}).withMessage('name is required')
], async (request: Request, response: Response) => {
    return await categoryController.createCategory(request, response)
  });
 

export default categoryRouter;
