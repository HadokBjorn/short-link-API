import { db } from "../database/database.connections.js";
import { nanoid } from "nanoid";

export async function createShortUrl(req, res) {
	const { id } = res.locals.user;
	const { url } = req.body;
	const shortUrl = nanoid(10);
	try {
		await db.query(`INSERT INTO links("userId","shortUrl", url) VALUES ($1,$2,$3)`, [
			id,
			shortUrl,
			url,
		]);

		const response = await db.query(`SELECT id, "shortUrl" FROM links WHERE "shortUrl"=$1;`, [
			shortUrl,
		]);

		res.status(201).send(response.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function getUrlById(req, res) {
	const { id } = req.params;
	try {
		const response = await db.query(`SELECT id, "shortUrl", url FROM links WHERE id=$1;`, [
			Number(id),
		]);
		if (response.rowCount === 0) return res.sendStatus(404);

		res.status(200).send(response.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function openUrl(req, res) {
	const { shortUrl } = req.params;
	try {
		const response = await db.query(`SELECT id, url, visits FROM links WHERE "shortUrl"=$1;`, [
			shortUrl,
		]);
		if (response.rowCount === 0) return res.sendStatus(404);
		const { id, url, visits } = response.rows[0];
		let visit = visits;
		await db.query(`UPDATE links SET visits=$1 WHERE id=$2`, [(visit += 1), id]);
		res.redirect(url);
	} catch (err) {
		res.status(500).send(err.message);
	}
}
