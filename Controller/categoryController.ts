import { Request, Response } from "express";
import { categoryTable } from "../database/schemas/categorySchema";
import { ICategory } from "../database/Models/ICategory";
import mongoose from "mongoose";

import { getAuthUser } from "../util/getAuthUser";
import { validationResult } from "express-validator";



// Create Category
export const createCategory = async (request: Request, response: Response) => {
  try {

    const result = await validationResult(request);
    if (!result.isEmpty()) {
      return response.status(401).json({ errors: result.array() });
    }
    const user = await getAuthUser(request, response);

    if (user) {
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
      user: new mongoose.Types.ObjectId(user._id),
    };

    const createdCategory = await new categoryTable(newCategory).save();

    if (createdCategory) {
      return response.status(201).json({ category: createdCategory });
    }

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
      
      const user = await getAuthUser(request, response);

    if (user) {
      const mongouserId = new mongoose.Types.ObjectId(user._id);
      const category:ICategory[] = await categoryTable.find({user: mongouserId});
      return response.status(201).json({ category});
    }

    } catch {
      (error: any) => {
        return response.status(500).json({ errors: [error.message] });
      };
    }
  };



  // Get Single category
export const getCategory = async (request: Request, response: Response) => {
    try {

      const user = await getAuthUser(request, response);

      if (user) {
        const {categoryId} = request.params;

        console.log(categoryId)

       if(categoryId){
        const mongoGroupID = new mongoose.Types.ObjectId(categoryId)
        const mongoUserId = new mongoose.Types.ObjectId(user._id)

        const category = await categoryTable.findOne({
          user: mongoUserId,
          _id: mongoGroupID
        });

        if(!category){
            return response.status(500).json({ msg: 'Category is not Found' });
        }

        return response.status(201).json({ category});
       }
      }
     
    } catch {
      (error: any) => {
        return response.status(500).json({ errors: [error.message] });
      };
    }
  };

