import { Router, type Router as RouterType } from "express";
import { HealthController } from "../controllers/health.controller.js";

export const healthRouter: RouterType = Router()

healthRouter.get("/", HealthController)