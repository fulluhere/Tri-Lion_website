// Tri-Lion\online-compiler\src\config\redis.js

export const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  ...(process.env.REDIS_TLS === "true" ? { tls: {} } : {}),

  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 1000, 30000); // 1s, 2s, 3s... capped at 30s
    console.log(`Redis retry attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err) => {
    if (err.message.includes("max requests limit exceeded")) {
      console.error("Redis quota exceeded — pausing reconnect attempts");
      return false;
    }
    return true;
  },
};