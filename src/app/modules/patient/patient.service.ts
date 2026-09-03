import { BloodGroup, RequestStatus, UrgencyLevel } from "../../../generated/prisma/enums"
import { BloodRequestWhereInput } from "../../../generated/prisma/models"
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

const updateRequest=async(payload:any,user:IRequestUser)=>{
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
        },
        include:{
            responses:true
        }
    })
     if(!isExistBloodReq){
        throw new AppError(httpStatus.NOT_FOUND,"Blood Request Not Founded!")
    }

    if(isExistBloodReq.responses.length>0){
        throw new AppError (httpStatus.BAD_REQUEST,"Your Blood Request Already Somebody Applied Cannot Update")
    }
    const updateBloodRequest=await prisma.bloodRequest.update({
        where:{
            id:isExistBloodReq.id
        },
        data:{
            ...payload
        }
    })
    return updateBloodRequest
}

const getAllBloodRequest=async(query:Record<string,any>,user:IRequestUser)=>{
      const limit=query.limit?Number(query.limit):10
    const page=query.page?Number(query.page):1
    const skip=(page-1)*limit
    const sortBy=query.sortBy?query.sortBy:"createdAt"
    const sortOrder=query.sortOrder?query.sortOrder:"desc"

    const andCondition:BloodRequestWhereInput[]=[]
     
    // serach 
    if(query.searchTerm){
        andCondition.push({
            OR:[
                {patientName:{contains:query.searchTerm,mode:"insensitive"}},
                {hospitalName:{contains:query.searchTerm,mode:"insensitive"}},
            ]
        })
    }

    // filter by status 
    if(query.status){
        andCondition.push({status:query.status})
    }

    const orderBy={
        [sortBy]:sortOrder
    }

    const allBloodRequest=await prisma.bloodRequest.findMany({
        where:{
        AND:andCondition
        },
        take:limit,
        skip,
        orderBy,
        include:{
            patient:{
                include:{
                    donor:true
                }
            }
        }
    })
    const total=await prisma.bloodRequest.count({where:{AND:andCondition}})

    return {
        data:allBloodRequest,
        meta:{
            page,
            limit,
            total,
            totalPage:Math.ceil(total/limit)
        }
    }

}

const getBloodRequestResponseById=async(id:string,user:IRequestUser)=>{
    const existPatient=await prisma.user.findUnique({
        where:{
            email:user.email,
        }
    })
    if(!existPatient || existPatient.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Patient Profile Not Founded!")
    }
    const getBloodReqResById=await prisma.bloodRequest.findUnique({
        where:{
            id
        },
        include:{
            responses:{
                include:{
                    donor:true,
                    request:true
                }
            }
        
        }
    })
   
    return getBloodReqResById


}

export const PatientService={
    createBloodRequest,
    updateStatus,
    updateRequest,
    getAllBloodRequest,
    getBloodRequestResponseById
}