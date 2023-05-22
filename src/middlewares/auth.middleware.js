import { db } from "../database/database.connections.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export async function authorization(req, res, next) {
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");
	if (!token) return res.status(401).send("Token não encontrado!");
	try {
		const userInfo = jwt.verify(token, "Minha_Chave");
		const user = await db.query(`SELECT * FROM sessions WHERE "userId"=$1 AND token=$2`, [
			userInfo.id,
			token,
		]);
		if (user.rowCount === 0) return res.status(401).send("Token expirado ou inválido");
		res.locals.user = userInfo;

		next();
	} catch (err) {
		if (err.message === "jwt malformed") return res.status(401).send("Token Inválido");
		if (err.message === "jwt expired") return res.status(401).send("Token Expirado");
		res.status(500).send(err.message);
	}
}
