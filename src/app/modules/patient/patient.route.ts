import { Router } from "express";
import { PatientController } from "./patient.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route=Router()

route.post("/blood-requests",auth("PATIENT"),PatientController.createBloodRequest)
route.post("/blood-requests/:id/confirm-donation",auth("PATIENT"),PatientController.confirmDonation)
route.patch("/blood-requests/:id/status",auth("PATIENT"),PatientController.updateStatus)
route.get("/my-requests",auth("PATIENT"),PatientController.getMyBloodRequests)
route.patch("/bloodRequiest/:id",auth("PATIENT"),PatientController.updateRequest)
route.get("/blood-requests/:id/responses",auth("PATIENT"),PatientController.getBloodRequestResponseById)

export const PatientRoute=route