import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { DonorService } from "./donor.service";

const createDonorProfile = catchAsync(async(req:Request,res:Response)=>{
    
    const payload=req.body
    const user=req.user!
    const data=await DonorService.createDonorProfile(payload,user)
    sendResponse(res,{
         statusCode:httpStatus.CREATED,
         success:true,
         message:"Donor Profile Create Successfull",
         data:data
    })
})
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
const getMyDonationHistories = catchAsync(async(req:Request,res:Response)=>{
    
    const user=req.user!
    const data=await DonorService.getMyDonationHistories(user)
    sendResponse(res,{
         statusCode:httpStatus.OK,
         success:true,
         message:"All Donation History Retrived Successfull",
         data:data
    })
})
const updateAvailability = catchAsync(async(req:Request,res:Response)=>{
    
    const id=req.params.id
    const user=req.user!
    const payload=req.body
    const data=await DonorService.updateAvailability(id as string,payload,user)
    sendResponse(res,{
         statusCode:httpStatus.CREATED,
         success:true,
         message:"Availablity Update Successfull",
         data:data
    })
})


export const DonorController={
    acceptedRequest,
    getMyDonationHistories,
    createDonorProfile,
    updateAvailability
}