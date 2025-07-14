import { Response } from "express";
import OpenAI from "openai";
import { ClipdropApiKey, GoogleGemeniApiKey } from "../lib/enviromentConfig";
import sql from "../lib/dataBase";
import {  clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import FormData from "form-data";
import fs from 'fs'
import pdf from 'pdf-parse'


const AI = new OpenAI({
    apiKey: GoogleGemeniApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req: any,res: Response): Promise<Response<any, Record<string, any>>>=> {
    try {
        const { userId } = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage ?? 0;;
        if(plan !== 'premium' && free_usage >= 10){
            return res.status(200).json({
                success: false,
                message: "Limit Reached. Upgrade to continue."
            })
            
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt}],
            temperature: 0.7,
            max_tokens: length
        })
        const content =  response.choices[0].message.content;
        if (!content) {
        return res.status(500).json({
            success: false,
            message: "AI response did not return valid content."
        });
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
       return res.status(200).json({
            success: true,
            content
        })
    } catch (error: any) {
       return  res.status(500).json({
                success: false,
                message: error.message
            })
    }
}
export const generateBlogTitle = async (req: any,res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { userId } = req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage ?? 0;;
        if(plan !== 'premium' && free_usage >= 10){
           return  res.status(200).json({
                success: false,
                message: "Limit Reached. Upgrade to continue."
            })
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user",content: prompt }],
            temperature: 0.7,
            max_tokens: 100
        })
        const content =  response.choices[0].message.content;
        if (!content) {
        return res.status(500).json({
            success: false,
            message: "AI response did not return valid content."
        });
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
       return res.status(200).json({
            success: true,
            content
        })
    } catch (error: any) {
        return res.status(500).json({
                success: false,
                message: error.message
            })
    }
}
export const generateImage = async (req: any,res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { userId } = req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;
        if(plan !== 'premium' ){
            return res.status(200).json({
                success: false,
                message: "This feature is only available to premium users. Upgrade to continue."
            })
            
        }
        const formData = new FormData()
        formData.append('prompt', prompt);
        const {data} =  await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
            headers: {  'x-api-key': ClipdropApiKey},
            responseType:'arraybuffer'
        })
        const base64Image = Buffer.from(data,'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`
        
        const {secure_url} = await cloudinary.uploader.upload(resultImage)

        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId},${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
        return res.status(200).json({
            success: true,
            content: secure_url
        })
    } catch (error: any) {
        return res.status(500).json({
                success: false,
                message: error.message
            })
    }
}
export const removeBackgroundImage = async (req: any,res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { userId } = req.auth();
        const {image} = req.file;
        const plan = req.plan;
        if(plan !== 'premium' ){
            return res.status(200).json({
                success: false,
                message: "This feature is only available to premium users. Upgrade to continue."
            })   
        }
        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: "remove_the_background"
                }
            ]
        })
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId},'Remove Background from the Image', ${secure_url}, 'image')`;
        return res.status(200).json({
            success: true,
            content: secure_url
        })
        ;
    } catch (error: any) {
        return res.status(500).json({
                success: false,
                message: error.message
            })
    }
}
export const removeImageObject = async (req: any,res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const {image} = req.file;
        const plan = req.plan;
        if(plan !== 'premium' ){
            return res.status(200).json({
                success: false,
                message: "This feature is only available to premium users. Upgrade to continue."
            })   
        }
        const {public_id} = await cloudinary.uploader.upload(image.path);
        const imageUrl =  cloudinary.url(public_id,{
            transformation:[{effect: `gen_remove: ${object}`}],
            resource_type: 'image'
        })
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId},${`Removed ${object} from the Image`}, ${imageUrl}, 'image')`;
        return res.status(200).json({
            success: true,
            content: imageUrl
        })
        ;
    } catch (error: any) {
        return res.status(500).json({
                success: false,
                message: error.message
            })
    }
}
export const reviewResume = async (req: any,res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;
        if(plan !== 'premium' ){
            return res.status(200).json({
                success: false,
                message: "This feature is only available to premium users. Upgrade to continue."
            })   
        }
        if(resume.size > 5 * 1024 * 1024){
            return res.status(200).json({
                success: false,
                message: 'Resume file size exceeds allowed size 5MB'
            })
        }
        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);
        const prompt = `Review the following resume and provide constructive
        feedback on its strengths, weaknesses, and areas for improvement. Resume Content: \n\n${pdfData.text}`;

         const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt}],
            temperature: 0.7,
            max_tokens: 1000
        })
        const content =  response.choices[0].message.content;
        if (!content) {
        return res.status(500).json({
            success: false,
            message: "AI response did not return valid content."
        });
    }
        await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId},'Review The uploaded Resume', ${content}, 'Review Resume')`;
        return res.status(200).json({
            success: true,
            content: content
        })
    } catch (error: any) {
        return res.status(500).json({
                success: false,
                message: error.message
            })
    }
}