import { Router } from "express";
import { DonorController } from "./donor.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDonorZodSchema } from "./donor.validation";

const route=Router()

route.get("/donation-history",auth(Role.DONOR),DonorController.getMyDonationHistories)
route.post("/donor-profile",validateRequest(createDonorZodSchema),auth(Role.DONOR),DonorController.createDonorProfile)
route.post("/bloodRequest/:id/accept",auth(Role.DONOR),DonorController.acceptedRequest)
route.patch("/donor-profile/availability/:id",auth(Role.DONOR),DonorController.updateAvailability)
route.patch("/donor-profile",auth(Role.DONOR),DonorController.updateDonationProfile)


export const DonorRoute=route