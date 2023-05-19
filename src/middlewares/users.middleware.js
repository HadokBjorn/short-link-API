import bcrypt from "bcrypt";
import { db } from "../database/database.connections.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function validateLogin(req, res, next) {
	const { email, password } = req.body;
	try {
		const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
		if (user.rowCount === 0) return res.sendStatus(401);
		const correctPassword = bcrypt.compareSync(password, user.rows[0].password);
		if (!correctPassword) return res.sendStatus(401);
		const { id, name } = user.rows[0];
		const token = jwt.sign({ id, name }, process.env.JWT_SECRET);
		res.locals.infos = { id, token };
		next();
	} catch (err) {
		res.status(500).send(err.message);
	}
}
