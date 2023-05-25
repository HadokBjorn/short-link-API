import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { deleteSessionByTokenDB, userByEmailDB } from "../repositories/users.repository.js";

dotenv.config();

export async function validateLogin(req, res, next) {
	const { email, password } = req.body;
	try {
		const user = await userByEmailDB(email);
		if (user.rowCount === 0) return res.sendStatus(401);
		const correctPassword = bcrypt.compareSync(password, user.rows[0].password);
		if (!correctPassword) return res.sendStatus(401);
		const { id, name } = user.rows[0];
		const oneHour = 3600; //seconds
		const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: oneHour });
		await deleteSessionByTokenDB(id, token);

		res.locals.infos = { id, token, name };

		next();
	} catch (err) {
		res.status(500).send(err.message);
	}
}
/* 
Na hora do login setar a sessão anterior do usuário como: online = false;
registrar o token com validade de 1 hora;
fazer função de logout;
*/
