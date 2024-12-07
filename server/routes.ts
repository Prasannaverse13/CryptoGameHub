import type { Express } from "express";
import { db } from "../db";
import { nfts, games } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  app.get("/api/nfts", async (req, res) => {
    try {
      const userNfts = await db.select().from(nfts);
      
      if (!Array.isArray(userNfts)) {
        throw new Error("Invalid NFT data format");
      }
      
      res.json(userNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ 
        error: "Failed to fetch NFTs",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/games/:address", async (req, res) => {
    try {
      const userGames = await db.select()
        .from(games)
        .where(eq(games.player, req.params.address));
      res.json(userGames);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const { player, result } = req.body;
      const game = await db.insert(games)
        .values({ player, result })
        .returning();
      res.json(game[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game" });
    }
  });
}
