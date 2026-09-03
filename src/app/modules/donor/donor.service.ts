import { Role } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import httpStatus from "http-status"
import { IRequestUser } from "../user/user.interface"
import { subMonths, isBefore } from 'date-fns';


const getMyDonationHistories=async(payload:any)=>{


    const isExistDonor=await prisma.user.findUnique({
        where:{
            email:payload.email,
            role:Role.DONOR
        }
    })

    if(!isExistDonor || isExistDonor.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Donor Profile Not Founded!")
    }

  const getDonatons=await prisma.requestResponse.findMany({
    where:{
        donorId:isExistDonor.id
    },
    include:{
        request:true
    }
  })

  return getDonatons

}

const updateAvailability=async(id:string,user:IRequestUser)=>{
    const isExistDonor=await prisma.user.findUnique({
        where:{
            email:user.email,
            role:Role.DONOR
        },
        include:{
            donor:true
        }
    })

    if(!isExistDonor || isExistDonor.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"Donor Profile Not Founded!")
    }
    
    // donor cannot update availabilty last donation date gather then or equal 3 month 
     const now =new Date()
    const threeMonthAgo=subMonths(now,3)

    const isThreeMonthBefore=isBefore(,threeMonthAgo)





}

export const DonorService={
    getMyDonationHistories
}