'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const bookings = [
  {
    id: 'B001',
    tourist: 'Amina Yusuf',
    tour: 'Danakil Depression Adventure',
    date: '2025-08-10',
    status: 'Paid',
  },
  {
    id: 'B002',
    tourist: 'Liam Johnson',
    tour: 'Lalibela Historical Tour',
    date: '2025-08-18',
    status: 'Pending',
  },
  {
    id: 'B003',
    tourist: 'Chen Wei',
    tour: 'Simien Mountains Trek',
    date: '2025-09-02',
    status: 'Paid',
  },
];

export default function GuideBookings() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">My Tour Bookings</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Booking ID</TableHead>
                <TableHead>Tourist</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.tourist}</TableCell>
                  <TableCell>{booking.tour}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
