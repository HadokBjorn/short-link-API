import { nanoid } from "nanoid";
import {
	createShortLinkDB,
	deleteLinkDB,
	responseShortUrlDB,
	urlByIdDB,
	urlIncrementVisitsDB,
	urlWithVisitsDB,
} from "../repositories/links.repository.js";

export async function createShortUrl(req, res) {
	const { id } = res.locals.user;
	const { url } = req.body;
	const shortUrl = nanoid(10);
	try {
		await createShortLinkDB({ id, url, shortUrl });
		const response = await responseShortUrlDB(shortUrl);
		res.status(201).send(response.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function getUrlById(req, res) {
	const { id } = req.params;
	try {
		const response = await urlByIdDB(id);
		if (response.rowCount === 0) return res.sendStatus(404);

		res.status(200).send(response.rows[0]);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function openUrl(req, res) {
	const { shortUrl } = req.params;
	try {
		const response = await urlWithVisitsDB(shortUrl);
		if (response.rowCount === 0) return res.sendStatus(404);
		const { id, url, visits } = response.rows[0];
		let visit = visits;
		await urlIncrementVisitsDB({ visit, id });
		res.redirect(url);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function deleteUrlById(req, res) {
	const { id } = req.params;
	const userId = res.locals.user.id;
	try {
		const itemToDelete = await urlByIdDB(id);
		if (itemToDelete.rowCount === 0) return res.sendStatus(404);

		const deleted = await deleteLinkDB({ id, userId });
		if (deleted.rowCount === 0) return res.sendStatus(401);

		res.sendStatus(204);
	} catch (err) {
		res.status(500).send(err.message);
	}
}
