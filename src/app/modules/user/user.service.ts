import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "./user.interface"
import httpStatus from "http-status"

const getMe=async(user:IRequestUser)=>{
   const isExistUser=await prisma.user.findUnique({
    where:{email:user.email}
   })

   if(!isExistUser || isExistUser.isDeleted){
       throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
   }

   const getMe=await prisma.user.findUnique({
    where:{
        email:isExistUser.email
    },
    include:{donor:true}
   })
   
return getMe
}

export const UsersService={
    getMe
}