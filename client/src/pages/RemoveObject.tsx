import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!


const RemoveObject = () => {
      const [input, setInput] = useState<File | null>(null);
      const [object, setObject] = useState<string>('')
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
          if(object.split(" ").length > 1){
            return toast.error("Please enter only one object name")
          }
          const formdata = new FormData();
          formdata.append('image',input);
          formdata.append('object',object);
          const {data} = await axios.post('/api/ai/remove-image-object',formdata,{headers:{Authorization: `Bearer ${await getToken()}`}})
          if(data.success){
            toast.success(`${object} Removed`)
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
          <Sparkles className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input onChange={(e) => setInput(e.target.files?.[0] || null)} accept='image/*'
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required type="file"/>
          <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
           <textarea onChange={(e) => setObject(e.target.value)} value={object} rows={4}
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g, watch or spoon , only single object name' required />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-2xl cursor-pointer'>
        {loading ? <span className='size-4 my-1 rounded-full border-2 border-t-transparent animate-spin'/> :  <Scissors className='w-5'/>}
        {loading ? "Removing Object" : "Remove Object"}
        </button>
      </form>
      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Scissors className='size-5 text-[#417DF6]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='size-9' />
                <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
            ) : (
              <img src={content} alt="removed background" className='mt-3 size-full' />
            )}
      </div>
    </div>
  )
}

export default RemoveObject
