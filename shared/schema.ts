import { pgTable, text, serial, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  websiteUrl: text("website_url").notNull(),
  firstPlaceId: integer("first_place_id").references(() => players.id),
  secondPlaceId: integer("second_place_id").references(() => players.id),
  thirdPlaceId: integer("third_place_id").references(() => players.id),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  firstPlaceId: true,
  secondPlaceId: true,
  thirdPlaceId: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({ 
  id: true 
});

export const podiumFormSchema = z.object({
  tournament: insertTournamentSchema,
  players: z.array(insertPlayerSchema).length(3),
});

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type PodiumForm = z.infer<typeof podiumFormSchema>;
