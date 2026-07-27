import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 1000, 30000); // 1s, 2s, 3s... capped at 30s
    console.log(`Redis retry attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err) => {
    // Stop hammering if it's an auth/quota error, not a transient network blip
    if (err.message.includes("max requests limit exceeded")) {
      console.error("Redis quota exceeded — stopping reconnect attempts");
      return false; // don't reconnect automatically on this error
    }
    return true;
  },
});

export default connection;