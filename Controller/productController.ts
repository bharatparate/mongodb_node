import express, { Request, Response, Router } from "express";
import { body, query, validationResult } from "express-validator";
import { productTable } from "../database/schemas/productSchema";
import { IProduct } from "../database/Models/IProduct";
import mongoose from "mongoose";
import { getAuthUser } from "../util/getAuthUser";
import { IUser } from "../database/Models/IUser";

//{name, imgUrl, category, description, price, quantity }

// Create Product
export const createProduct = async (request: Request, response: Response) => {
  try {
    const result = await validationResult(request);
    if (!result.isEmpty()) {
      return response.status(401).json({ errors: result.array() });
    }

    const user = await getAuthUser(request, response);

    if (user) {
      const { name, imgUrl, description, price, quantity, categoryId } = request.body;

      // check in name exsits

      const product = await productTable.findOne({ name: name });

      if (product) {
        return response.status(401).json({
          msg: "Product is already exists",
        });
      }

      const newProduct: IProduct = {
        name: name,
        user: new mongoose.Types.ObjectId(user._id),
        imgUrl: imgUrl,
        description: description,
        price: price,
        quantity: quantity,
        categoryId: categoryId,
      };

      const createdProduct = await new productTable(newProduct).save();
      if (createdProduct) {
        return response.status(201).json({ createdProduct });
      }
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Get All Products
export const getAllProducts = async (request: Request, response: Response) => {
  try {
    const user = await getAuthUser(request, response);
    if (user) {
      const mongoUserId = new mongoose.Types.ObjectId(user._id);
      const product: IProduct[] = await productTable.find({
        user: mongoUserId,
      });
      return response.status(201).json({ product });
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Get a Single Product

export const getSingleProduct = async (
  request: Request,
  response: Response
) => {
  try {
    const user = await getAuthUser(request, response);

    if (user) {
      const { productId } = request.params;

      if (productId) {
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const mongoUserId = new mongoose.Types.ObjectId(user._id);
        const product = await productTable.findOne({
          _id: mongoProductId,
          user: mongoUserId,
        });

        if (!product) {
          return response.status(500).json({ msg: "Product is not Found" });
        }

        return response.status(201).json({ product });
      }
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Update Product

export const updateProduct = async (request: Request, response: Response) => {
  try {
    const result = await validationResult(request);
    if (!result.isEmpty()) {
      return response.status(401).json({ errors: result.array() });
    }

    const user = await getAuthUser(request, response);

    if (user) {
      const { name, imgUrl, description, price, quantity, categoryId } =
        request.body;
      const { productId } = request.params;
      if (productId) {
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const mongoUserId = new mongoose.Types.ObjectId(user._id);
        // check product exsits or not
        const product = await productTable.findOne({
          _id: mongoProductId,
          user: mongoUserId,
        });
        if (!product) {
          return response.status(401).json({
            msg: "Product not Found",
          });
        }
        const newProduct: IProduct = {
          name: name,
          user: mongoUserId,
          imgUrl: imgUrl,
          description: description,
          price: price,
          quantity: quantity,
          categoryId: categoryId,
        };
        const updatedProduct = await productTable.findByIdAndUpdate(
          mongoProductId,
          {
            $set: newProduct,
          },
          { new: true }
        );
        if (updatedProduct) {
          return response.status(200).json(updatedProduct);
        }
      }
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Delete Product

export const deleteProduct = async (request: Request, response: Response) => {
  try {
    const user = await getAuthUser(request, response);

    if (user) {
      const { productId } = request.params;
      if (productId) {
        const mongoproductID = new mongoose.Types.ObjectId(productId);
        const mongoUserId = new mongoose.Types.ObjectId(user._id);

        const product = await productTable.findOne({
          _id: mongoproductID,
          user: mongoUserId,
        });

        if (!product) {
          return response
            .status(500)
            .json({ msg: "Product is not Found ffsfsfd" });
        }

        const deletedProduct = await productTable.findByIdAndDelete(
          mongoproductID
        );
        if (deletedProduct) {
          return response.status(201).json({});
        }
      }
    }
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};
