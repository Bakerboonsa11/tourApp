'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Guide {
  id: string;
  name: string;
  email: string;
  photo: string;
  status: 'active' | 'inactive';
  image:string
}

interface Tour {
  _id: string;
  name: string;
  guides?: string[];
}

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;

};



export default function GuideManagement() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const t = useTranslations('admin');
  
  const handleAssignTour = async (email: string, tourId: string, guideId: string, isAssigned: boolean) => {
    try {
      const tour = await axios.get(`/api/tours/${tourId}`);
      if (!tour.data) {
        alert(`Assigned guide ${guideId} to tour ${tourId}`);
      }
  
      let guides = tour.data.guides || [];
  
      if (isAssigned) {
        guides = guides.filter((g: string) => g !== guideId);
      } else {
        guides[0] = guideId;
      }
  
      const updateResponse = await axios.patch(`/api/tours/${tourId}`, { guides });
      console.log('updated is ', updateResponse);
  
      if (updateResponse.data.updatedTo) {
        alert('assigned');
        const tourName = updateResponse.data.updatedTo.name;
        const des = updateResponse.data.updatedTo.description;
  
        await axios.post('/api/sendemailassign', {
          email,
          tourName,
          des
        });
      }
  
      // ✅ Re-fetch tours to update assignment UI
      const updatedTours = await axios.get('/api/tours');
      setTours(updatedTours.data.instanceFiltered || []);
  
      alert(`${isAssigned ? 'Unassigned' : 'Assigned'} guide ${guideId} to tour ${tourId}`);
    } catch (error) {
      console.error('Error assigning/unassigning tour:', error);
      alert('Failed to update tour. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersRes = await axios.get('/api/user');
        const filteredGuides = usersRes.data.instanceFiltered
          .filter((user: User) => user.role === 'guide')
          .map((user: User) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.image,
            status: 'active',
          }));
        setGuides(filteredGuides);
      } catch (err) {
        console.error('Error fetching guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleToggleTours = async (guideId: string) => {
    if (expandedGuideId === guideId) {
      setExpandedGuideId(null);
      return;
    }

    setLoadingTours(true);
    try {
      const res = await axios.get('/api/tours');
      setTours(res.data.instanceFiltered || []);
      setExpandedGuideId(guideId);
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoadingTours(false);
    }
  };

  return (
    <section className=" max-h-screen overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-cyan-100    bg-gradient-to-br from-cyan-50 to-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-7xl mx-auto mt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-cyan-900">{t('guideManagement.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">
        {t('guideManagement.description')}        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
          <div className="flex items-center gap-4">
  <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-cyan-300 shadow-sm">
    <Image
      src={guide.photo ? `/userimages/${guide?.photo}` : '/pro.png'}
      alt={guide.name}
      width={60}
      height={60}
      className="object-cover"
    />
  </div>
  <div>
    <h3 className="text-lg font-semibold text-gray-800">
      {guide.name}
    </h3>
    <p className="text-sm text-gray-500">{guide.email}</p>
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
        guide.status === 'active'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'
      }`}
    >
      {guide.status}
    </span>
  </div>
</div>


            <div className="mt-5">
              <Button
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm py-2 rounded-xl transition-all font-semibold"
                onClick={() => handleToggleTours(guide.id)}
              >
                {expandedGuideId === guide.id ? t('guideManagement.hideTours') : t('guideManagement.assignToTour')}
              </Button>

              {expandedGuideId === guide.id && (
  <div className="mt-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-cyan-100 rounded-lg border border-cyan-200 shadow-inner bg-white">
    {loadingTours ? (
      <p className="text-gray-500 text-sm p-4 text-center">{t('guideManagement.loadingTours')}...</p>
    ) : tours.length > 0 ? (
      tours.map((tour) => {
        const isAssigned = tour.guides?.includes(guide.id);
        return (
          <div
            key={tour._id}
            className="border border-cyan-100 bg-cyan-50 hover:bg-cyan-100 transition-colors p-3 rounded-xl text-sm flex justify-between items-center shadow-sm mb-2 mx-2"
          >
            <span className="font-medium text-gray-800 truncate max-w-[160px]">
              {tour.name}
            </span>
            <Button
              size="sm"
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all duration-200 ${
                isAssigned
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              onClick={() =>
                handleAssignTour(guide.email, tour._id, guide.id, isAssigned ?? false)
              }
            >
              {isAssigned ? t('guideManagement.unassign') : t('guideManagement.assign')}
            </Button>
          </div>
        );
      })
    ) : (
      <p className="text-sm text-gray-500 p-4 text-center">{t('guideManagement.noToursFound')}.</p>
    )}
  </div>
)}

            </div>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-6 text-sm">Loading guides...</p>
      )}
    </section>
  );
}
