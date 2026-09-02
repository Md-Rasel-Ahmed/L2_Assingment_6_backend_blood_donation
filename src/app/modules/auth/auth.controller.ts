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
const login=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
  const result=await AuthService.login(payload)
   sendResponse(res,{
    success:true,
    message:"User Login Successfull",
    statusCode:httpStatus.OK,
    data:result
   })
})

export const AuthController={
    singup,
    login
}