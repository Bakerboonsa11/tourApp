'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const staticBookings = [
  {
    id: 'B001',
    customer: 'Alice Johnson',
    tour: 'Discover Ethiopia',
    date: '2025-08-05',
    status: 'confirmed',
    amount: '$399',
  },
  {
    id: 'B002',
    customer: 'Samuel Abebe',
    tour: 'Blue Nile Adventure',
    date: '2025-09-15',
    status: 'pending',
    amount: '$299',
  },
  {
    id: 'B003',
    customer: 'Helen Tadesse',
    tour: 'Omo Valley Culture',
    date: '2025-07-30',
    status: 'cancelled',
    amount: '$0',
  },
];

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingsSection() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredBookings = staticBookings.filter((b) => {
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-cyan-800 text-2xl">Bookings Management</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage all customer bookings, update status, and view history.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Input
              type="text"
              placeholder="Search by customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52"
            />

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-3">Booking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Tour</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{b.id}</td>
                  <td className="p-3">{b.customer}</td>
                  <td className="p-3">{b.tour}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">
                    <Badge className={`${statusColors[b.status as keyof typeof statusColors]} capitalize`}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-3">{b.amount}</td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="ghost" className="text-red-600">Cancel</Button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
