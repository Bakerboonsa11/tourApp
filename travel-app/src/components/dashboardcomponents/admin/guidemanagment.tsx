// components/dashboard/GuideManagement.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Guide {
  id: string;
  name: string;
  email: string;
  photo: string;
  status: 'active' | 'inactive';
}

const dummyGuides: Guide[] = [
  {
    id: 'g1',
    name: 'John Doe',
    email: 'john@example.com',
    photo: '/images/guide1.jpg',
    status: 'active',
  },
  {
    id: 'g2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    photo: '/images/guide2.jpg',
    status: 'inactive',
  },
];

export default function GuideManagement() {
  const [guides, setGuides] = useState<Guide[]>(dummyGuides);

  return (
    <section className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-cyan-800 mb-2">Guide Management</h2>
      <p className="text-sm text-gray-600 mb-6">
        See all registered guides and assign them to tours.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={guide.photo}
                alt={guide.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{guide.name}</h3>
                <p className="text-sm text-gray-500">{guide.email}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    guide.status === 'active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {guide.status}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full" variant="secondary">
                Assign to Tour
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
