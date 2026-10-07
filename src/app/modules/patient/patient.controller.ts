import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PatientService } from "./patient.service";
import { IAuthUser } from "../../middlewares/auth";

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const user =  (req as any).user as IAuthUser;

	const data = await PatientService.createBloodRequest(payload, user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Blood Request Create Successfull",
		data: data,
	});
});
const updateStatus = catchAsync(async (req: Request, res: Response) => {
	const user =  (req as any).user as IAuthUser;

	const id = req.params.id;
	const paylaod = req.body;
	console.log(id,paylaod);
	const data = await PatientService.updateStatus(id as string, paylaod, user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Blood Request Status Update Successfull",
		data: data,
	});
});
const getMyBloodRequests = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const user =  (req as any).user as IAuthUser;

	const data = await PatientService.getMyBloodRequest(query, user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Blood Requested Retrived Successfull",
		data: data,
	});
});
const updateRequest = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const user =  (req as any).user as IAuthUser;

	const id = req.params.id;
	const data = await PatientService.updateRequest(id as string, payload, user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Blood Request Update Successfull",
		data: data,
	});
});
const getBloodRequestResponseById = catchAsync(
	async (req: Request, res: Response) => {
		const user =  (req as any).user as IAuthUser;

		const id = req.params.id;
		const data = await PatientService.getBloodRequestResponseById(
			id as string,
			user,
		);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Blood Request Retrived Successfull",
			data: data,
		});
	},
);

const confirmDonation = catchAsync(async (req: Request, res: Response) => {
	const user =  (req as any).user as IAuthUser;

	const id = req.params.id;
	console.log(id);
	const data = await PatientService.confirmDonation(id as string, user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Confirm Request Retrived Successfull",
		data: data,
	});
});
const gelAllBloodRequest = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;

	const data = await PatientService.gelAllBloodRequest(query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Blood Request Retrived Successfull",
		data: data,
	});
});

export const PatientController = {
	createBloodRequest,
	updateStatus,
	updateRequest,
	getMyBloodRequests,
	getBloodRequestResponseById,
	confirmDonation,
	gelAllBloodRequest,
};
