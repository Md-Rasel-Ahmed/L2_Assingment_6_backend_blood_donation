import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, loginUserZodSchema } from "./auth.validation";

const route=Router()

route.post("/singup",validateRequest(createUserZodSchema),AuthController.singup)
route.post("/login",validateRequest(loginUserZodSchema),AuthController.login)
route.post("/verify-email",AuthController.emailVerify)
route.post("/sent-otp",AuthController.sendOtp)
route.post("/forgot-password",AuthController.forgotPassword)
route.post("/reset-password",AuthController.resetPassword)

export const AuthRoute=route