import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-valibot";
import * as v from "valibot";

export const taskTable = pgTable("task", {
	id: uuid().primaryKey().defaultRandom(),
	title: varchar({ length: 40 }).notNull(),
	description: varchar({ length: 255 }),
	isDone: boolean().default(false).notNull(),
});

// model
export const taskSchema = createSelectSchema(taskTable);
export type Task = v.InferOutput<typeof taskSchema>;

// find many
export const getTasksResponseBodySchema = v.array(taskSchema);
export type GetTasksResponseBody = v.InferOutput<
	typeof getTasksResponseBodySchema
>;

// find
export const getTaskRequestParamsSchema = v.pick(taskSchema, ["id"]);
export type GetTaskRequestParams = v.InferOutput<
	typeof getTaskRequestParamsSchema
>;
export const getTaskResponseBodySchema = createSelectSchema(taskTable);
export type GetTaskResponseBody = v.InferOutput<
	typeof getTaskResponseBodySchema
>;

// create
export const createTaskRequestBodySchema = v.pick(
	createInsertSchema(taskTable),
	["title", "description"],
);
export type CreateTaskRequestBody = v.InferOutput<
	typeof createTaskRequestBodySchema
>;
export const createTaskResponseBodySchema = v.pick(taskSchema, ["id"]);
export type CreateTaskResponseBody = v.InferOutput<
	typeof createTaskResponseBodySchema
>;

// update
export const updateTaskRequestParamsSchema = v.pick(taskSchema, ["id"]);
export type UpdateTaskRequestParams = v.InferOutput<
	typeof updateTaskRequestParamsSchema
>;
export const updateTaskRequestBodySchema = v.omit(
	createUpdateSchema(taskTable),
	["id"],
);
export type UpdateTaskRequestBody = v.InferOutput<
	typeof updateTaskRequestBodySchema
>;
export const updateTaskResponseBodySchema = v.pick(taskSchema, ["id"]);
export type UpdateTaskResponseBody = v.InferOutput<
	typeof updateTaskResponseBodySchema
>;

// delete
export const deleteTaskRequestParamsSchema = v.pick(taskSchema, ["id"]);
export type DeleteTaskRequestParams = v.InferOutput<
	typeof deleteTaskRequestParamsSchema
>;
export const deleteTaskResponseBodySchema = v.pick(taskSchema, ["id"]);
export type DeleteTaskResponseBody = v.InferOutput<
	typeof deleteTaskResponseBodySchema
>;
