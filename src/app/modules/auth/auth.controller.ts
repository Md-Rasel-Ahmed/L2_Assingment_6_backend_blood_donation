import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status"

const singup=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
  const result=await AuthService.singup(payload)
   sendResponse(res,{
    success:true,
    message:"User Create Successfull",
    statusCode:httpStatus.CREATED,
    data:result
   })
})

export const AuthController={
    singup
}