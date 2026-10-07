import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const route = Router();

route.get("/all-users", auth(Role.ADMIN), AdminController.getUsers);
route.get("/blood-requests/:id",auth(Role.ADMIN,Role.PATIENT),AdminController.getBloodReqById)
route.get("/all-donor", auth(Role.ADMIN), AdminController.getAllDonor);
route.get("/blood-requests", auth(Role.ADMIN), AdminController.getAllRequest);
route.patch("/user-status", auth(Role.ADMIN), AdminController.updateUserStaus);
route.patch(
	"/blood-requests/:id",
	auth(Role.ADMIN),
	AdminController.verifyBloodReq,
);

route.delete("/users/:email", auth(Role.ADMIN), AdminController.deleteUser);
route.delete(
	"/blood-requests/:id",
	auth(Role.ADMIN),
	AdminController.deleteFakeBloodRequest,
);

export const AdminRoute = route;
