export const config = {
    expressPort: process.env.SERVER_PORT ?? 8080,
    websocketPort: process.env.WS_PORT ?? 8081,
    redisHost: process.env.REDIS_HOST ?? 'localhost',
    redisPort: process.env.REDIS_PORT ?? 6379,
}