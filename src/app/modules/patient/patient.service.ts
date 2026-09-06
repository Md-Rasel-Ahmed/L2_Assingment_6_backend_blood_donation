import { BloodGroup, RequestStatus, UrgencyLevel } from "../../../generated/prisma/enums"
import { BloodRequestWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "../user/user.interface"
import httpStatus from "http-status"
import { ICreateBloodRequest, IUpdateBloodRequest } from "./patient.interface"

const createBloodRequest =async (payload:ICreateBloodRequest,user:IRequestUser)=>{
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
            district:payload.district,
            hospitalAddr:payload.hospitalAddr,
            hospitalName:payload.hospitalName,
            neededBy:payload.neededBy,
            patientName:payload.patientName,
            upazila:payload.upazila,
            bagsNeeded:payload.bagsNeeded,
            details:payload.details,
            urgency:UrgencyLevel.NORMAL
        },
        include:{
            patient:true
        }
    
    })
return createBloodRequest
}

const updateStatus=async(id:string,payload:{status:string},user:IRequestUser)=>{
    const converPayloadStatus=payload.status.toUpperCase() as RequestStatus
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
            id:id
        },include:{responses:true}
    })
     if(!isExistBloodReq){
        throw new AppError(httpStatus.NOT_FOUND,"Blood Request Not Founded!")
    }
    
    if(isExistBloodReq.status===RequestStatus.CANCELLED){
        throw new AppError(httpStatus.BAD_REQUEST,"Your Blood Request Already Has Canceled Cannot Update!")
    }

    if((isExistBloodReq.status===RequestStatus.ACCEPTED && converPayloadStatus === RequestStatus.CANCELLED) && isExistBloodReq.responses.length>0 ){
         throw new AppError (httpStatus.BAD_REQUEST,"You Cannot Change Status Because Alrady More Then 1 Pepole Appiled!")
    }

    if(isExistBloodReq.status===RequestStatus.PENDING && converPayloadStatus===RequestStatus.ACCEPTED){
        throw new AppError(httpStatus.FORBIDDEN,"You Cannot Update status ACCEPTED It Will Update Our Admin")
    }
    if(isExistBloodReq.status===RequestStatus.ACCEPTED && converPayloadStatus!==RequestStatus.FULFILLED){
        throw new AppError(httpStatus.BAD_REQUEST,"Blood Request Status Must Be FULFILLED")
    }

   const updateBloodRequest= await prisma.bloodRequest.update({
        where:{
            id:id
        },
        data:{
            status:converPayloadStatus
        }
    })
return updateBloodRequest
}

const updateRequest=async(id:string,payload:IUpdateBloodRequest,user:IRequestUser)=>{
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
            id,
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
        },include:{
            responses:true
        }
    })
    return updateBloodRequest
}

const getMyBloodRequest=async(query:Record<string,any>,user:IRequestUser)=>{
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
            responses:{
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
      const isExistBloodReq=await prisma.bloodRequest.findUnique({
        where:{
            id:id
        },include:{responses:true}
    })
     if(!isExistBloodReq){
        throw new AppError(httpStatus.NOT_FOUND,"Blood Request Not Founded!")
    }
    const getBloodReqResById=await prisma.bloodRequest.findUnique({
        where:{
            id
        },
        include:{
            responses:{
                include:{
                    donor:true,
                  
                }
            }
        
        }
    })
   
    return getBloodReqResById


}
const confirmDonation=async(id:string,user:IRequestUser)=>{
    const transactionResult=await prisma.$transaction(async (tx)=>{
         const existPatient=await tx.user.findUnique({
        where:{
            email:user.email,
        }
    })
    if(!existPatient || existPatient.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Patient Profile Not Founded!")
    }
     const isExistDonor=await tx.donor.findUnique({where:{userId:id}})
    if(!isExistDonor){
        throw new AppError(httpStatus.NOT_FOUND,"Donor Profile Not Founded With This Id,Please Try Again")
    }

    if(isExistDonor.isAvailable===false){
        throw new AppError (httpStatus.BAD_REQUEST,"Already Confirm Donation With This Donor")
    }

 await tx.donor.update({
        where:{
          userId:id
        },
        data:{
            lastDonatedAt:new Date(),
            totalDonations:{increment:1},
            isAvailable:false
        }
    })
    await tx.requestResponse.updateMany({
        where:{
            donorId:id
        },data:{status:"COMPLETED"}
    })

    await tx.bloodRequest.updateMany({
        where:{
         patientId:existPatient.id
        },data:{
            status:"FULFILLED"
        }
    })

    })

   
   
}
const gelAllBloodRequest=async(query:Record<string,any>)=>{
       const limit=query.limit?Number(query.limit):10
    const page=query.page?Number(query.page):1
    const skip=(page-1)*limit
   

    const andCondition:BloodRequestWhereInput[]=[
        {urgency:"EMERGENCY"},
        {status:"ACCEPTED"}
    ]
 

//   Search by location

 if(query.searchTerms){
    andCondition.push({
        OR:[
            {hospitalAddr:{contains:query.searchTerms,mode:"insensitive"}},
            {hospitalName:{contains:query.searchTerms,mode:"insensitive"}},
            {district:{contains:query.searchTerms,mode:"insensitive"}},
        ]
    })
 }


//  filter by uregency
if(query.urgency){
    andCondition.push({urgency:query.urgency})
}



    const allRequest=await prisma.bloodRequest.findMany({
        where:{
            AND:andCondition
        },
        take:limit,
        skip,
        include:{
            patient:true,
            responses:true
        }

    })
    const total=await prisma.bloodRequest.count({where:{AND:andCondition}})
   return {
    data:allRequest,
    meta:{
        page,
        limit,
        total,
        totalPage:Math.ceil(total/limit)
    }
   }
}

export const PatientService={
    createBloodRequest,
    updateStatus,
    updateRequest,
    getMyBloodRequest,
    getBloodRequestResponseById,
    confirmDonation,
    gelAllBloodRequest
}