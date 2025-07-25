import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';

const AiTools = () => {
    const navigate = useNavigate();
    const {user} = useUser();
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Everything you need to create, enhance, optimize your content with cutting edge AI technology</p>
      </div>
      <div className='flex flex-wrap mt-10 justify-center gap-6 max-w-7xl mx-auto'>
        {AiToolsData.map((tool,index) => (
            <div onClick={() => user && navigate(tool.path)} key={index} className='p-8 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
                <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`}} />
                <h2 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h2>
                <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default AiTools
