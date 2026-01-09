import type { Express, Request, Response } from "express";
import { type Server } from "http";

const API_BASE_URL = process.env.API_BASE_URL || "https://fleetpulse-io7s.onrender.com";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy all /api/* requests to the FastAPI backend
  app.all("/api/*", async (req: Request, res: Response) => {
    try {
      // Remove /api prefix to get the actual endpoint path
      const path = req.path.replace(/^\/api/, "");
      const url = `${API_BASE_URL}${path}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Forward authorization header if present
      if (req.headers.authorization) {
        headers["Authorization"] = req.headers.authorization as string;
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      // Include body for POST, PUT, PATCH requests
      if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      res.status(response.status).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ message: "Proxy error", error: String(error) });
    }
  });

  return httpServer;
}
