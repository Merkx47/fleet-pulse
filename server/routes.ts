import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Frontend communicates directly with external API or via proxy.
  // This file is required for the local Express server to start.
  
  return httpServer;
}
