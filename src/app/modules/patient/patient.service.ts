import { BloodGroup, RequestStatus, UrgencyLevel } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "../user/user.interface"
import httpStatus from "http-status"

const createBloodRequest =async (payload:any,user:IRequestUser)=>{
    const existPatient=await prisma.user.findUnique({
        where:{
            email:user.email,
        }
    })
    if(!existPatient || existPatient.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Patient Profile Not Founded!")
    }
  
    const createBloodRequest=await prisma.bloodRequest.create({
        data:{
            patientId:existPatient.id,
            bloodGroup:BloodGroup.AB_NEGATIVE,
            district:"",
            hospitalAddr:"",
            hospitalName:"",
            neededBy:"",
            patientName:"",
            upazila:"",
            bagsNeeded:2,
            details:"",
            urgency:UrgencyLevel.NORMAL
        },
        include:{
            patient:true
        }
    
    })
return createBloodRequest
}
const updateStatus=async(payload:any,user:IRequestUser)=>{
      const converPayloadStatus=payload.status.toUpperCase()
    const existPatient=await prisma.user.findUnique({
        where:{
            email:user.email,
        }
    })
    if(!existPatient || existPatient.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Patient Profile Not Founded!")
    }
    const isExistBloodReq=await prisma.bloodRequest.findUnique({
        where:{
            patientId:existPatient.id
        }
    })
     if(!isExistBloodReq){
        throw new AppError(httpStatus.NOT_FOUND,"Blood Request Not Founded!")
    }
    
    if(isExistBloodReq.status===RequestStatus.CANCELLED){
        throw new AppError(httpStatus.FORBIDDEN,"Your Blood Request Already Has Canceled Cannot Update!")
    }
    if(isExistBloodReq.status===RequestStatus.PENDING && converPayloadStatus!==RequestStatus.ACCEPTED){
        throw new AppError(httpStatus.BAD_REQUEST,"Blood Request Status Must Be ACCEPTED")
    }
    if(isExistBloodReq.status===RequestStatus.ACCEPTED && converPayloadStatus!==RequestStatus.FULFILLED){
        throw new AppError(httpStatus.BAD_REQUEST,"Blood Request Status Must Be FULFILLED")
    }

   const updateBloodRequest= await prisma.bloodRequest.update({
        where:{
            id:payload.id
        },
        data:{
            status:converPayloadStatus
        }
    })
return updateBloodRequest
}

export const PatientService={
    createBloodRequest,
    updateStatus
}