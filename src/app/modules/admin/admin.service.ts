import { BloodRequestWhereInput, DonorWhereInput, UserWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "../user/user.interface"
import httpStatus from "http-status"

const getUsers=async(query:Record<string,any>,user:IRequestUser)=>{
    const limit=query.limit?Number(query.limit):10
       const page=query.page?Number(query.page):1
       const skip=(page-1)*limit
       const sortBy=query.sortBy?query.sortBy:"createdAt"
       const sortOrder=query.sortOrder?query.sortOrder:"desc"
       const andCondition:UserWhereInput[]=[]

    const isExistAdmin=await prisma.user.findUnique({
        where:{email:user.email}
    })

    if(!isExistAdmin){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }
 // serach 
    if(query.searchTerm){
        andCondition.push({
            OR:[
                {email:{contains:query.searchTerm,mode:"insensitive"}},
                {address:{contains:query.searchTerm,mode:"insensitive"}},
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

   const users=await prisma.user.findMany({
    where:{AND:andCondition},
    take:limit,
    skip,
    orderBy,
    include:{blodReuest:true,donor:true,response:true}
   })
   const total=await prisma.user.count({where:{AND:andCondition}})
   return {
    data:users,
    meta:{
            page,
            limit,
            total,
            totalPage:Math.ceil(total/limit)
        }
   }
}
const getAllDonor=async(query:Record<string,any>,user:IRequestUser)=>{
     const limit=query.limit?Number(query.limit):10
       const page=query.page?Number(query.page):1
       const skip=(page-1)*limit
       const sortBy=query.sortBy?query.sortBy:"createdAt"
       const sortOrder=query.sortOrder?query.sortOrder:"desc"
       const andCondition:DonorWhereInput[]=[]

    const isExistAdmin=await prisma.user.findUnique({
        where:{email:user.email}
    })

    if(!isExistAdmin){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }

    
    // filter by status 
    if(query.bloodGroup){
        andCondition.push({bloodGroup:query.bloodGroup})
    }

    const orderBy={
        [sortBy]:sortOrder
    }

   const donors=await prisma.donor.findMany({
    where:{AND:andCondition},
    take:limit,
    skip,
    orderBy,
    include:{user:true}
   })
   const total=await prisma.donor.count({where:{AND:andCondition}})
   return {
    data:donors,
    meta:{
            page,
            limit,
            total,
            totalPage:Math.ceil(total/limit)
        }
   }
}

const getAllRequest=async(query:Record<string,any>,user:IRequestUser)=>{
      const limit=query.limit?Number(query.limit):10
       const page=query.page?Number(query.page):1
       const skip=(page-1)*limit
       const sortBy=query.sortBy?query.sortBy:"createdAt"
       const sortOrder=query.sortOrder?query.sortOrder:"desc"
       const andCondition:BloodRequestWhereInput[]=[]

    const isExistAdmin=await prisma.user.findUnique({
        where:{email:user.email}
    })

    if(!isExistAdmin){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }

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
    if(query.urgency){
        andCondition.push({urgency:query.urgency})
    }
    if(query.status){
        andCondition.push({status:query.status})
    }

    const orderBy={
        [sortBy]:sortOrder
    }

   const allRequest=await prisma.bloodRequest.findMany({
    where:{AND:andCondition},
    take:limit,
    skip,
    orderBy,
    include:{patient:true,responses:true}
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

const deleteFakeBloodRequested=async()=>{}

const deleteUser=async()=>{}


export const AdminService={
    getAllDonor,
    getAllRequest,
    
    deleteFakeBloodRequested,
    deleteUser
}