import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { DonorService } from "./donor.service";

const acceptedRequest = catchAsync(async(req:Request,res:Response)=>{
    
    const id=req.params.id
    const user=req.user!
    const data=await DonorService.acceptedRequest(id as string,user)
    sendResponse(res,{
         statusCode:httpStatus.CREATED,
         success:true,
         message:"Blood Request Accepted Successfull",
         data:data
    })
})


export const DonorController={
    acceptedRequest
}