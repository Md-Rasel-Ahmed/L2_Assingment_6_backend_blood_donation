import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import { IAuthUser } from "../../middlewares/auth";
import { AppError } from "../../utils/AppError";

const singup = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await AuthService.singup(payload);
	sendResponse(res, {
		success: true,
		message: "Sent Email Verification Code",
		statusCode: httpStatus.CREATED,
		data: result,
	});
});
const login = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const { accessToken, refreshToken } = await AuthService.login(payload);

	res.cookie("accessToken", accessToken, {
		// secure: process.env.NODE_ENV === "production",
		
    secure:true,  
    path:"/",
    sameSite: "none",
		httpOnly: true,
		// sameSite: "lax",
		maxAge: 1 * 24 * 60 * 60 * 1000, //1day
	});
	res.cookie("refreshToken", refreshToken, {
	// secure: process.env.NODE_ENV === "production",
		
    secure:true,  
    path:"/",
    sameSite: "none",
		httpOnly: true,
		// sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
	});

	sendResponse(res, {
		success: true,
		message: "User Login Successfull",
		statusCode: httpStatus.OK,
		data: {
			accessToken,
			refreshToken,
		},
	});
});
const logout = catchAsync(async (req: Request, res: Response) => {
   res.clearCookie("accessToken")
   res.clearCookie("refreshToken")

	sendResponse(res, {
		success: true,
		message: "User Logout Successfull",
		statusCode: httpStatus.OK,
		data:{}
	});
});
const emailVerify = catchAsync(async (req: Request, res: Response) => {
	const paylaod = req.body;
	await AuthService.emailVerify(paylaod);
	sendResponse(res, {
		success: true,
		message: "Email Verification Successfull",
		statusCode: httpStatus.OK,
		data: {},
	});
});
const sendOtp = catchAsync(async (req: Request, res: Response) => {
	const paylaod = req.body;
	await AuthService.sendOtp(paylaod);
	sendResponse(res, {
		success: true,
		message: "Email Verification Code Sent",
		statusCode: httpStatus.OK,
		data: {},
	});
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const payload=req.body
	await AuthService.forgotPassword(payload);
	sendResponse(res, {
		success: true,
		message: "Email Verification Code Sent",
		statusCode: httpStatus.OK,
		data: {},
	});
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const paylaod = req.body;
	await AuthService.resetPassword(paylaod);
	sendResponse(res, {
		success: true,
		message: "Password Reset Successfull",
		statusCode: httpStatus.OK,
		data: {},
	});
});
const googleCallback = catchAsync(async (req: Request, res: Response) => {
 const googleUser = req.user as {
    googleId: string;
    email: string;
    name: string;
    image?: string;
  };
    const {accessToken,user} = await AuthService.googleLoginCallback(googleUser);
	res.cookie("accessToken", accessToken, {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 1 * 24 * 60 * 60 * 1000, //1day
	});
	res.redirect('http://localhost:3000/login?status=success&message=Logged in successfully with Google!')
    // sendResponse(res,{
	// 	statusCode:httpStatus.OK,
	// 	message:"Google Login Success",
	// 	success:true,
	// 	data:user
	// })
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new AppError(httpStatus.BAD_REQUEST, "Refresh token is missing");
	}
	const { accessToken, refreshToken } = await AuthService.refreshToken(req.cookies.refreshToken);

	res.cookie("accessToken", accessToken, {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 1 * 24 * 60 * 60 * 1000, //1day
	});
	res.cookie("refreshToken", refreshToken, {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
	});

	sendResponse(res, {
		success: true,
		message: "New Token Create Successfull",
		statusCode: httpStatus.OK,
		data: {
			accessToken,
			refreshToken,
		},
	});
});

export const AuthController = {
	singup,
	login,
	sendOtp,
	resetPassword,
	forgotPassword,
	emailVerify,
	googleCallback,
	refreshToken,
	logout
};
