import { db } from "../database/database.connections.js";
export function createUserDB(body) {
	const { name, email, hash } = body;
	return db.query(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3)`, [
		name,
		email,
		hash,
	]);
}
export function createSessionDB(body) {
	const { id, token } = body;
	return db.query(`INSERT INTO sessions ("userId", token) VALUES ($1,$2)`, [id, token]);
}
export function deleteSessionDB(id) {
	return db.query(`DELETE FROM sessions WHERE "userId"=$1;`, [Number(id)]);
}
export function userLinksInfoDB(id) {
	return db.query(
		`SELECT users.id, users.name, SUM(links.visits) AS "visitCount",
        json_agg(json_build_object('id',links.id, 'url', links.url, 'shortUrl',links."shortUrl",'visitCount',links.visits))
        AS "shortenedUrls"
        FROM users JOIN links ON links."userId"=$1
        AND users.id=$1 GROUP BY (users.id);`,
		[Number(id)]
	);
}
export function usersRankingDB() {
	return db.query(
		`SELECT users.id, users.name, COUNT(links) AS "linksCount", SUM(links.visits) AS "visitCount"
        FROM users JOIN links ON links."userId"=users.id GROUP BY (users.id) LIMIT 10;`
	);
}
