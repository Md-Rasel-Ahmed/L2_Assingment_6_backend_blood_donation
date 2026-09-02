import { Router } from "express";
import { AuthController } from "./auth.controller";

const route=Router()

route.post("/singup",AuthController.singup)

export const AuthRoute=route