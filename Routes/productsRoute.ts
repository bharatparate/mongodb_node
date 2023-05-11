import express, {Request, Response, Router } from "express";
import {body} from 'express-validator';
const productRouter:Router = Router();
import * as productController from "../Controller/productController"
import { authMiddleware } from "../Middleware/authmiddleware";

//Get Data
productRouter.get("/", authMiddleware, async (request: Request, response: Response) => {
   return await productController.getAllProducts(request, response)
  });

// add product
productRouter.post("/add",authMiddleware,[body('name').not().isEmpty().isLength({ min: 5, max:25}).withMessage('Name is required'),
body('imgUrl').not().isEmpty().withMessage('imgUrl is required'),
body('description').not().isEmpty().withMessage('description is required'),
body('categoryId').not().isEmpty().withMessage('categoryId is required'),
body('price').not().isEmpty().withMessage('price is required'),
body('quantity').not().isEmpty().withMessage('quantity is required')
], async (request: Request, response: Response) => {
  return await productController.createProduct(request, response)
});


//Get single
productRouter.get("/:productId", authMiddleware, async (request: Request, response: Response) => {
  return await productController.getSingleProduct(request, response)
 });


 //update Data
productRouter.put("/:productId", authMiddleware, [body('name').not().isEmpty().isLength({ min: 5, max:25}).withMessage('Name is required'),
body('imgUrl').not().isEmpty().withMessage('imgUrl is required'),
body('description').not().isEmpty().withMessage('description is required'),
body('categoryId').not().isEmpty().withMessage('categoryId is required'),
body('price').not().isEmpty().withMessage('price is required'),
body('quantity').not().isEmpty().withMessage('quantity is required')
], async (request: Request, response: Response) => {
  return await productController.updateProduct(request, response)
 });

//Delete Data
productRouter.delete("/:productId", authMiddleware, async (request: Request, response: Response) => {
  return await productController.deleteProduct(request, response)
 });

export default productRouter;

