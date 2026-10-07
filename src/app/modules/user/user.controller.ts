import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UsersService } from "./user.service";
import { IAuthUser } from "../../middlewares/auth";

const getMe = catchAsync(async (req: Request, res: Response) => {
		const user = (req as any).user as IAuthUser;
	
	const result = await UsersService.getMe(user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Profile Fetching Successfull",
		data: result,
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const file = req.file;
	console.log("from upate profole",file,req.body);
	const data = JSON.parse(req.body.data);
		const user = (req as any).user as IAuthUser;

	const result = await UsersService.udpateProfile(file, data, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Profile Update Successfull",
		data: result,
	});
});

export const UsersController = {
	getMe,
	updateProfile,
};
