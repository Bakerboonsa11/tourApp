'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
}

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
};
const handleAssignTour = async (email:string, tourId: string,guideId: string) => {
  try {
    const tour =await axios.get(`/api/tours/${tourId}`);
   if (!tour.data) {
    alert(`Assigned guide ${guideId} to tour ${tourId}`);
  }
  const guides= tour.data.guides || [];
  guides[0] = guideId; // Assign the guide to the tour
  await axios.patch(`/api/tours/${tourId}`, { guides }); // ✅ use tourId, not email
  alert(`Assigned guide ${guideId} to tour ${tourId}`);
  } catch (error) {
    console.error('Error assigning tour:', error);
    alert('Failed to assign tour. Please try again.');
  }
};

export default function GuideManagement() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);

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
      // Collapse if already open
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
    <section className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-7xl mx-auto mt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-cyan-900">Guide Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          View and assign registered guides to your tours with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <Image
                src={guide.photo || '/profile.png'}
                alt={guide.name}
                width={60}
                height={60}
                className="rounded-full object-cover border-2 border-cyan-300 shadow-sm"
              />
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
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm py-2 rounded-xl transition-all"
                onClick={() => handleToggleTours(guide.id)}
              >
                {expandedGuideId === guide.id ? 'Hide Tours' : 'Assign to Tour'}
              </Button>

              {expandedGuideId === guide.id && (
                <div className="mt-4 space-y-2">
                  {loadingTours ? (
                    <p className="text-gray-500 text-sm">Loading tours...</p>
                  ) : tours.length > 0 ? (
                    tours.map((tour) => (
                      <div
                        key={tour._id}
                        className="border border-cyan-100 bg-cyan-50 p-2 rounded-lg text-sm flex justify-between items-center"
                      >
                        <span>{tour.name}</span>
                        <Button
                          size="sm"
                          className="text-xs"
                          variant="outline"
                          onClick={() => handleAssignTour(guide.email ,tour._id, guide.id)
                         
                          }
                        >
                          Assign
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tours found.</p>
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
