import express, { Express } from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors.js";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware.js";
import { healthRouter } from "./routes/health.route.js";
import { authRouter } from "./routes/auth.route.js";


const app: Express = express()

app.use(helmet())
CorsConfig(app)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.get('/', (_req, res) => {
    res.json({
        service: 'complainer-backend',
        status: 'running',
        version: '2.1.0',
        features: {
        },
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
        }
    });
});

app.use(CustomErrorHandler)

export default app