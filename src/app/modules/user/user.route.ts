import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { UsersController } from "./user.controller";

const route =Router()

route.get("/get-me",auth(Role.ADMIN,Role.DONOR,Role.PATIENT),UsersController.getMe)

export const UserRouter=route