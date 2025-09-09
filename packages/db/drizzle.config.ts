/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint: no problem
		url: process.env.DATABASE_URL!,
	},
});
