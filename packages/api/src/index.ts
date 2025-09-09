import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { usersTable } from "./db/schema";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/users", async (c) => {
	const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
	const db = drizzle(DATABASE_URL);
	const users = await db.select().from(usersTable);
	return c.json(users);
});

app.post("/users", async (c) => {
	const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
	const db = drizzle(DATABASE_URL);
	await db.insert(usersTable).values({
		name: "John",
		age: 30,
		email: "john@example.com",
	} satisfies typeof usersTable.$inferInsert);

	return c.json({ message: "ok" });
});

export default app;
