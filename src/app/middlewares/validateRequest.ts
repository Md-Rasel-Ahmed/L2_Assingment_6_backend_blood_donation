import { NextFunction, Request, Response } from "express";

// middlewares/validateRequest.js
export const validateRequest = (schema:any) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      return next(); 
    } catch (error) {
      next(error); 
    }
  };
};

