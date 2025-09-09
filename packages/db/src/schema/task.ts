import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const taskTable = pgTable("task", {
	id: uuid().primaryKey().defaultRandom(),
	title: varchar({ length: 40 }).notNull(),
	description: varchar({ length: 255 }),
	isDone: boolean().default(false).notNull(),
});
