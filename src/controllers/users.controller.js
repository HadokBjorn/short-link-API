import { db } from "../database/database.connections.js";

export async function signup(req, res) {
	const { name, email, password } = req.body;
	try {
		await db.query(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3)`, [
			name,
			email,
			password,
		]);
		res.sendStatus(201);
	} catch (err) {
		if (err.code === "23505") return res.sendStatus(409);
		res.status(500).send(err.message);
	}
}
