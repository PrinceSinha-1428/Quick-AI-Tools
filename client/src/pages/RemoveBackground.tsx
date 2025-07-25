import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {  Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!


const RemoveBackground = () => {
      const [input, setInput] = useState<File | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [content, setContent] = useState<string>('');
      const {getToken} = useAuth();
    
      const onSubmitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!input || !(input instanceof File)) {
            toast.error("No file selected.");
            return;
          }
          try {
          setLoading(true);
          const formdata = new FormData();
          formdata.append('image',input);
          const {data} = await axios.post('/api/ai/remove-image-background',formdata,{headers:{Authorization: `Bearer ${await getToken()}`}})
          if(data.success){
            toast.success("Background Removed")
            setContent(data.content);
          }else{
            toast.error(data.message)
          }
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      }
  return (
     <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left column */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]'/>
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input  onChange={(e) => { const file = e.target.files?.[0];  if(file) { setInput(file)}}} accept='image/*'
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required type="file"/>
          <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats</p>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-2xl cursor-pointer'>
         {loading ? <span className='size-4 my-1 rounded-full border-2 border-t-transparent animate-spin'/> :  <Eraser className='w-5'/>}
         {loading ? "Removing Background" : "Remove Background"}
        </button>
      </form>
      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Eraser className='size-5 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
            {
              !content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                  <Eraser className='size-9' />
                  <p>Upload an image and click "Remove Background" to get started</p>
              </div>
            </div>
              ) : (
                <img src={content} alt="removed background" className='mt-3 size-full' />
              )}
          
      </div>
    </div>
  )
}

export default RemoveBackground
