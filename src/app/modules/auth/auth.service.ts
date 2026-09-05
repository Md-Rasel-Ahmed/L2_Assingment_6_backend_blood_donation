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
import { IRequestUser } from "../user/user.interface"


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

const emailVerify=async(payload:{email:string,otp:string})=>{
    
    const existUser=await prisma.user.findUnique({
        where:{email:payload.email}
    })

    if(!existUser){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded With This Email")
    }

    // check otp valid or not
    const key=`donation-singup-otp:${existUser.email}`
    
    const savedOtp=await redisClient.get(key)
   console.log(payload.otp,savedOtp);
    if(!savedOtp){
        throw new AppError(httpStatus.BAD_REQUEST,"OTP expired or not found")
    }

  if (savedOtp !== payload.otp) {
    throw new AppError(httpStatus.BAD_REQUEST,"Invalid OTP");
  }

  await redisClient.del(key)
    await prisma.user.update({
        where:{
            email:existUser.email
        },
        data:{
            emailVerified:true
        }
    })

}

const login =async (payload:Ilogin)=>{
    
    const isExistUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })
    if(!isExistUser || isExistUser.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }

    if(!isExistUser.emailVerified){
        throw new AppError(httpStatus.FORBIDDEN,"Your Email Is Not Verified, Please Verify Your Email")
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

const sendOtp=async(payload:any)=>{
    const exitUser=await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })
    if(!exitUser || exitUser.isDeleted){
      throw new AppError(httpStatus.NOT_FOUND,"User Not Founded!")
    }

     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key=`donation-singup-otp:${exitUser.email}`
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
    name:exitUser.name,
    otp,
    year: new Date().getFullYear(),
 })
 await transporter.sendMail({
    from:"nhd305812@gmail.com",
    to:exitUser.email,
    subject:"Your OTP Code",
     html:html
 })
}

const forgotPassword=async(user:IRequestUser)=>{

  const isExistUser=await prisma.user.findUnique({
        where:{
            email:user.email
        }
        })
    if(!isExistUser || isExistUser.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND,"User Not Founded")
    }
const otp = Math.floor(100000 + Math.random() * 900000).toString();
 const key=`forgot-password:${isExistUser.email}`
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
    name:isExistUser.name,
    otp,
    year: new Date().getFullYear(),
 })
 await transporter.sendMail({
    from:"nhd305812@gmail.com",
    to:isExistUser.email,
    subject:"Your OTP Code",
     html:html
 })
}

const resetPassword=async(payload:any)=>{
    const {email,otp,newPassword}=payload
const user = await prisma.user.findUnique({
		where: { email: email },
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}
	if (!user.emailVerified) {
		throw new AppError(httpStatus.BAD_REQUEST, "Email is not verified");
	}
	if (user.status === UserStatus.SUSPENDED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is SUSPENDED");
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

    const key = `forgot-password:${user.email}`;

	// get otp from redis then check is valid or not
	const redisOtp = await redisClient.get(key);
	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
	}
	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP Not Match!");
	}
    const hashPassword = await bcrypt.hash(newPassword, 10);
	await prisma.user.update({
		where: {
			email: email,
		},
		data: {
			password: hashPassword,
		},
	});
    await redisClient.del([key]);
	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/password-changed.ejs",
	);
	const html = await ejs.renderFile(templatePath, {
		userName: user.name,
		appName: "PH Health Care",
		changeTime: new Date().toLocaleString("en-US", {
			dateStyle: "medium",
			timeStyle: "short",
		}),
		supportUrl: "https://example.com/support",
	});
	// Send email to change password success message
	await transporter.sendMail({
		from: "nhd305812@gmail.com",
		to: user.email,
		subject: "Security Alert: Your password was changed",
		html,
	});
}
export const AuthService ={
    singup,
    login,
    emailVerify,
    sendOtp,
    forgotPassword,
    resetPassword
}