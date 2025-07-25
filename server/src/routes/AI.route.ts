import express from 'express';
import { auth } from '../middlewares/auth.middleware';
import { generateArticle, generateBlogTitle, generateImage, removeBackgroundImage, removeImageObject, reviewResume } from '../controllers/AiController.controller';
import { upload } from '../middlewares/multer.middleware';

const aiRouter = express.Router();

aiRouter.post("/generate-article",auth,generateArticle);
aiRouter.post("/generate-blog-title",auth,generateBlogTitle);
aiRouter.post("/generate-image",auth,generateImage);
aiRouter.post("/remove-image-background",upload.single('image'),auth,removeBackgroundImage);
aiRouter.post("/remove-image-object",upload.single('image'),auth,removeImageObject);
aiRouter.post("/resume-review",upload.single('resume'),auth,reviewResume);


export default aiRouter;