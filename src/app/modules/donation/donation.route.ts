import { Router } from "express";
import { DonationController } from "./donation.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route=Router()

route.post("/create-donation",auth(Role.ADMIN,Role.DONOR,Role.PATIENT),DonationController.createDonation)

route.get("/bkash/payment/callback",DonationController.bkashCallback)

export const DonationRoute=route