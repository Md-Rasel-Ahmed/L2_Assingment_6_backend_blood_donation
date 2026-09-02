import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import httpStatus from "http-status"
import { ISingup } from "./auth.interface"

import bcrypt from "bcrypt"

const singup = async(payload:ISingup)=>{
    const {email,name="Jhon",phone="53663523535",address,district,password,upazila}=payload
    const isExistUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })

    if(isExistUser){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist With This Email")
    }

    if(!password){
        throw new AppError(httpStatus.BAD_REQUEST,"Password is required")
    }

    const hashPassword=await bcrypt.hash(password,10)

    const createUser=await prisma.user.create({
        data:{
            email:email,
            password:hashPassword,
            phone,
            address,
            district,
            name,
            upazila
        },
        omit:{
            password:true
        }
    })
    return createUser
}

export const AuthService ={
    singup
}