import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/configDB.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

connectDB();

app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});

app.get("/", (req, res) => {
    res.send("Hello from the backend of Restaurant Reservation Management System");
});

