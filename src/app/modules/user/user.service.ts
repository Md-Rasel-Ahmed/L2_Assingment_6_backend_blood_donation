import { UploadApiResponse } from "cloudinary"
import cloudinary from "../../lib/cloudinary"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import { IRequestUser } from "./user.interface"
import httpStatus from "http-status"
import { createAuditLog } from "../auditLog/audit.service"

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
    omit:{password:true},
    include:{donor:true}
   })
   
return getMe
}

const udpateProfile=async(file:any,data:any,user:IRequestUser)=>{

  const findUser=await prisma.user.findUnique({
    where:{email:user.email}
  })
  if(!findUser || findUser.isDeleted){
    throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
  }
    let imgurl=""
    let publicId=""
    if(file){
    const cloudinaryResult=await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "donation-healthcare",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
            if(!result){return reject()}
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
  imgurl=cloudinaryResult.secure_url,
  publicId=cloudinaryResult.public_id
}

 const updateProfile=await prisma.user.update({
    where:{email:user.email},
    data:{
        ...data,
         ...(imgurl && {
         imgURL:imgurl,
       imgPublicId:publicId
      }),
     
        
    }
 })
  await createAuditLog({
        action:"Update",
        description:"Update Profile",
        entity:"Patient,Donor,Admin",
        entityId:findUser.id,
        
    })
 return updateProfile
}
export const UsersService={
    getMe,
    udpateProfile
}