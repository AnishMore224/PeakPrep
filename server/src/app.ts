import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth";
import getDetailsRoutes from "./routes/details";
import adminRoutes from "./routes/adminControls";
import feedbackRoutes from "./routes/feedback";
import studentSelectionRoutes from "./routes/studentSelection";
import userRoutes from "./routes/user";
import genResume from "./routes/resume";
import contestRoutes from "./routes/contest";
import mailRoutes from "./routes/mail";
import cloudinaryRoutes from "./routes/cloudinary";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// middlewares
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/details", getDetailsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/studentSelection", studentSelectionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/genResume", genResume );
app.use("/api/contest", contestRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript!");
});

mongoose
  .connect(process.env.DBURI as string)
  .then(() => {
    console.log("Connected to Database !");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
