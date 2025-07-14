import express from 'express';
import { auth } from '../middlewares/auth.middleware';
import { getPublishCreations, getUserCreations, toggleLikeCreation } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get("/get-user-creations",auth,getUserCreations);
userRouter.get("/get-published-creations",auth,getPublishCreations);
userRouter.post("/toggle-like-creation",auth,toggleLikeCreation);

export default userRouter