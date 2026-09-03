import { Router } from "express";
import { DonorController } from "./donor.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDonorZodSchema } from "./donor.validation";

const route=Router()

route.get("/histry",()=>{})
route.post("/donor-profile",validateRequest(createDonorZodSchema),auth(Role.DONOR),DonorController.createDonorProfile)
route.post("/bloodRequest/:id/accept",auth(Role.DONOR),DonorController.acceptedRequest)


export const DonorRoute=route