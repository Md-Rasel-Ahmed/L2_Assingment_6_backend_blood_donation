import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { UsersController } from "./user.controller";
import upload from "../../lib/multer";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserDataSchema } from "./user.validation";

const route = Router();

route.get(
	"/get-me",
	auth(Role.ADMIN, Role.DONOR, Role.PATIENT),
	UsersController.getMe,
);

route.patch(
	"/edit-me",
	auth(Role.ADMIN, Role.DONOR, Role.PATIENT),
	upload.single("image"),
	UsersController.updateProfile,
);

export const UserRouter = route;
