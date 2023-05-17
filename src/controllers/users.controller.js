import { db } from "../database/database.connections.js";

export async function signup(req, res) {
	const { name, email, password, confirmPassword } = req.body;
	try {
		await db.query(
			`INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1,$2,$3,$4)`,
			[name, email, password, confirmPassword]
		);
		res.sendStatus(201);
	} catch (err) {
		if (err.code === "23505") return res.sendStatus(409);
		res.status(500).send(err.message);
	}
}
