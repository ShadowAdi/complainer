import { logger } from "../config/logger.js";
export const HealthController = async (request, response) => {
    logger.info(`Health Route is working.`);
    console.log(`Health Route is working.`);
    return response.status(200).json({
        success: true,
        message: "Health API is working"
    });
};
//# sourceMappingURL=health.controller.js.map