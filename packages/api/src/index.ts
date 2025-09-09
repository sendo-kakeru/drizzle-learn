import { vValidator } from "@hono/valibot-validator";
import {
	type CreateTaskResponseBody,
	createTaskRequestBodySchema,
	type DeleteTaskResponseBody,
	deleteTaskRequestParamsSchema,
	type GetTaskResponseBody,
	type GetTasksResponseBody,
	getTaskRequestParamsSchema,
	taskTable,
	type UpdateTaskResponseBody,
	updateTaskRequestBodySchema,
	updateTaskRequestParamsSchema,
} from "@repo/db/schema/task";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import type { HttpRespondReturn } from "../types";
import { routeValidateCallback } from "./libs/validation";

type Env = {
	DATABASE_URL: string;
};

const app = new Hono()
	.onError((error, c): HttpRespondReturn => {
		if (error instanceof HTTPException) {
			return c.json({ message: error.message }, error.status);
		}
		return c.json({ message: "Internal Server Error" }, 500);
	})
	.get(
		"/tasks",
		async (c): Promise<HttpRespondReturn<GetTasksResponseBody>> => {
			const { DATABASE_URL } = env<Env>(c);
			const db = drizzle(DATABASE_URL);

			const tasks = await db.select().from(taskTable);
			return c.json(tasks);
		},
	)
	.post(
		"/tasks",
		vValidator("json", createTaskRequestBodySchema, routeValidateCallback),
		async (c): Promise<HttpRespondReturn<CreateTaskResponseBody>> => {
			const { DATABASE_URL } = env<Env>(c);
			const db = drizzle(DATABASE_URL);

			const { title, description } = c.req.valid("json");

			const [createdTask] = await db
				.insert(taskTable)
				.values({ title, description })
				.returning({ id: taskTable.id });
			return c.json(createdTask, 201);
		},
	)
	.get(
		"/tasks/:id",
		vValidator("param", getTaskRequestParamsSchema, routeValidateCallback),
		async (c): Promise<HttpRespondReturn<GetTaskResponseBody>> => {
			const { DATABASE_URL } = env<Env>(c);
			const db = drizzle(DATABASE_URL);

			const { id } = c.req.valid("param");
			const [task] = await db
				.select()
				.from(taskTable)
				.where(eq(taskTable.id, id));

			if (!task) throw new HTTPException(404, { message: "Task not found" });

			return c.json(task);
		},
	)
	.patch(
		"/tasks/:id",
		vValidator("param", updateTaskRequestParamsSchema, routeValidateCallback),
		vValidator("json", updateTaskRequestBodySchema, routeValidateCallback),
		async (c): Promise<HttpRespondReturn<UpdateTaskResponseBody>> => {
			const { DATABASE_URL } = env<Env>(c);
			const db = drizzle(DATABASE_URL);

			const { id } = c.req.valid("param");
			const [updatedTask] = await db
				.update(taskTable)
				.set(c.req.valid("json"))
				.where(eq(taskTable.id, id))
				.returning();

			if (!updatedTask)
				throw new HTTPException(404, { message: "Task not found" });

			return c.json({ id: updatedTask.id });
		},
	)
	.delete(
		"/tasks/:id",
		vValidator("param", deleteTaskRequestParamsSchema, routeValidateCallback),
		async (c): Promise<HttpRespondReturn<DeleteTaskResponseBody>> => {
			const { DATABASE_URL } = env<Env>(c);
			const db = drizzle(DATABASE_URL);

			const { id } = c.req.valid("param");
			const [deletedTask] = await db
				.delete(taskTable)
				.where(eq(taskTable.id, id))
				.returning();

			if (!deletedTask)
				throw new HTTPException(404, { message: "Task not found" });

			return c.json({ id: deletedTask.id });
		},
	);

export default app;
