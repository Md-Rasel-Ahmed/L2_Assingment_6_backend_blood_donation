import { RequestStatus, Role } from "../../../generated/prisma/enums"
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

const updateAvailability=async(payload:any,user:IRequestUser)=>{
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

     if(payload.status===true){
 const targetDate=isExistDonor.donor?.lastDonatedAt
    if(!targetDate){
        throw new AppError(httpStatus.BAD_REQUEST,"Last Donation Date Is Required!")
    }
    const now =new Date()
    const threeMonthAgo=subMonths(now,3)
    
    const isThreeMonthBefore=isBefore(targetDate,threeMonthAgo)

    if(!isThreeMonthBefore){
        throw new AppError(httpStatus.FORBIDDEN,"Your Last Donation Must Be Gratter Then Or Equel 3 Month")
    }

    await prisma.donor.update({
        where:{
            id:payload.id
        },
        data:{
            isAvailable:true
        }
    })

     }
     
     if(payload.status===false){
        await prisma.donor.update({
            where:{id:payload.id},
            data:{isAvailable:false}
        })
     }
}

const updateDonationProfile=async(paylaod:any,user:IRequestUser)=>{
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

    const updatedProfile=await prisma.donor.update({
        where:{
            userId:isExistDonor.id
        },
        data:{
            ...paylaod
        }
    })
return updatedProfile
}

const acceptedRequest=async(id:string,user:IRequestUser)=>{
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
// check last donation date
const targetDate=isExistDonor.donor?.lastDonatedAt
    if(!targetDate){
        throw new AppError(httpStatus.BAD_REQUEST,"Last Donation Date Is Required!")
    }
    const now =new Date()
    const threeMonthAgo=subMonths(now,3)
    
    const isThreeMonthBefore=isBefore(targetDate,threeMonthAgo)

    if(!isThreeMonthBefore){
        throw new AppError(httpStatus.FORBIDDEN,"Your Last Donation Must Be Gratter Then Or Equel 3 Month")
    }
   

//    check is fullfield or not blood Requested status
  const findRequested=await prisma.bloodRequest.findUnique({
     where:{id}
  })
  if(findRequested?.status===RequestStatus.FULFILLED){
       throw new AppError(httpStatus.BAD_REQUEST,"Blood Request Already Fulfilled")
  }
    
  const acceptRequest=await prisma.requestResponse.create({
    data:{
        donorId:isExistDonor.id,
        requestId:findRequested?.id as string,
    }
  })
  
}

export const DonorService={
    getMyDonationHistories,
    updateAvailability,
    updateDonationProfile,
    acceptedRequest
}