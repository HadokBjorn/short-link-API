import { Router } from "express";
import { createShortUrl } from "../controllers/links.controller.js";
import { authorization } from "../middlewares/auth.middleware.js";

const linksRouter = Router();

linksRouter.post("/urls/shorten", authorization, createShortUrl);

export default linksRouter;
