import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!


const GenerateImages = () => {

      const imageStyle = [ 'Realistic', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', 'Realistic Style', '3D Style', 'Potrait Style'];
      const [selectedStyle, setSelectedStyle] = useState<string>('Realistic');
      const [input, setInput] = useState<string>('');
      const [publish, setPublish] = useState<boolean>(false);
      const [loading, setLoading] = useState<boolean>(false);
      const [content, setContent] = useState<string>('');
      const {getToken} = useAuth();
    
      const onSubmitHandler = async (e:React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          try {
            setLoading(true);
            const prompt = `Generate image of ${input} in the style ${selectedStyle}`
           const {data} = await axios.post('/api/ai/generate-image',{prompt, publish},{headers: {Authorization: `Bearer ${await getToken()}`}});
          if(data.success){
            toast.success("Image Generated");
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
          <Sparkles className='w-6 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4}
         className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what do you want to see in the image' required />
        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span onClick={() => setSelectedStyle(item)}
             className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-100 text-green-700' : 'text-gray-500 bg-gray-200'}`} key={item}>{item}</span>
          ))}
        </div>
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer'/>
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 size-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-2xl cursor-pointer'>
          {loading ? <span className='size-4 my-1 rounded-full border-2 border-t-transparent animate-spin'/> :  <Image className='w-5'/>}
          {loading? "Generating Image" : "Generate Image"}
        </button>
      </form>
      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Image className='size-5 text-[#00AD25]' />
            <h1 className='text-xl font-semibold'>Generated Image</h1>
          </div>
          {
            !content ? (
              <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='size-9' />
              <p>Describe your image and click " Generate Image " to get started </p>
            </div>
          </div>
            ) : (
              <div className='mt-3 h-full'>
                <img src={content} alt="img generated" className='size-full' />
              </div>
            )
          }
          
      </div>
    </div>
  )
}

export default GenerateImages
