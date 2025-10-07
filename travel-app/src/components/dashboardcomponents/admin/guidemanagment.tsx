'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  email: string;
  photo: string;
  status: 'active' | 'inactive';
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
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [search, setSearch] = useState('');
  const t = useTranslations('admin');

  const handleAssignTour = async (
    email: string,
    tourId: string,
    guideId: string,
    isAssigned: boolean
  ) => {
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

      if (updateResponse.data.updatedTo) {
        const tourName = updateResponse.data.updatedTo.name;
        const des = updateResponse.data.updatedTo.description;

        await axios.post('/api/sendemailassign', {
          email,
          tourName,
          des,
        });
      }

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
        const filtered = usersRes.data.instanceFiltered
          .filter((user: User) => user.role === 'guide')
          .map((user: User) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.image,
            status: 'active',
          }));
        setGuides(filtered);
        setFilteredGuides(filtered);
      } catch (err) {
        console.error('Error fetching guides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const result = guides.filter(
      (guide) =>
        guide.name.toLowerCase().includes(search.toLowerCase()) ||
        guide.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredGuides(result);
  }, [search, guides]);

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
    <section className="max-h-screen overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-2xl p-6 sm:p-10 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
          {t('guideManagement.title')}
        </h2>
        <p className="text-gray-600 mt-2 text-sm">{t('guideManagement.description')}</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder='search by name'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-xl shadow-md focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
        />
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="relative bg-white/70 backdrop-blur-xl border border-emerald-100 rounded-2xl p-6 shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent hover:border-emerald-400 transition-all duration-300 pointer-events-none" />

              {/* Guide Info */}
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-emerald-300 shadow-sm">
                  <Image
                    src={guide.photo ? `/userimages/${guide.photo}` : '/pro.png'}
                    alt={guide.name}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{guide.name}</h3>
                  <p className="text-sm text-gray-500">{guide.email}</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                      guide.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {guide.status}
                  </span>
                </div>
              </div>

              {/* Assign Button */}
              <div className="mt-5">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm py-2 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                  onClick={() => handleToggleTours(guide.id)}
                >
                  {expandedGuideId === guide.id
                    ? t('guideManagement.hideTours')
                    : t('guideManagement.assignToTour')}
                </Button>

                {/* Tours List */}
                {expandedGuideId === guide.id && (
                  <div className="mt-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 rounded-lg border border-emerald-200 shadow-inner bg-white animate-fadeIn">
                    {loadingTours ? (
                      <p className="text-gray-500 text-sm p-4 text-center">
                        {t('guideManagement.loadingTours')}...
                      </p>
                    ) : tours.length > 0 ? (
                      tours.map((tour) => {
                        const isAssigned = tour.guides?.includes(guide.id);
                        return (
                          <div
                            key={tour._id}
                            className="border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors p-3 rounded-xl text-sm flex justify-between items-center shadow-sm mb-2 mx-2"
                          >
                            <span className="font-medium text-gray-800 truncate max-w-[160px]">
                              {tour.name}
                            </span>
                            <Button
                              size="sm"
                              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all duration-200 ${
                                isAssigned
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                              onClick={() =>
                                handleAssignTour(
                                  guide.email,
                                  tour._id,
                                  guide.id,
                                  isAssigned ?? false
                                )
                              }
                            >
                              {isAssigned
                                ? t('guideManagement.unassign')
                                : t('guideManagement.assign')}
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 p-4 text-center">
                        {t('guideManagement.noToursFound')}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full italic py-10">
           guide not found
          </p>
        )}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-6 text-sm">Loading guides...</p>
      )}
    </section>
  );
}
