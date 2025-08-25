// Redis config
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Read REDIS_URL from environment
const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;