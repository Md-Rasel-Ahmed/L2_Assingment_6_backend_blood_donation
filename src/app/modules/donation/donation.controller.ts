import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { DonationService } from "./donation.service";
import { IAuthUser } from "../../middlewares/auth";

const createDonation = catchAsync(async (req: Request, res: Response) => {
		const user = (req as any).user as IAuthUser;
	    const amount=req.body.amount
		console.log(req.body,"from controller");
	const data = await DonationService.createDonationPayment(user,amount);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Payment Initiate Successfull",
		data: {
			PaymentURL: data.bkashURL,
		},
	});
});
const bkashCallback = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const { redirectURL } = await DonationService.paymentCallback(query);
	res.redirect(redirectURL);
});
const getMyPayments = catchAsync(async (req: Request, res: Response) => {
		const user = (req as any).user as IAuthUser;

	const data = await DonationService.getMyPayments(user);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Payments Retrived Successfull",
		data: data,
	});
});

export const DonationController = {
	createDonation,
	bkashCallback,
	getMyPayments,
};
