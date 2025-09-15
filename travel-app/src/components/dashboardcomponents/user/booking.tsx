"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export interface IBooking {
  _id: string;
  tour: string | { name: string }; // Simplified for display
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: unknown;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsSection() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredBookings = bookings.filter((booking) => {
    const name = typeof booking.tour === 'string' ? booking.tour : booking.tour?.name || '';
    const nameMatch = name.toLowerCase().includes(search.toLowerCase());
    const dateMatch = date ? format(new Date(booking.createdAt), 'yyyy-MM-dd') === date : true;
    return nameMatch && dateMatch;
  });

  useEffect(() => {
    if (!email) return;

    const fetchAllData = async () => {
      try {
        const res = await axios.get('/api/bookings');
        const allBookings = res.data.instanceFiltered || [];
        const userBookings = allBookings.filter((booking: IBooking) => booking.email === email);
        setBookings(userBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [email]);

  const t = useTranslations("user");

  return (
    <div className="min-h-screen bg-green-50 p-10 space-y-12 font-sans">
      {/* Search Card */}
      <Card className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100">
        <CardHeader className="px-8 py-6 border-b border-green-200">
          <CardTitle className="text-3xl font-semibold text-green-800 tracking-wide">
            {t("book.searchTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 py-8">
          <Input
            className="w-full p-4 rounded-xl border border-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            placeholder={t("book.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            type="date"
            className="w-full p-4 rounded-xl border border-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </CardContent>
      </Card>
  
      {/* Loading */}
      {loading ? (
        <p className="text-center text-green-600 text-lg font-medium animate-pulse">
          {t("book.loading")}
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredBookings.length === 0 ? (
            <p className="text-center col-span-full text-green-400 text-xl italic">
              {t("book.noBookings")}
            </p>
          ) : (
            filteredBookings.map((booking) => (
              <Card
                key={booking._id}
                className="bg-white rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="bg-green-50 px-6 py-4 rounded-t-2xl border-b border-green-100">
                  <CardTitle className="text-xl font-semibold text-green-700">
                    {typeof booking.tour === "string" ? booking.tour : booking.tour.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5 text-green-800 space-y-4 text-base">
                  <p>
                    <span className="font-medium">{t("book.price")}:</span> ${booking.price}
                  </p>
                  <p>
                    <span className="font-medium">{t("book.created")}:</span>{" "}
                    {format(new Date(booking.createdAt), "MMM d, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">{t("book.status")}:</span>{" "}
                    <span
                      className={`inline-block px-4 py-1 rounded-full font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-200 text-green-700"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
  
  
  
}
