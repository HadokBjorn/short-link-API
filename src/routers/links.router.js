import { Router } from "express";
import { createShortUrl, getUrlById } from "../controllers/links.controller.js";
import { authorization } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../schemas/links.schema.js";

const linksRouter = Router();

linksRouter.post("/urls/shorten", validateSchema(urlSchema), authorization, createShortUrl);
linksRouter.get("/urls/:id", getUrlById);

export default linksRouter;
