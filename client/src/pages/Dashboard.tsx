import { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL!


 export interface DummydataCreations {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: never[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [creations, setCreations] = useState<DummydataCreations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {getToken} = useAuth();

  const getDashboardData = async () => {
   try {
     const {data} = await axios.get("/api/user/get-user-creations",{
      headers: {Authorization: `Bearer ${await getToken()}`}
     })
     if(data.success){
      setCreations(data.creations)
     }else{
      toast.error(data.message)
    }
  } catch (error: any) {
     toast.error(error.message)
   } finally {
    setLoading(false);
   }
  };

  useEffect(() => {
    getDashboardData();
  },[]);

  return (
    <div className="h-full overflow-y-scroll p-6 ">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total creation card  */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
            <div className="text-slate-600">
              <p className="text-sm">Total Creations</p>
              <h2 className="text-xl font-semibold">{creations.length}</h2>
            </div>
            <div className="size-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
              <Sparkles className="w-5 text-white"/>
            </div>
        </div>
        {/* Active Plan card  */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
            <div className="text-slate-600">
              <p className="text-sm">Active Plan</p>
              <h2 className="text-xl font-semibold">
                <Protect plan={'premium'} fallback={"Free"}>Premium</Protect>
              </h2>
            </div>
            <div className="size-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
              <Gem className="w-5 text-white"/>
            </div>
        </div>
      </div>
      {
        loading ? (
        <div className='flex justify-center items-center h-3/4'>
          <span className='size-11 rounded-full border-3 border-purple-500 border-t-transparent animate-spin' />
        </div>
        ) : (
          <div className="space-y-3">
            <p className="mt-6 mb-4">Recent Creations</p>
            {creations.map((item) => <CreationItem item={item} key={item.id} />) }
          </div>
        )
      } 
    </div>
  );
};

export default Dashboard;
