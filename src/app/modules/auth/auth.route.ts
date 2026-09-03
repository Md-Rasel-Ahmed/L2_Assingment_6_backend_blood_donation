import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./auth.validation";

const route=Router()

route.post("/singup",validateRequest(createUserZodSchema),AuthController.singup)
route.post("/login",AuthController.login)

export const AuthRoute=route