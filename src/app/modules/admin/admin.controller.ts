
import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { AdminService } from "./admin.service"


const getUsers=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const query=req.query
    const data=await AdminService.getUsers(query,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"All User Retrived Successfull",
 data:data
      })
})
const getAllDonor=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const query=req.query
    const data=await AdminService.getAllDonor(query,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"All Donor Retrived Successfull",
 data:data
      })
})
const getAllRequest=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const query=req.query
    const data=await AdminService.getAllRequest(query,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"All Request Retrived Successfull",
 data:data
      })
})
const updateUserStaus=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const payload=req.body
    const data=await AdminService.updateUserStaus(payload,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"User Status Update Successfull",
 data:data
      })
})
const deleteFakeBloodRequest=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const id=req.params.id
    const data=await AdminService.deleteFakeBloodRequest(id as string,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"Fake Request Deleted Successfull",
 data:data
      })
})
const deleteUser=catchAsync(async(req:Request,res:Response)=>{

    const user=req.user!
    const email=req.params.email
    const data=await AdminService.deleteUser(email as string,user)

      sendResponse(res,{
 success:true,
 statusCode:httpStatus.OK,
 message:"User Deleted Successfull",
 data:data
      })
})

export const AdminController={
deleteUser,
deleteFakeBloodRequest,
getAllDonor,
getAllRequest,
getUsers,
updateUserStaus
}