import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { DonationService } from "./donation.service"

const createDonation = catchAsync(async(req:Request,res:Response)=>{
    const user=req.user!
    const data=await DonationService.createDonationPayment(user)
    sendResponse(res,{
         statusCode:httpStatus.CREATED,
         success:true,
         message:"Payment Create  Successfull",
         data:{
            PaymentURL:data.bkashURL
         }
    })
})
const bkashCallback = catchAsync(async(req:Request,res:Response)=>{
    const query=req.query
    const {redirectURL}=await DonationService.paymentCallback(query)
  res.redirect(redirectURL)
})


export const DonationController ={
    createDonation,
    bkashCallback
}