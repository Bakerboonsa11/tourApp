'use client';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sidebar } from '../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../components/dashboardcomponents/topbar';
import { Button } from '@/components/ui/button';
import UserTable from '../../../components/dashboardcomponents/admin/usertable';
import GuideManagement from '@/components/dashboardcomponents/admin/guidemanagment';
import BookingsSection from '@/components/dashboardcomponents/admin/bookings';
import ToursManagement from '@/components/dashboardcomponents/admin/tourmangment';
import { Home, Users, Map } from 'lucide-react';
import { useEffect,useState,Suspense } from 'react';
import { useRouter } from 'next/navigation'; // ✅ CORRECT for App Router

import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
};

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
  likes: string[];
  comments: object[];
  createdAt: string;
  guides: string[];
};
import {
 
  Globe2,
  Compass,
  CalendarCheck,
} from 'lucide-react';
import {
  
  Legend,

} from 'recharts';


// Define nav items here and pass to Sidebar
const navItems = [
  { section: 'admin', label: 'Dashboard', Icon: Home },
  { section: 'user', label: 'Users', Icon: Users },
  { section: 'guide', label: 'Guides', Icon: Compass },
  { section: 'bookings', label: 'Bookings', Icon: CalendarCheck },
  { section: 'tours', label: 'Tours', Icon: Globe2 },
];

