import type { Express } from "express";
import { createServer } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { podiumFormSchema } from "@shared/schema";
import fs from 'fs';
import express from 'express';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export async function registerRoutes(app: Express) {
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

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

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  return createServer(app);
}