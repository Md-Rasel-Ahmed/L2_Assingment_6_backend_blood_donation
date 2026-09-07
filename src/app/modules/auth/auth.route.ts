import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, loginUserZodSchema } from "./auth.validation";
import passport from "passport";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post(
	"/singup",
	validateRequest(createUserZodSchema),
	AuthController.singup,
);
route.post("/login", validateRequest(loginUserZodSchema), AuthController.login);
route.post("/verify-email", AuthController.emailVerify);
route.post("/sent-otp", AuthController.sendOtp);
route.post("/forgot-password",auth(Role.ADMIN,Role.PATIENT,Role.DONOR),AuthController.forgotPassword);
route.post("/reset-password",auth(Role.ADMIN,Role.PATIENT,Role.DONOR), AuthController.resetPassword);
route.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
route.get(
  "/google/login/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  AuthController.googleCallback
);

export const AuthRoute = route;
