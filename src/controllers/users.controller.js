import { db } from "../database/database.connections.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

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

export async function logout(req, res) {
	const { id } = res.locals.user;
	try {
		await db.query(
			`UPDATE sessions SET online=false, logout=$1 WHERE "userId"=$2 AND online=true;`,
			[dayjs().format("YYYY-MM-DD HH:mm:ss.ssssss"), Number(id)]
		);
		res.send("Usuário desconectado");
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function getInfosUser(req, res) {
	const { id } = res.locals.user;
	try {
		const userInfo = await db.query(
			`SELECT users.id, users.name, SUM(links.visits) AS "visitCount",
			json_agg(json_build_object('id',links.id, 'url', links.url, 'shortUrl',links."shortUrl",'visitCount',links.visits))
			AS "shortenedUrls"
			FROM users JOIN links ON links."userId"=$1
			AND users.id=$1 GROUP BY (users.id);`,
			[Number(id)]
		);
		if (userInfo.rowCount === 0) return res.sendStatus(404);
		res.status(200).send(userInfo.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}