const COLORS = ['#10B981', '#F59E0B', '#0EA5E9'];


 

 function AdminDashboardHome() {
  const router = useRouter();
  const handleNavigate = (section: string) => {
    router.push(`/dashboard/admin/?section=${section}`);
  };
  
  const [users, setUsers] = useState<User[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeGuide,setactiveGuide] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<object[]>([]);
  const [tourTypes, setTourTypes] = useState<{ [key: string]: number }>({});
  const [guideStats, setGuideStats] = useState<{ name: string; guides: number }[]>([]);
  const {data:session}=useSession()
  

  const [loading, setLoading] = useState(true);
  
  
  

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, toursRes] = await Promise.all([
          axios.get('/api/user'),
          axios.get('/api/tours'),
        ]);
    
        const allUsers = usersRes.data.instanceFiltered;
        setUsers(allUsers);
        setTours(toursRes.data.instanceFiltered);
    
        const guideCount = allUsers.filter((user: User) => user.role === 'guide').length;
        setactiveGuide(guideCount);
    
        // 📈 Monthly Stats for Users AND Guides
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const userCounts: { [key: string]: number } = {};
        const guideCounts: { [key: string]: number } = {};
    
        allUsers.forEach((user: User) => {
          const month = monthNames[new Date(user.createdAt).getMonth()];
          if (user.role === 'guide') {
            guideCounts[month] = (guideCounts[month] || 0) + 1;
          }
          userCounts[month] = (userCounts[month] || 0) + 1;
        });
    
        // Prepare data for recharts
        const monthlyUserStats = monthNames.map(month => ({
          name: month,
          users: userCounts[month] || 0,
        }));
    
        const monthlyGuideStats = monthNames.map(month => ({
          name: month,
          guides: guideCounts[month] || 0,
        }));
    
        setUserStats(monthlyUserStats);
        setGuideStats(monthlyGuideStats); // ✅ HERE
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchAllData();
  }, []);
  useEffect(() => {
    async function fetchTourTypes() {
      try {
        const response = await axios.get("/api/tours");
        const tours = response.data.instanceFiltered;

        const tourTypeCounts: { [key: string]: number } = {};

        tours.forEach((tour: { typeOfTour: string[] }) => {
          tour.typeOfTour.forEach((type) => {
            tourTypeCounts[type] = (tourTypeCounts[type] || 0) + 1;
          });
        });

        setTourTypes(tourTypeCounts);
      } catch (err) {
        console.error("Error fetching tours:", err);
      }
    }

    fetchTourTypes();
  }, []);

  // Convert object to array for recharts
  const chartData = Object.entries(tourTypes).map(([name, value]) => ({
    name,
    value,
  }));
  





  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'admin';

  const renderContent = () => {
    switch (section) {
      case 'admin':
        return (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Welcome, {session?.user?.name}!</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Manage all aspects of your tour platform. Use the sidebar to navigate.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 rounded-xl shadow border border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-700">Total Users</h3>
                <p className="text-2xl font-bold text-emerald-900">{users.length}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl shadow border border-yellow-100">
                <h3 className="text-sm font-semibold text-yellow-700">Total Tours</h3>
                <p className="text-2xl font-bold text-yellow-900">{tours.length}</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl shadow border border-sky-100">
                <h3 className="text-sm font-semibold text-sky-700">Active Guides</h3>
                <p className="text-2xl font-bold text-sky-900">{activeGuide}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button  onClick={()=>handleNavigate("user")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">Manage Users</Button>
              <Button onClick={()=>handleNavigate("tours")}  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm">Manage Tours</Button>
              <Button onClick={()=>handleNavigate("guide")}  className="bg-sky-500 hover:bg-sky-600 text-white text-sm">Manage Guides</Button>
            </div>
  {/* USER GRAPH  */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group transition-all hover:shadow-xl">
  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full z-0"></div>
  
  <h4 className="text-base font-semibold text-gray-800 mb-4 relative z-10 flex items-center gap-2">
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">💚</span>
    User Growth
  </h4>

  <div className="h-60 w-full relative z-10">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={userStats}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            fontSize: '0.85rem',
          }}
        />
        <Bar
          dataKey="users"
          fill="#34D399"
          radius={[8, 8, 0, 0]}
          barSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


  {/* CHART */}
  <div className="p-6 bg-gradient-to-tr from-emerald-50 via-white to-yellow-50 rounded-2xl shadow-md border border-gray-200">
  <h4 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
    🥧 Tour Types
  </h4>
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          // label is removed here
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


      

             <div className="relative p-6 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group transition-all hover:shadow-xl">
                {/* Decorative Background Shape */}
                <div className="absolute -top-4 -right-4 w-28 h-28 bg-sky-100 rounded-bl-3xl z-0"></div>

                {/* Header */}
                <h4 className="text-base font-semibold text-gray-800 mb-4 relative z-10 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white text-xs">🧭</span>
                  Guide Activity
                </h4>

                {/* Chart */}
                <div className="h-60 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={guideStats}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #e0f2fe',
                          fontSize: '0.85rem',
                        }}
                      />
                      <Bar
                        dataKey="guides"
                        fill="#0EA5E9"
                        radius={[10, 10, 0, 0]}
                        barSize={26}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-30 mb-10">
  {/* Box 1 */}
  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition-all">
    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xl font-bold shadow-inner">
      📘
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Total Guides</h4>
      <p className="text-xs text-gray-500 mt-1">{users.filter((t) => t.role === "guide").length}</p>
      </div>
  </div>

  {/* Box 2 */}
  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition-all">
    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold shadow-inner">
      🧭
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Active Regions</h4>
      <p className="text-xs text-gray-500 mt-1">{tours.length} regions covered</p>
    </div>
  </div>

  {/* Box 3 */}
  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition-all">
    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold shadow-inner">
      🌟
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Top Liked</h4>
      <p className="text-xs text-gray-500 mt-1">
  {
    (() => {
      const maxLikes = Math.max(...tours.map(tour => tour.likes?.length || 0));
      const mostLikedTour = tours.find(tour => (tour.likes?.length || 0) === maxLikes);
      return`${ mostLikedTour?.likes?.length} ${mostLikedTour?.name}`|| 0;
    })()
  } 
</p>
    </div>
  </div>
</div>



          </section>
        );

      case 'user':
        return (
          <section className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-semibold text-teal-800">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                View, update, or delete users from the system.
              </p>
            </header>
            <UserTable />
          </section>
        );

      case 'guide':
        return (
          <GuideManagement/>
        );
        case 'bookings':
          return (
            <BookingsSection/>
          );
          case 'tours':
            return (
              <ToursManagement/>
            );

      default:
        return <p className="text-red-600 text-sm">Invalid section.</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-stone-100 via-white to-emerald-50">
    {/* Sidebar on top for mobile, side for desktop */}
    <div className="w-full md:w-64 flex-shrink-0">
      <Sidebar navItems={navItems} />
    </div>
  
    {/* Fix this container */}
    <div className="flex-1 flex flex-col overflow-hidden">  {/* changed overflow-x-hidden to overflow-hidden */}
      <Topbar role="Admin" imageUrl="/images/profile.jpg" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {renderContent()}
      </main>
    </div>
  </div>
  
  
  );
}

export default function AdimDashbord() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardHome />
    </Suspense>
  );
}