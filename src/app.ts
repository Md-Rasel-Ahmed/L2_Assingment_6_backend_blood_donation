import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type NextFunction,
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { AuthRoute } from "./app/modules/auth/auth.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { PatientRoute } from "./app/modules/patient/patient.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth",AuthRoute)
app.use("/api/v1/patient",PatientRoute)

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Blood Donation System Backend",
	});
});

app.use(globalErrorHandler)

export default app;
