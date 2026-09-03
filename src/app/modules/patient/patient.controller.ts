import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { PatientService } from "./patient.service";

const createBloodRequest=catchAsync(async(req:Request,res:Response)=>{

    const payload=req.body
    const user=req.user!
    const data=await PatientService.createBloodRequest(payload,user)
      sendResponse(res,{
 success:true,
 statusCode:httpStatus.CREATED,
 message:"Blood Request Create Successfull",
 data:data
      })
})
const updateStatus=catchAsync(async(req:Request,res:Response)=>{

    const payload=req.body
    const user=req.user!
    const data=await PatientService.updateStatus(payload,user)
      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"Blood Request Status Update Successfull",
 data:data
      })
})
const updateRequest=catchAsync(async(req:Request,res:Response)=>{

    const payload=req.body
    const user=req.user!
    const id=req.params.id
    const data=await PatientService.updateRequest(id as string,payload,user)
      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"Blood Request Update Successfull",
 data:data
      })
})

export const PatientController ={
    createBloodRequest,
    updateStatus,
    updateRequest
}