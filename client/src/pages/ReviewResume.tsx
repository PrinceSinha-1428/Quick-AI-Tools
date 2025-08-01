import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!


const ReviewResume = () => {
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
          formdata.append('resume',input);
          const {data} = await axios.post('/api/ai/resume-review',formdata,{headers:{Authorization: `Bearer ${await getToken()}`}})
          if(data.success){
            toast.success("Resume Analyzed")
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
          <Sparkles className='w-6 text-[#00DA83]'/>
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Resume</p>
        <input onChange={(e) => setInput(e.target.files?.[0] || null)} accept='application/pdf'
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required type="file"/>
          <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF Resume only</p>
        <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-2xl cursor-pointer'>
          {loading ? <span className='size-4 my-1 rounded-full border-2 border-t-transparent animate-spin'/> :  <FileText className='w-5'/>}
          {loading ? "Reviewing Resume" : "Review Resume"}
        </button>
      </form>
      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
          <div className='flex items-center gap-3'>
            <FileText className='size-5 text-[#00DA83]' />
            <h1 className='text-xl font-semibold'>Analysis Results</h1>
          </div>
          {
            !content ? ( <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FileText className='size-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                <div className='reset-tw'>
                  <Markdown>{content}</Markdown>
                </div>
           </div>
          )}
      </div>
    </div>
  )
}

export default ReviewResume
