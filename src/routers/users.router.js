import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { loginSchema, signupSchema } from "../schemas/users.schema.js";
import { login, signup } from "../controllers/users.controller.js";
import { validateLogin } from "../middlewares/users.middleware.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSchema(signupSchema), signup);
usersRouter.post("/signin", validateSchema(loginSchema), validateLogin, login);

export default usersRouter;
