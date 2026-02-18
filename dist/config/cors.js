import cors from "cors";
import { CLIENT_URL } from "./dotenv.js";
import { logger } from "./logger.js";
export const CorsConfig = (app) => {
    try {
        app.use(cors({
            origin: CLIENT_URL,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }));
    }
    catch (error) {
        console.error("CORS config failed: ", error);
        logger.error(`CORS config failed: ${error}`);
    }
};
//# sourceMappingURL=cors.js.map