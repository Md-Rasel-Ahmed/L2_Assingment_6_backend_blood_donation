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
route.post("/logout",auth(Role.ADMIN,Role.PATIENT,Role.DONOR),AuthController.logout)
route.post("/verify-email", AuthController.emailVerify);
route.post("/sent-otp", AuthController.sendOtp);
route.post("/forgot-password",AuthController.forgotPassword);
route.post("/refresh-token", AuthController.refreshToken);
route.post("/reset-password", AuthController.resetPassword);
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
    failureRedirect: "http://localhost:3000/login?status=error&message=Google authentication failed",
  }),
  AuthController.googleCallback
);

export const AuthRoute = route;
