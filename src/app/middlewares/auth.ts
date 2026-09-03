import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import httpStatus from "http-status"
import { verifyToken } from "../utils/jwtHelpers";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: {
				email: string;
				userId: string;
				role: Role;
			};
		}
	}
}

export const auth =(...requiredRole:Role[])=>{
   return catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
        const token = req.cookies.accessToken
			? req.cookies.accessToken
			: req.headers.authorization?.startsWith("Bearer ")
				? req.headers.authorization?.split(" ")[1]
				: req.headers.authorization;
    if (!token) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"You are not logged in. Please log in to access this resource.",
			);
		}
    const verifiedToken=await verifyToken(token,config.jwt_access_secret)
    if (!verifiedToken.success) {
			throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message || "Invalid Or Expired Token");
		}
    const {role,userId,email}=verifiedToken.data?.data as JwtPayload
	console.log(role);
    if(requiredRole.length&& !requiredRole.includes(role)){
        throw new AppError(
				httpStatus.FORBIDDEN,
				"Forbidden. You don't have permission to access this resource.",
			);
    }
    req.user = {
			email,
			userId,
			role,
		};
        next()
   })
}