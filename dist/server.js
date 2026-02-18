import express from "express";
import helmet from "helmet";
import { CorsConfig } from "./config/cors.js";
import { CustomErrorHandler } from "./middlewares/custom-error.middleware.js";
import { healthRouter } from "./routes/health.route.js";
import { authRouter } from "./routes/auth.route.js";
import { complaintRouter } from "./routes/complaint.route.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./utils/uploadthing.js";
import { UPLOADTHING_API_KEY } from "./config/dotenv.js";
const app = express();
app.use(helmet());
CorsConfig(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// UploadThing routes
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
    config: {
        token: UPLOADTHING_API_KEY,
    },
}));
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/complaints", complaintRouter);
app.get('/', (_req, res) => {
    res.json({
        service: 'complainer-backend',
        status: 'running',
        version: '2.1.0',
        features: {},
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            complaints: '/api/complaints',
        }
    });
});
app.use(CustomErrorHandler);
export default app;
//# sourceMappingURL=server.js.map