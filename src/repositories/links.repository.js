import { db } from "../database/database.connections.js";
export function createShortLinkDB(body) {
	const { id, shortUrl, url } = body;
	return db.query(`INSERT INTO links("userId","shortUrl", url) VALUES ($1,$2,$3)`, [
		id,
		shortUrl,
		url,
	]);
}
export function responseShortUrlDB(shortUrl) {
	return db.query(`SELECT id, "shortUrl" FROM links WHERE "shortUrl"=$1;`, [shortUrl]);
}
export function urlByIdDB(id) {
	return db.query(`SELECT id, "shortUrl", url FROM links WHERE id=$1;`, [Number(id)]);
}
export function urlWithVisitsDB(shortUrl) {
	return db.query(`SELECT id, url, visits FROM links WHERE "shortUrl"=$1;`, [shortUrl]);
}
export function urlIncrementVisitsDB(visit, id) {
	return db.query(`UPDATE links SET visits=$1 WHERE id=$2`, [(visit += 1), id]);
}
export function deleteLinkDB(body) {
	const { id, userId } = body;
	return db.query(`DELETE FROM links WHERE id=$1 AND "userId"=$2;`, [Number(id), Number(userId)]);
}
