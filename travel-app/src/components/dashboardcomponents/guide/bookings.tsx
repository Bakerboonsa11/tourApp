'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";

export interface IBooking {
  _id: string;
  tour: {
    _id: string;
    name: string;
  };
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: unknown;
  createdAt: string;
  updatedAt: string;
}

export default function GuideBookings() {
  const [allUserBookings, setAllBooks] = useState<IBooking[]>([]);
  const t = useTranslations('guideDashboard');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingResponse = await axios.get('/api/bookings');
        setAllBooks(bookingResponse.data.instanceFiltered);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-white via-green-50 to-green-100">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        {t("book.myTourBookings")}
      </h2>
  
      <Card className="shadow-xl border border-green-100">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader className="bg-green-600 text-white">
              <TableRow>
                <TableHead className="text-white px-4 py-3 w-28">{t("book.bookingId")}</TableHead>
                <TableHead className="text-white px-4 py-3">{t("book.touristEmail")}</TableHead>
                <TableHead className="text-white px-4 py-3">{t("book.tour")}</TableHead>
                <TableHead className="text-white px-4 py-3">{t("book.date")}</TableHead>
                <TableHead className="text-white px-4 py-3">{t("book.status")}</TableHead>
              </TableRow>
            </TableHeader>
  
            <TableBody>
              {allUserBookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="hover:bg-green-50 transition-colors duration-200"
                >
                  <TableCell className="px-4 py-3 font-mono text-gray-700">
                    {booking._id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800">{booking.email}</TableCell>
                  <TableCell className="px-4 py-3 text-green-800 font-medium">{booking.tour.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {new Date(booking.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm inline-block
                        ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
  
              {allUserBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    {t("book.noBookings")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
}
