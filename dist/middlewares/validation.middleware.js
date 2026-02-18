import { validationResult } from "express-validator";
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: "param" in err ? err.param : "unknown",
                message: err.msg,
            })),
        });
    }
    next();
};
//# sourceMappingURL=validation.middleware.js.map