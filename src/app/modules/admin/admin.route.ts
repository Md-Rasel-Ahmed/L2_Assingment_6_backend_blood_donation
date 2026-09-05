import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const route=Router()

route.get("/allUsers",auth(Role.ADMIN),AdminController.getUsers)
route.get("/allDonor",auth(Role.ADMIN),AdminController.getAllDonor)
route.get("/blood-requests",auth(Role.ADMIN),AdminController.getAllRequest)
route.patch("/user-status",auth(Role.ADMIN),AdminController.updateUserStaus)
route.delete("/users/:email",auth(Role.ADMIN),AdminController.deleteUser)
route.delete("/matching-requests/:id",auth(Role.ADMIN),AdminController.deleteFakeBloodRequest)


export const AdminRoute=route