import { db } from "../database/database.connections.js";

export async function createShortUrl(req, res) {
	const { id, name } = res.locals.user;
	try {
		res.send({ id, name });
	} catch (err) {
		res.status(500).send(err.message);
	}
}
