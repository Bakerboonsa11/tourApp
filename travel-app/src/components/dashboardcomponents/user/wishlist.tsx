'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, MapPin, Clock } from 'lucide-react';
import { useEffect,useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export interface IBooking {
  _id: string;
  tour: {
    _id:string
    name:string
  };// Simplified for display
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: unknown;
  createdAt: string;
  updatedAt: string;

}

const wishlistItems = [
  {
    id: '1',
    name: 'Beautiful Bali Retreat',
    region: 'Indonesia',
    price: 899,
    image: '/images/bali.jpg',
    duration: 7,
  },
  {
    id: '2',
    name: 'Safari Adventure',
    region: 'Kenya',
    price: 1299,
    image: '/images/kenya.jpg',
    duration: 10,
  },
  {
    id: '3',
    name: 'Northern Lights Quest',
    region: 'Iceland',
    price: 1099,
    image: '/images/iceland.jpg',
    duration: 5,
  },
];
type Tour = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: string;
  startDates: string[];
  endDate: string;
  comments: Comment[];
  likes: string[]; // array of User IDs (ObjectIds)
  createdAt: string;
  guides: string[];
  status: string;
};

export interface Comment {
  message: string;
  userId: string;
  userImage: string;
  name: string;
  createdAt: string; // ISO date string
}



interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin'|'guide';
  password?: string;
  createdAt: string;
}
export default function Wishlist() {
 const {data:session}=useSession()
 const [user ,setUser]=useState<User |null >(null)
 const [reviews,setreviews]=useState<Tour[] |null>([])
 const t = useTranslations('user');

   useEffect(() => {
      const email = session?.user?.email;
      if (!email) return; // ensures it's a string
    
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
          const userData: User = response.data.data;
          setUser(userData);
          console.log('user id  is ',userData._id)
  
          // find tours
          const tourResponse =await axios.get(`/api/tours`);
          console.log(tourResponse.data)
  
      //  filter for number of tours
         const filteredtourReview= tourResponse.data.instanceFiltered.filter((tour:Tour) => tour.likes.some((like) => like === userData?._id));
          console.log('reviews are ',filteredtourReview)
          setreviews(filteredtourReview)
    
       
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserData();
    }, [session]);
    
    const handleDelete= async(id:string)=>{
      try {
        console.log('id of tour is ',id)
        const tourResponse =await axios.get(`/api/tours/${id}`);
        console.log('tour is ',tourResponse.data)
        const updatedlikes= tourResponse.data.data.likes.filter((like:string)=>like !==user?._id)
        const body = { likes:updatedlikes};

        const updateResponse = await axios.patch(`/api/tours/${id}`, body);
        console.log(updateResponse.data);

    //  filter for number of tours
    if (updateResponse.data){
      const tourResponse =await axios.get(`/api/tours`);
      const filteredtourReview= tourResponse.data.instanceFiltered.filter((tour:Tour) => tour.likes.some((like) => like === user?._id));
      console.log('reviews are ',filteredtourReview)
      setreviews(filteredtourReview)
      
    }
      
     
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    return (
      <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-sky-200 min-h-screen font-sans">
        <h2 className="text-5xl font-black text-slate-800 text-center mb-14 tracking-tight drop-shadow-lg">
          {t('wish.wishlistTitle')}
        </h2>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews?.map((item) => (
            <div
              key={item._id}
              className="relative group rounded-3xl overflow-hidden backdrop-blur-md bg-white/40 shadow-xl border border-sky-100 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[500px]"
            >
              {/* Image Section */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={`/toursphoto/${item.coverImage}`}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute top-4 right-4 z-10">
                  <Heart className="w-6 h-6 text-pink-500 hover:scale-125 transition-transform fill-pink-300" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Clock className="w-4 h-4" />
                  {item.duration} {t('wish.days')}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/80 text-sky-800 font-bold px-4 py-1 rounded-full shadow text-sm">
                  ${item.price}
                </div>
              </div>
    
              {/* Info Section */}
              <div className="flex flex-col justify-between flex-1 p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{item.name}</h3>
                  <div className="flex items-center text-sm text-slate-600 mt-1 gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    {item.region}
                  </div>
                </div>
    
                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <Link href={`/detail/${item._id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-xl shadow hover:brightness-110">
                      {t('wish.bookNow')}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 border border-red-200 rounded-xl"
                    onClick={() => {
                      handleDelete(item._id);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
  
}
