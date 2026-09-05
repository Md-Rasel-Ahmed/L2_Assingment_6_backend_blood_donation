import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	bak_url: process.env.APP_URL,
	frontend_url: process.env.FRONTEND_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
	radis_password:process.env.REDIS_PASSWORD,
	radis_name:process.env.REDIS_NAME,
	smtp_password:process.env.SMTP_PASSWORD,
	smtp_username:process.env.SMTP_USERNAME,
	bkash_base_url:process.env.BKASH_BASE_RUL!,
	bkash_username:process.env.BKASH_USERNAME!,
	bkash_password:process.env.BKASH_PASSWORD!,
	bkash_app_key:process.env.BKASH_APP_KEY!,
	bkash_app_secret_key:process.env.BKASH_SECRET_KEY!,

};
