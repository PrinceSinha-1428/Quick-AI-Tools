import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart } from 'lucide-react';


interface creationsdataTypes {
   id: number;
    user_id: string;
    prompt: string;
    content: string;
    type: string;
    publish: boolean;
    likes: string[];
    created_at: string;
     updated_at: string;
     __v?: number;
  }

const Community = () => {
  const [creations, setCreations] = useState<creationsdataTypes[]>([]);
  const {user} = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }
  useEffect(() => {
   if(user){
    fetchCreations();
   }
  },[user])
  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation,index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} alt="image" className='size-full object-cover rounded-lg' />
            <div className='absolute bottom-0 top-o right-o left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-1g'>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user?.id!) ? 'fill-red-500 text-red-600' : 'text-white' }`}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
