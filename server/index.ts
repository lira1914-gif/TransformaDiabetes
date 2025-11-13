import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import rateLimit from "express-rate-limit";

const app = express();
// Configurar trust proxy para rate limiter
app.set('trust proxy', 1);
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  Protección contra bots y rutas sospechosas
const blockedPaths = [
  "/wp-admin",
  "/wordpress",
  "/wp-login",
  "/xmlrpc.php",
  "/.env",
  "/wp-content",
  "/wp-includes",
  "/.git",
  "/config.php",
  "/phpmyadmin",
  "/admin.php",
  "/setup.php"
];

const blockedIPs: string[] = [
  // Agregar IPs sospechosas aquí si es necesario
];

app.use((req, res, next) => {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";

  // Bloquear rutas sospechosas
  if (blockedPaths.some(path => req.url.startsWith(path))) {
    const logMessage = ` Ruta bloqueada: ${req.url} desde IP ${ip}\n`;
    fs.appendFileSync("blocked.log", logMessage);
    console.log(logMessage.trim());
    return res.status(403).send("Acceso denegado ");
  }

  // Bloquear IPs en lista negra
  if (blockedIPs.includes(ip)) {
    const logMessage = ` IP bloqueada: ${ip}\n`;
    fs.appendFileSync("blocked.log", logMessage);
    console.log(logMessage.trim());
    return res.status(403).send("Acceso denegado ");
  }

  next();
});

//  Limitador de solicitudes (Rate Limiting) - Solo para rutas API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP en 15 minutos
  message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const logMessage = ` Límite alcanzado: ${ip} - ${req.url}\n`;
    fs.appendFileSync("blocked.log", logMessage);
    console.log(logMessage.trim());
    res.status(options.statusCode).send(options.message);
  }
});

// Aplicar rate limiter SOLO a rutas API (no a assets de Vite)
app.use('/api', limiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
