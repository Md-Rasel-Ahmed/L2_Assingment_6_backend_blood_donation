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
    message:"Sent Email Verification Code",
    statusCode:httpStatus.CREATED,
    data:result
   })
})
const login=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
  const {accessToken,refreshToken}=await AuthService.login(payload)
   
  res.cookie("accessToken",accessToken,{
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite:"lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,//1day
  })
  res.cookie("refreshToken",refreshToken,{
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite:"lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,//7 days
  })

   sendResponse(res,{
    success:true,
    message:"User Login Successfull",
    statusCode:httpStatus.OK,
    data:{
        accessToken,
        refreshToken
    }
   })
})
const emailVerify=catchAsync(async(req:Request,res:Response)=>{
   const paylaod=req.body
  await AuthService.emailVerify(paylaod)
   sendResponse(res,{
    success:true,
    message:"Email Verification Successfull",
    statusCode:httpStatus.OK,
    data:{}
   })
})

export const AuthController={
    singup,
    login,
    emailVerify
}