import bcrypt from "bcrypt";
import {
	createSessionDB,
	createUserDB,
	deleteSessionDB,
	userLinksInfoDB,
	usersRankingDB,
} from "../repositories/users.repository.js";

export async function signup(req, res) {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	try {
		await createUserDB({ name, email, hash });
		res.sendStatus(201);
	} catch (err) {
		if (err.code === "23505") return res.sendStatus(409);
		res.status(500).send(err.message);
	}
}

export async function login(req, res) {
	try {
		const { id, token } = res.locals.infos;
		await createSessionDB({ id, token });
		res.status(200).send({ token: token });
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function logout(req, res) {
	const { id } = res.locals.user;
	try {
		await deleteSessionDB(id);
		res.send("Usuário desconectado");
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function getInfosUser(req, res) {
	const { id } = res.locals.user;
	try {
		const userInfo = await userLinksInfoDB(id);
		if (userInfo.rowCount === 0) return res.status(404).send("Você ainda não possui links");
		res.status(200).send(userInfo.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function getRanking(req, res) {
	try {
		const ranking = await usersRankingDB();
		if (ranking.rowCount === 0) return res.sendStatus(404);
		res.status(200).send(ranking.rows);
	} catch (err) {
		res.status(500).send(err.message);
	}
}
