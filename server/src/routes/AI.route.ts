import express from 'express';
import { auth } from '../middlewares/auth.middleware';
import { generateArticle, generateBlogTitle, generateImage } from '../controllers/AiController.controller';

const aiRouter = express.Router();

aiRouter.post("/generate-article",auth,generateArticle);
aiRouter.post("/generate-blog-title",auth,generateBlogTitle);
aiRouter.post("/generate-image",auth,generateImage);


export default aiRouter;