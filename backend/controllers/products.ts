import { Request, Response } from "express";

import Products from "../models/products";

export const getAllProducts = (req: Request, res: Response) => {
  Products.getAllProduct((data) => {
    res.send(data);
  });
};
