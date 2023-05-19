import { db } from "../database/database.connections.js";
import bcrypt from "bcrypt";

export async function signup(req, res) {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	try {
		await db.query(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3)`, [
			name,
			email,
			hash,
		]);
		res.sendStatus(201);
	} catch (err) {
		if (err.code === "23505") return res.sendStatus(409);
		res.status(500).send(err.message);
	}
}

export async function login(req, res) {
	try {
		const { id, token } = res.locals.infos;
		await db.query(`INSERT INTO sessions ("userId") VALUES ($1)`, [id]);
		res.status(200).send({ token: token });
	} catch (err) {
		res.status(500).send(err.message);
	}
}
