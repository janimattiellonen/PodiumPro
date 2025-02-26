import type { Express } from "express";
import { createServer } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { podiumFormSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export async function registerRoutes(app: Express) {
  app.post("/api/tournament", async (req, res) => {
    try {
      const validatedData = podiumFormSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData.tournament);
      
      // Create players
      const players = await Promise.all(
        validatedData.players.map(player => storage.createPlayer(player))
      );

      res.json({ tournament, players });
    } catch (error) {
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // In a real app we'd upload to cloud storage
    // For now return a fake URL
    const fakeUrl = `/uploads/${Date.now()}-${req.file.originalname}`;
    res.json({ url: fakeUrl });
  });

  return createServer(app);
}
