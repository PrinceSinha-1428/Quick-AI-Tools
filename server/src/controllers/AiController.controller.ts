import { Request, Response } from "express";
import OpenAI from "openai";
import { ClipdropApiKey, GoogleGemeniApiKey } from "../lib/enviromentConfig";
import sql from "../lib/dataBase";
import {  clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from "form-data";



const AI = new OpenAI({
    apiKey: GoogleGemeniApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req: any,res: Response): Promise<void> => {
    try {
        const { userId } = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage ?? 0;;
        if(plan !== 'premium' && free_usage >= 10){
             res.status(200).json({
                success: false,
                message: "Limit Reached. Upgrade to continue."
            })
            return;
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt}],
            temperature: 0.7,
            max_tokens: length
        })
        const content =  response.choices[0].message.content;
        if (!content) {
        res.status(500).json({
            success: false,
            message: "AI response did not return valid content."
        });
      return;
    }
        await sql`INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId},${prompt}, ${content}, 'article')`;
        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage : free_usage + 1
                }
            })
        }
        res.status(200).json({
            success: true,
            content
        })
        return;
    } catch (error: any) {
         res.status(500).json({
                success: false,
                message: error.message
            })
            return;
    }
}
export const generateBlogTitle = async (req: any,res: Response): Promise<void> => {
    try {
        const { userId } = req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage ?? 0;;
        if(plan !== 'premium' && free_usage >= 10){
             res.status(200).json({
                success: false,
                message: "Limit Reached. Upgrade to continue."
            })
            return;
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user",content: prompt }],
            temperature: 0.7,
            max_tokens: 100
        })
        const content =  response.choices[0].message.content;
        if (!content) {
        res.status(500).json({
            success: false,
            message: "AI response did not return valid content."
        });
      return;
    }
        await sql`INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId},${prompt}, ${content}, 'blog-title')`;
        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage : free_usage + 1
                }
            })
        }
        res.status(200).json({
            success: true,
            content
        })
        return;
    } catch (error: any) {
         res.status(500).json({
                success: false,
                message: error.message
            })
            return;
    }
}
export const generateImage = async (req: any,res: Response): Promise<void> => {
    try {
        const { userId } = req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;
        if(plan !== 'premium' ){
             res.status(200).json({
                success: false,
                message: "This feature is only available to premium users. Upgrade to continue."
            })
            return;
        }
        const formData = new FormData()
        formData.append('prompt', prompt);
        console.log("formData")
        const {data} =  await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
            headers: {  'x-api-key': ClipdropApiKey},
            responseType:'arraybuffer'
        })
        console.log("axios working")
        const base64Image = Buffer.from(data,'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`
        console.log("Base64 ")
        
        const {secure_url} = await cloudinary.uploader.upload(resultImage)
        console.log("secure_url")

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId},${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        console.log("inserted at table")
        res.status(200).json({
            success: true,
            content: secure_url
        })
        return;
    } catch (error: any) {
         res.status(500).json({
                success: false,
                message: error.message
            })
            return;
    }
}