import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import httpStatus from "http-status"
import { Ilogin, ISingup } from "./auth.interface"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { createToken } from "../../utils/jwtHelpers"
import config from "../../config"
import { Role } from "../../../generated/prisma/enums"

const singup = async(payload:ISingup)=>{
    const {email,name="Jhon",phone="53663523535",address,district,role,password,upazila}=payload
    const isExistUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })

    if(isExistUser){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist With This Email")
    }
    if(role.toUpperCase()===Role.ADMIN){
        throw new AppError(httpStatus.FORBIDDEN,"Cannot Create Account With Admin Role")
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
            role,
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
const login =async (payload:Ilogin)=>{
    
    const isExistUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })
    if(!isExistUser){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }

    const matchPassword=await bcrypt.compare(payload.password,isExistUser.password!)

    if(!matchPassword){
        throw new AppError(httpStatus.BAD_REQUEST,"Password Did Not Match")
    }

    const jwtPayload={
        userId:isExistUser.id,
        email:isExistUser.email,
        role:isExistUser.role, 
    }
    const accessToken=await createToken(jwtPayload,config.jwt_access_secret,"1d")
    const refreshToken=await createToken(jwtPayload,config.jwt_refresh_secret,"7d")
    return {
        accessToken,
        refreshToken
    }
}

export const AuthService ={
    singup,
    login
}