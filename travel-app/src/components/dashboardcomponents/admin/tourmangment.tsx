'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const tours = [
  {
    id: 'T001',
    name: 'Discover Ethiopia',
    region: 'East Africa',
    type: ['Cultural', 'History'],
    price: 399,
    status: 'active',
  },
  {
    id: 'T002',
    name: 'Blue Nile Adventure',
    region: 'North Africa',
    type: ['Adventure', 'Hiking'],
    price: 299,
    status: 'inactive',
  },
  {
    id: 'T003',
    name: 'Omo Valley Culture',
    region: 'South Africa',
    type: ['Wildlife', 'Cultural'],
    price: 499,
    status: 'active',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
};

export default function ToursManagement() {
  const [search, setSearch] = useState('');
  const [filteredTours, setFilteredTours] = useState(tours);

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = tours.filter((tour) =>
      tour.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTours(filtered);
  };

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-cyan-800 mb-6">Tours Management</h2>

      {/* Search Bar */}
      <div className="mb-6 max-w-sm">
        <Input
          type="text"
          placeholder="Search tours by name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Tours List */}
        <Card className="bg-white shadow-md border border-cyan-200">
          <CardHeader>
            <CardTitle className="text-cyan-700">All Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {filteredTours.length === 0 && (
                <p className="text-gray-500 text-center">No tours found.</p>
              )}
              {filteredTours.map((tour) => (
                <li
                  key={tour.id}
                  className="p-3 border border-gray-200 rounded-md hover:shadow-lg transition-shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{tour.name}</h3>
                    <p className="text-sm text-gray-500">{tour.region}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tour.type.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-700">${tour.price}</p>
                    <Badge className={`${statusColors[tour.status as keyof typeof statusColors]} mt-1 capitalize`}>
                      {tour.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Add New Tour */}
        <Card className="bg-white shadow-md border border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Add New Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input type="text" placeholder="Tour Name" required />
              <Input type="text" placeholder="Region" required />
              <Input type="text" placeholder="Type (comma separated)" required />
              <Input type="number" placeholder="Price" required />
              <Button type="submit" className="w-full" variant="outline" disabled>
                Save (Not Functional)
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card 3: Tour Statistics */}
        <Card className="bg-white shadow-md border border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-700">Tour Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <span className="font-semibold">Total Tours:</span> {tours.length}
              </li>
              <li>
                <span className="font-semibold">Active Tours:</span>{' '}
                {tours.filter((t) => t.status === 'active').length}
              </li>
              <li>
                <span className="font-semibold">Inactive Tours:</span>{' '}
                {tours.filter((t) => t.status === 'inactive').length}
              </li>
              <li>
                <span className="font-semibold">Average Price:</span> $
                {Math.round(tours.reduce((acc, t) => acc + t.price, 0) / tours.length)}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Card 4: Tour Actions */}
        <Card className="bg-white shadow-md border border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-700">Manage Tour Actions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTours.map((tour) => (
              <div key={tour.id} className="mb-4 border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">{tour.name}</h3>
                  <Badge className={`${statusColors[tour.status as keyof typeof statusColors]} text-xs`}>
                    {tour.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled>Edit</Button>
                  <Button size="sm" variant="destructive" disabled>Delete</Button>
                  <Button size="sm" variant="ghost" disabled>Archive</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
  <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
    <p className="text-base leading-relaxed">
      Ethiopia is home to <strong>11 UNESCO World Heritage Sites</strong>, making it one of the top cultural destinations in Africa.
      Use this dashboard to manage amazing experiences and share them with the world!
    </p>
  </div>
</div>
    </section>
  );
}
