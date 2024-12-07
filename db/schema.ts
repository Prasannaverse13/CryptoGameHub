import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  address: text("address").unique().notNull(),
  nonce: text("nonce").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tokenId: text("token_id").notNull(),
  owner: text("owner").notNull(),
  metadata: text("metadata").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  player: text("player").notNull(),
  result: text("result").notNull(),
  reward: text("reward"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
