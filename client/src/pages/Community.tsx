import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!



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
    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useUser();
    const {getToken} = useAuth();

  const fetchCreations = async () => {
    try {
      const {data} = await axios.get('/api/user/get-published-creations',{headers:{Authorization: `Bearer ${await getToken()}`}});
      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally{
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id: number) => {
    try {
      const {data} = await axios.post('/api/user/toggle-like-creation',{id},{headers:{Authorization: `Bearer ${await getToken()}`}});
      if(data.success){
        toast.success(data.message);
        await fetchCreations()
      }else{
        toast.error(data.message); 
      }
    } catch (error: any) {
      toast.error(error.message);
      
    }
  }


  useEffect(() => {
   if(user){
    fetchCreations();
   }
  },[user])
  return !loading ?  (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation,index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} alt="image" className='size-full object-cover rounded-lg' />
            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-1g'>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart onClick={() => imageLikeToggle(creation.id)}  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user?.id!) ? 'fill-red-500 text-red-600' : 'text-white' }`}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) :
  <div className='flex justify-center items-center h-full'>
    <span className='size-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin' />
  </div>
}

export default Community
