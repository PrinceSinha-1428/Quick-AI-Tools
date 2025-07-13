import express, { Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config'
import { PortNumber } from "./src/lib/enviromentConfig";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./src/routes/AI.route";

const app = express();
const PORT = PortNumber;


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());



app.get("/",(req: Request,res: Response) => res.send("Server is live"));

app.use(requireAuth());
app.use("/api/ai",aiRouter)

app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`);
})