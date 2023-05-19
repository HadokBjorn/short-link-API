import { Router } from "express";
import usersRouter from "./users.router.js";
import linksRouter from "./links.router.js";

const routers = Router();

routers.use(usersRouter);
routers.use(linksRouter);

export default routers;
