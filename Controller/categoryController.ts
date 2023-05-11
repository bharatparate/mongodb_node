import express, { Request, Response, Router } from "express";
import { categoryTable } from "../database/schemas/categorySchema";
import { ICategory } from "../database/Models/ICategory";
import mongoose from "mongoose";
import { resolve } from "path";



// Create Category
export const createCategory = async (request: Request, response: Response) => {
  try {
    const { name } = request.body;
    // check in name exsits

    const category = await categoryTable.findOne({ name: name });

    if (category) {
      return response.status(401).json({
        msg: "Category is aalready exists",
      });
    }

    const newCategory: ICategory = {
      name: name,
    };

    const createdCategory = await new categoryTable(newCategory).save();

    if (createdCategory) {
      return response.status(201).json({ category: createdCategory });
    }

   
  } catch {
    (error: any) => {
      return response.status(500).json({ errors: [error.message] });
    };
  }
};

// Get all category
export const getAllCategory = async (request: Request, response: Response) => {
    try {
      
        const category:ICategory[] = await categoryTable.find();
        return response.status(201).json({ category});
     
    } catch {
      (error: any) => {
        return response.status(500).json({ errors: [error.message] });
      };
    }
  };



  // Get Single category
export const getCategory = async (request: Request, response: Response) => {
    try {
        
        const {categoryId} = request.params;
        const mongoGroupID = new mongoose.Types.ObjectId(categoryId)

        const category = await categoryTable.findById(mongoGroupID);

        if(!category){
            return response.status(500).json({ msg: 'Category is not Found' });
        }

        return response.status(201).json({ category});
     
    } catch {
      (error: any) => {
        return response.status(500).json({ errors: [error.message] });
      };
    }
  };

