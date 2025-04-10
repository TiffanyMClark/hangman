import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/riddleRoute";
import path from "path";
import corsMiddleware from "./middleware/corsMiddleware"; // Use the middleware here

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Use the imported CORS middleware for all routes

app.use(corsMiddleware);
// Serve static files from the client build directory
const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// Use the riddle route for any requests starting with '/riddle'
app.use("/api", router);

// Serve the index.html file for all non-API routes
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
