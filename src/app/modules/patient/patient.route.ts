import { Router } from "express";
import { PatientController } from "./patient.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route=Router()

route.post("/bloodRequiest",auth("PATIENT"),PatientController.createBloodRequest)
route.patch("/bloodRequiest",auth("PATIENT"),PatientController.updateStatus)
route.get("/bloodRequiest/all-request",auth("PATIENT"),PatientController.getAllBloodRequest)
route.patch("/bloodRequiest/:id",auth("PATIENT"),PatientController.updateRequest)
route.get("/bloodRequiest/:id",auth("PATIENT"),PatientController.getBloodRequestResponseById)

export const PatientRoute=route