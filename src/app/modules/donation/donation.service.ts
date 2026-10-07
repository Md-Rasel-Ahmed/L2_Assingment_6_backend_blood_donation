import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRequestUser } from "../user/user.interface";
import httpStatus from "http-status";

const createDonationPayment = async (user: IRequestUser,amount:number) => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		const idToken = await getBkashIdToken();
		// console.log(idToken,"from crate payment");
		const response = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					authorization: idToken as string,
					"x-app-key": config.bkash_app_key,
				},
				body: JSON.stringify({
					agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
					mode: "0011",
					payerReference: "01723888888",
					callbackURL:
						"https://assingment-6-delta.vercel.app/api/v1/donation/bkash/payment/callback",
					merchantAssociationInfo: "MI05MID54RF09123456One",
					amount: amount,
					currency: "BDT",
					intent: "sale",
					merchantInvoiceNumber: user.userId,
				}),
			},
		);
		const result = await response.json();

		await tx.payment.create({
			data: {
				amount: amount,
				merchantInvoiceNumber: result.merchantInvoiceNumber,
				gatewayResponse: result,
				payerReference: user.email,
				paymentID: result.paymentID,
				userId: user.userId,
			},
		});
		return result;
		
	},{
    
      timeout: 15000, 
    });
	return transactionResult;
};

const paymentCallback = async (query: Record<string, any>) => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		const { paymentID, status } = query;

		if (!paymentID) {
			throw new AppError(httpStatus.NOT_FOUND, "Payment Id Missing");
		}
		if (!status) {
			throw new AppError(httpStatus.NOT_FOUND, "Payment Status Missing");
		}

		const bkashIdToken = await getBkashIdToken();
		const response = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					authorization: bkashIdToken as string,
					"x-app-key": config.bkash_app_key,
				},
				body: JSON.stringify({
					paymentID,
				}),
			},
		);
		if (!response.ok) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Excute Payment Failed",
			);
		}
		const result = await response.json();
          console.log(result);
		if (status === "success") {
			await tx.payment.update({
				where: {
					paymentID,
				},
				data: {
					trxID: result.trxID,
					status: "COMPLETED",
					paidAT: result.paymentExecuteTime,
				},
			});
			return {
				redirectURL: `${config.frontend_url}/donation/paymentStatus/?status=success&trxID=${result.trxID}&amont=${result.amount}`,
			};
		}
		if (status === "failure") {
			return {
				redirectURL: `${config.frontend_url}/donation/paymentStatus/?status=failure`,
			};
		}
		if (status === "cancel") {
			return {
				redirectURL: `${config.frontend_url}/donation/paymentStatus/?status=cancel`,
			};
		} else {
			throw new AppError(httpStatus.BAD_REQUEST, "Excute Payment Failed");
		}
	});
	return transactionResult;
};
const getMyPayments = async (user: IRequestUser) => {
	const payments = await prisma.payment.findMany({
		where: {
			userId: user.userId,
		},
	});
	return payments;
};
export const DonationService = {
	createDonationPayment,
	paymentCallback,
	getMyPayments,
};
