
import { createClient } from "redis";
import config from "../config";

export const redisClient = createClient({
  username: config.radis_name,
  password: config.radis_password,
 socket: {
        host: 'powder-friend-trick-28269.db.redis.io',
        port: 18367
    }
});
