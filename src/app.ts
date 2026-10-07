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
import { DonorRoute } from "./app/modules/donor/donor.route";
import { DonationRoute } from "./app/modules/donation/donation.route";
import { getBkashIdToken } from "./app/lib/bkash";
import { UserRouter } from "./app/modules/user/user.route";
import passport from "./app/lib/passport";
import { AdminRoute } from "./app/modules/admin/admin.route";


const app: Application = express();

app.use(
	cors({
		origin: [
    'https://donation-healthcare-frontend.vercel.app',
    'http://localhost:3000'
  ],
		// origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());


app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/patient", PatientRoute);
app.use("/api/v1/donor", DonorRoute);
app.use("/api/v1/donation", DonationRoute);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/admin",AdminRoute)

app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const grandIdToken = await getBkashIdToken();
		console.log(grandIdToken);
		res.send("Welcome to bkash inisialized");
	} catch (error) {
		next(error);
	}
});

// Basic route
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Blood Donation System Backend",
	});
});

app.use(globalErrorHandler);

export default app;
