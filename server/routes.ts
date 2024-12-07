import type { Express } from "express";
import { db } from "../db";
import { nfts, games } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const sampleNFTs = [
    {
      name: "Cyber Samurai",
      image: "https://picsum.photos/400/400",
      description: "A legendary cyber warrior",
      price: "0.5"
    },
    {
      name: "Digital Dragon",
      image: "https://picsum.photos/401/400",
      description: "A mythical digital beast",
      price: "0.8"
    },
    {
      name: "Neon Ninja",
      image: "https://picsum.photos/402/400",
      description: "Silent but deadly cyber assassin",
      price: "0.3"
    },
    {
      name: "Quantum Queen",
      image: "https://picsum.photos/403/400",
      description: "Ruler of the digital realm",
      price: "1.2"
    },
    {
      name: "Cyber Phoenix",
      image: "https://picsum.photos/404/400",
      description: "Reborn in the digital flames",
      price: "0.9"
    }
  ];

  // Initialize sample NFTs if none exist
  app.get("/api/nfts/init", async (req, res) => {
    try {
      const existingNFTs = await db.select().from(nfts);
      if (existingNFTs.length === 0) {
        const sampleNFTValues = sampleNFTs.map(nft => ({
          tokenId: Date.now().toString(),
          owner: "0x000000000000000000000000000000000000dEaD", // Dead address for marketplace
          metadata: JSON.stringify(nft)
        }));
        
        await db.insert(nfts).values(sampleNFTValues);
      }
      res.json({ message: "Sample NFTs initialized" });
    } catch (error) {
      console.error("Error initializing NFTs:", error);
      res.status(500).json({ error: "Failed to initialize NFTs" });
    }
  });

  app.get("/api/nfts/global", async (req, res) => {
    try {
      // Show all NFTs in global marketplace
      const globalNFTs = await db.select().from(nfts);
      res.json(globalNFTs);
    } catch (error) {
      console.error("Error fetching global NFTs:", error);
      res.status(500).json({ error: "Failed to fetch global NFTs" });
    }
  });

  app.get("/api/nfts/owned/:address", async (req, res) => {
    try {
      const address = req.params.address.toLowerCase();
      const ownedNFTs = await db.select()
        .from(nfts)
        .where(sql`LOWER(${nfts.owner}) = ${address}`);
      res.json(ownedNFTs);
    } catch (error) {
      console.error("Error fetching owned NFTs:", error);
      res.status(500).json({ error: "Failed to fetch owned NFTs" });
    }
  });

  app.get("/api/nfts/purchased/:address", async (req, res) => {
    try {
      const purchasedNFTs = await db.select()
        .from(nfts)
        .where(sql`${nfts.owner} = ${req.params.address} AND metadata::json->>'purchased' = 'true'`);
      res.json(purchasedNFTs);
    } catch (error) {
      console.error("Error fetching purchased NFTs:", error);
      res.status(500).json({ error: "Failed to fetch purchased NFTs" });
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

  app.post("/api/nfts", async (req, res) => {
    try {
      const { name, description, price, image, owner } = req.body;
      const metadata = JSON.stringify({ name, description, price, image });
      
      const newNft = await db.insert(nfts).values({
        tokenId: Date.now().toString(), // Simple tokenId generation
        owner,
        metadata
      }).returning();
      
      res.json(newNft[0]);
    } catch (error) {
      console.error("Error creating NFT:", error);
      res.status(500).json({ error: "Failed to create NFT" });
    }
  });
}
