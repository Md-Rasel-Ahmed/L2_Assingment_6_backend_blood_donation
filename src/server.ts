import app from "./app";
import config from "./app/config";
import { transporter } from "./app/lib/nodemailer";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/radis";


const PORT = config.port;

const main = async () => {
	try {
		await prisma.$connect();
       console.log("Database Connected Successfull");

	   await redisClient.connect()
	   console.log("Radis Connected successfull");

	   await transporter.verify()
	   console.log("Nodemailer Connected Successfull");
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
};

main();
