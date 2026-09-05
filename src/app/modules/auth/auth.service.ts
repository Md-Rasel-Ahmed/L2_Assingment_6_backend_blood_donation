import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError"
import httpStatus from "http-status"
import { Ilogin, ISingup } from "./auth.interface"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { createToken } from "../../utils/jwtHelpers"
import config from "../../config"
import { Role, UserStatus } from "../../../generated/prisma/enums"
import { redisClient } from "../../lib/radis"
import { transporter } from "../../lib/nodemailer"
import path from "node:path"
import ejs from "ejs"


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
            status:UserStatus.PENDING_VERIFICATION,
            role,
            address,
            district,
            name,
            upazila,

        },
        omit:{
            password:true
        }
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key=`donation-singup-otp:${createUser.email}`
//    send otp to radis
  await redisClient.set(key,otp,{
    expiration:{
        type:"EX",
        value:300
    }
 }
 )

 const tamplatepath=path.join(process.cwd(),"src/app/tamplates/send-otp.ejs")

 const html=await ejs.renderFile(tamplatepath,{
    name,
    otp,
    year: new Date().getFullYear(),
 })
 await transporter.sendMail({
    from:"nhd305812@gmail.com",
    to:createUser.email,
    subject:"Your OTP Code",
     html:html
 })
   
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