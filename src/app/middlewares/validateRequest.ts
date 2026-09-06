import { NextFunction, Request, Response } from "express";

// middlewares/validateRequest.js
export const validateRequest = (schema:any) => {
  return async (req:Request, res:Response, next:NextFunction) => {
   const data=JSON.parse(req.body.data)
    try {
      await schema.parseAsync({
        body: req.body || data,
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

