import express from 'express';
import { auth } from '../middlewares/auth.middleware';
import { generateArticle } from '../controllers/AiController.controller';

const aiRouter = express.Router();

aiRouter.post("/generate-article",auth,generateArticle);


export default aiRouter;