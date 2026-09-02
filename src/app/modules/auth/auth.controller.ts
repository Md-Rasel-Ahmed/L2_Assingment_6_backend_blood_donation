import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const singup=catchAsync(async(req:Request,res:Response)=>{

   sendResponse(res,{
    success:true,
    message:"",
    statusCode:432,
    data:{}
   })
})

export const AuthController={
    singup
}