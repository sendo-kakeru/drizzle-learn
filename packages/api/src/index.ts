import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { taskTable } from "@repo/db/schema/task";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/tasks", async (c) => {
	const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
	const db = drizzle(DATABASE_URL);
	const tasks = await db.select().from(taskTable);
	return c.json(tasks);
});


export default app;
