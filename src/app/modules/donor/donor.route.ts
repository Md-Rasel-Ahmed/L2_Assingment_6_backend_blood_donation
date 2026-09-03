import { Router } from "express";
import { DonorController } from "./donor.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route=Router()

route.get("/histry",()=>{})
route.get("/bloodRequest/:id/accept",auth(Role.DONOR),DonorController.acceptedRequest)


export const DonorRoute=route