import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { IGateway } from "@analog-gmp/interfaces/IGateway.sol";
import { TimegraphClient } from '@analog-labs/timegraph-js';

// Log function to format log messages
function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Check for DATABASE_URL and log accordingly
if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set. Running in offline mode.");
    // You can set up mock data or bypass database logic here if needed
} else {
    // Uncomment and implement this function if needed
    // connectToDatabase(process.env.DATABASE_URL);
}

// Middleware for logging requests
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

// Initialize the GMP Gateway
const gateway: IGateway = new IGateway(/* ... initialization parameters ... */);

// Function to send cross-chain messages
async function sendCrossChainMessage(destination: string, networkId: number, data: string) {
    await gateway.submitMessage(destination, networkId, 100000, data);
}

// Initialize the Watch client
const client = new TimegraphClient({
    url: 'https://timegraph.testnet.analog.one/graphql',
    sessionKey: '<YOUR_SESSION_KEY>',
});

// Function to fetch data from the Watch service
async function fetchDataFromWatch(viewName: string) {
    const response = await client.view.get({ name: viewName });
    return response;
}

// Example usage of sending a message
sendCrossChainMessage('0xDestinationAddress', 1, 'Your message data here');

// Example usage of fetching data
fetchDataFromWatch('my_view').then(data => {
    console.log(data);
});

// Main async function to set up the server
(async () => {
  registerRoutes(app); // Ensure this function is correctly implemented in your routes file
  const server = createServer(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err; // Consider removing this line unless you have a specific reason to throw the error
  });

  // Setup Vite or serve static files based on the environment
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 5000
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();

// Define views for the Watch service
const views = [
  {
    "name": "priceFeed",
    "sql": "SELECT price FROM priceFeeds WHERE token = 'ETH'"
  }
];