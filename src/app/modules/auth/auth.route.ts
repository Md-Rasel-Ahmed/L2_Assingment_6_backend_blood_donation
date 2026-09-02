import { Router } from "express";
import { AuthController } from "./auth.controller";

const route=Router()

route.post("/singup",AuthController.singup)
route.post("/login",AuthController.login)

export const AuthRoute=route