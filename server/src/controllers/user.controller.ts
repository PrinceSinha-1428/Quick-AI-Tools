import { Response } from "express";
import sql from "../lib/dataBase";

export const getUserCreations = async (req: any,res: Response) : Promise<Response<any, Record<string, any>>> => {
    try {
        const {userId} = req.auth();
        const creations = await sql`SELECT  * FROM creations Where user_id = ${userId} ORDER BY created_at DESC`;
        return res.status(200).json({
            success: true,
            creations 
        })
    } catch (error:any) {
        return res.status(200).json({
            success: false,
            mesage: error.mesage 
        })
    }
}

export const getPublishCreations = async (req: any,res: Response) : Promise<Response<any, Record<string, any>>> => {
    try {
        const creations = await sql`SELECT  * FROM creations Where publish = true ORDER BY created_at DESC`;
        return res.status(200).json({
            success: true,
            creations 
        })
    } catch (error:any) {
        return res.status(200).json({
            success: false,
            mesage: error.mesage 
        })
    }
}
export const toggleLikeCreation = async (req: any,res: Response) : Promise<Response<any, Record<string, any>>> => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;
        const [creation] = await sql`SELECT  * FROM creations Where id = ${id}`;
        if(!creation){
            return res.status(200).json({
                success: false,
                message: "Creation Not Found"
            })
        };
        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;
        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user: any) => user !== userIdStr);
            message = 'Creation Unliked'
        }else{
            updatedLikes = [...currentLikes, userIdStr];
            message : 'Creation Liked'
        }
        const formattedArray = `{${updatedLikes.join(',')}}`
        await sql`update creations SET likes = ${formattedArray}:: text[] where id = ${id}`
        return res.status(200).json({
            success: true,
            message: message
        })
    } catch (error:any) {
        return res.status(200).json({
            success: false,
            mesage: error.mesage 
        })
    }
}