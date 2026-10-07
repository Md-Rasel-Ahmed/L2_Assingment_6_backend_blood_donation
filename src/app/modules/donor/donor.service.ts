import { RequestStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import type { IRequestUser } from "../user/user.interface";
import { subMonths, isBefore } from "date-fns";
import type { ICreateDonor } from "./donor.interface";

const createDonorProfile = async (
	payload: ICreateDonor,
	user: IRequestUser,
) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
		include: { donor: true },
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Donor Profile Not Founded!");
	}
	if(isExistDonor.status === "PENDING_VERIFICATION"){
		throw new AppError(httpStatus.BAD_REQUEST, "You Cannot Create Donor Profile Now,Wait For Admin Verified");
	}
	if(isExistDonor.status === "SUSPENDED"){
		throw new AppError(httpStatus.FORBIDDEN, "You Cannot Create Donor Profile Because You Are SUSPENDED");
	}
	if (isExistDonor.donor?.userId === isExistDonor.id) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You Have Already Donor Profile",
		);
	}
	const donorProfile = await prisma.donor.create({
		data: {
			bloodGroup: payload.bloodGroup,
			userId: isExistDonor.id,
			lastDonatedAt: payload.lastDonatedAt,
			totalDonations: payload.totalDonations,
		},
		include: {
			user: true,
		},
	});
	return donorProfile;
};

const getMyDonationHistories = async (user: IRequestUser) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Donor Profile Not Founded!");
	}
	
	const getDonatons = await prisma.requestResponse.findMany({
		where: {
			donorId: isExistDonor.id,
		},
		include: {
			request: true,
		},
	});

	return getDonatons;
};

const updateAvailability = async (
	id: string,
	payload: { isAvailable: boolean },
	user: IRequestUser,
) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
		include: {
			donor: true,
		},
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Donor Profile Not Founded!");
	}
	if(isExistDonor.status === "PENDING_VERIFICATION"){
		throw new AppError(httpStatus.BAD_REQUEST, "You Cannot Update Availability Now,Wait For Admin Verified");
	}
	if(isExistDonor.status === "SUSPENDED"){
		throw new AppError(httpStatus.FORBIDDEN, "You Cannot Update Availability Because You Are SUSPENDED");
	}
	// donor cannot update availabilty last donation date gather then or equal 3 month

	if (payload.isAvailable === true) {
		const targetDate = isExistDonor.donor?.lastDonatedAt;
		if (!targetDate) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"Last Donation Date Is Required!",
			);
		}
		const now = new Date();
		const threeMonthAgo = subMonths(now, 3);

		const isThreeMonthBefore = isBefore(targetDate, threeMonthAgo);

		if (!isThreeMonthBefore) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Your Last Donation Must Be Gratter Then Or Equel 3 Month",
			);
		}

		await prisma.donor.update({
			where: {
				id: id,
			},
			data: {
				isAvailable: true,
			},
		});
	}

	if (payload.isAvailable === false) {
		await prisma.donor.update({
			where: { id: id },
			data: { isAvailable: false },
		});
	}
};

const updateDonationProfile = async (
	paylaod: ICreateDonor,
	user: IRequestUser,
) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
		include: {
			donor: true,
		},
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Donor Profile Not Founded!");
	}

		if(isExistDonor.status === "PENDING_VERIFICATION"){
		throw new AppError(httpStatus.BAD_REQUEST, "You Cannot Update Donation Profile Now,Wait For Admin Verified");
	}
	if(isExistDonor.status === "SUSPENDED"){
		throw new AppError(httpStatus.FORBIDDEN, "You Cannot Update Donation Profile Because You Are SUSPENDED");
	}

	const updatedProfile = await prisma.donor.update({
		where: {
			userId: isExistDonor.id,
		},
		data: {
			...paylaod,
		},
	});
	return updatedProfile;
};

const acceptedRequest = async (id: string, user: IRequestUser) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
		include: {
			donor: true,
		},
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Founded!");
	}

		if(isExistDonor.status === "PENDING_VERIFICATION"){
		throw new AppError(httpStatus.BAD_REQUEST, "You Cannot Accepet Request Now,Wait For Admin Verified");
	}
	if(isExistDonor.status === "SUSPENDED"){
		throw new AppError(httpStatus.FORBIDDEN, "You Cannot Accepet Request Because You Are SUSPENDED");
	}
	const findRequested = await prisma.bloodRequest.findUnique({
		where: { id },
		include: { responses: true },
	});
	// check blood request pending or not
	if (findRequested?.status === RequestStatus.PENDING) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Blood Request Is Not Verified Yet,Try After Accepted",
		);
	}
	//    check is fullfield or not blood Requested status
	if (findRequested?.status === RequestStatus.FULFILLED) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Blood Request Already Fulfilled",
		);
	}

	if (!isExistDonor.donor?.userId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You Don,t Have Donor Profile First Create Donor Profile",
		);
	}

	const isAlreadyApplied = findRequested?.responses.find(
		(r) => r.donorId === isExistDonor.id,
	);

	if (isAlreadyApplied) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Alredy Applied On This Request",
		);
	}

	//    Check Blood group same or not
	if (isExistDonor.donor?.bloodGroup !== findRequested?.bloodGroup) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Your Blood Group And Patient Blood Group Is Not Same",
		);
	}
	// check last donation date
	const targetDate = isExistDonor.donor?.lastDonatedAt;
	if (!targetDate) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Last Donation Date Is Required!",
		);
	}
	const now = new Date();
	const threeMonthAgo = subMonths(now, 3);

	const isThreeMonthBefore = isBefore(targetDate, threeMonthAgo);

	if (!isThreeMonthBefore) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Your Last Donation Must Be Gratter Then Or Equel 3 Month",
		);
	}

	const acceptRequest = await prisma.requestResponse.create({
		data: {
			donorId: isExistDonor.id,
			requestId: findRequested?.id as string,
		},
	});
};

const getActiveMatchingRequested = async (user: IRequestUser) => {
	const isExistDonor = await prisma.user.findUnique({
		where: {
			email: user.email,
			role: Role.DONOR,
		},
		include: {
			donor: true,
		},
	});

	if (!isExistDonor || isExistDonor.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Founded!");
	}

	const matchedRequest = await prisma.bloodRequest.findMany({
		where: {
			// district: isExistDonor.district as string,
			bloodGroup: isExistDonor.donor?.bloodGroup,
			status: "ACCEPTED",
		},
		include:{
			patient:true
		}
	});
	return matchedRequest;
};

export const DonorService = {
	getMyDonationHistories,
	getActiveMatchingRequested,
	updateAvailability,
	updateDonationProfile,
	acceptedRequest,
	createDonorProfile,
};
