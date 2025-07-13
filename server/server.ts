import express, { Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config'
import { PortNumber } from "./src/lib/enviromentConfig";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./src/routes/AI.route";
import connectCloudinary from "./src/lib/Cloudinary";

const app = express();
const PORT = PortNumber;
 


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());



app.get("/",(req: Request,res: Response) => res.send("Server is live"));

app.use(requireAuth());
app.use("/api/ai",aiRouter)

app.listen(PORT, async () => {
    await connectCloudinary()
    console.log(`Server is running at http://localhost:${PORT}`);
})