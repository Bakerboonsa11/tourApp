"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO, isAfter, isBefore, addDays, compareAsc } from "date-fns";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Search, Calendar, MapPin, Clock, Star, TrendingUp, Filter, X } from "lucide-react";

export interface IBooking {
  _id: string;
  tour: string | { name: string; type?: string; startDate?: string };
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: "confirmed" | "pending" | "cancelled";
  transaction: unknown;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsSection() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const t = useTranslations("user");

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestBooking, setLatestBooking] = useState<IBooking | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch bookings
  useEffect(() => {
    if (!email) return;

    const fetchAllData = async () => {
      try {
        const res = await axios.get("/api/bookings");
        const allBookings = res.data.instanceFiltered || [];
        const userBookings = allBookings.filter(
          (booking: IBooking) => booking.email === email
        );
        setBookings(userBookings);

        // Find latest booked
        if (userBookings.length > 0) {
          const sorted = [...userBookings].sort(
            (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
          );
          setLatestBooking(sorted[0]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [email]);

  // Filter logic
  const filteredBookings = bookings.filter((booking) => {
    const name =
      typeof booking.tour === "string"
        ? booking.tour
        : booking.tour?.name || "";
    const nameMatch = name.toLowerCase().includes(search.toLowerCase());
    const dateMatch = date
      ? format(new Date(booking.createdAt), "yyyy-MM-dd") === date
      : true;
    const statusMatch = statusFilter
      ? booking.status === statusFilter
      : true;
    return nameMatch && dateMatch && statusMatch;
  });

  // Categorize by month
  const bookingsByMonth = filteredBookings.reduce((acc, booking) => {
    const month = format(parseISO(booking.createdAt), "MMMM yyyy");
    acc[month] = acc[month] || [];
    acc[month].push(booking);
    return acc;
  }, {} as Record<string, IBooking[]>);

  // Sort months chronologically (most recent first)
  const sortedMonths = Object.keys(bookingsByMonth).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Nearest upcoming bookings
  const nearestBookings = filteredBookings
    .filter((b) => {
      const start = typeof b.tour !== "string" && b.tour?.startDate
        ? parseISO(b.tour.startDate)
        : null;
      return start && isAfter(start, new Date());
    })
    .sort((a, b) => {
      const dateA =
        typeof a.tour !== "string" && a.tour?.startDate
          ? parseISO(a.tour.startDate)
          : new Date();
      const dateB =
        typeof b.tour !== "string" && b.tour?.startDate
          ? parseISO(b.tour.startDate)
          : new Date();
      return compareAsc(dateA, dateB);
    });

  // Statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);

  const clearFilters = () => {
    setSearch("");
    setDate("");
    setStatusFilter("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              My Travel Bookings
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Manage and track all your adventure bookings in one beautiful place
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-slate-900">{totalBookings}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Confirmed Tours</p>
                    <p className="text-3xl font-bold text-emerald-600">{confirmedBookings}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Star className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Spent</p>
                    <p className="text-3xl font-bold text-purple-600">ETB {totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-xl rounded-2xl mb-8">
          <CardHeader className="px-8 py-6 border-b border-slate-200/50">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Search className="w-6 h-6 text-blue-600" />
              Search & Filter Tours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Search tours..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="date"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  className="w-full pl-10 h-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Booking Highlight */}
        {latestBooking && (
          <div className="max-w-7xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              Most Recent Booking
            </h2>
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      {typeof latestBooking.tour === "string"
                        ? latestBooking.tour
                        : latestBooking.tour.name}
                    </h3>
                    <div className="space-y-3 text-blue-100">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">Price:</span> ETB {latestBooking.price.toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Booked:</span>{" "}
                        {format(new Date(latestBooking.createdAt), "MMM d, yyyy")}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          latestBooking.status === "confirmed"
                            ? "bg-emerald-500 text-white"
                            : latestBooking.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {latestBooking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Star className="w-16 h-16 text-yellow-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popup for latest booking */}
        {latestBooking && showPopup && (
          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="bg-white rounded-3xl p-8 shadow-2xl border-0 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Latest Booking
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="font-semibold text-slate-800 mb-2">
                    {typeof latestBooking.tour === "string"
                      ? latestBooking.tour
                      : latestBooking.tour.name}
                  </p>
                  <p className="text-slate-600">Price: ETB {latestBooking.price.toLocaleString()}</p>
                  <p className="text-slate-600">
                    Booked: {format(new Date(latestBooking.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 text-lg font-medium mt-4">Loading your bookings...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Upcoming Tours Section */}
            {nearestBookings.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-emerald-600" />
                  Upcoming Adventures
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {nearestBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} isUpcoming={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Monthly Sections */}
            {sortedMonths.map((month) => (
              <section key={month}>
                <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  {month}
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({bookingsByMonth[month].length} booking{bookingsByMonth[month].length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {bookingsByMonth[month].map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </section>
            ))}

            {/* Empty State */}
            {filteredBookings.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No bookings found</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Try adjusting your search criteria or clear the filters to see all your bookings.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, isUpcoming = false }: { booking: IBooking; isUpcoming?: boolean }) {
  const name =
    typeof booking.tour === "string" ? booking.tour : booking.tour?.name;
  const type =
    typeof booking.tour !== "string" ? booking.tour?.type || "Adventure" : "Tour";

  const statusColors = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
      isUpcoming 
        ? "bg-gradient-to-br from-emerald-50 to-blue-50 ring-2 ring-emerald-200" 
        : "bg-white/90 backdrop-blur-sm"
    }`}>
      {isUpcoming && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          UPCOMING
        </div>
      )}
      
      <CardHeader className={`relative overflow-hidden ${
        isUpcoming 
          ? "bg-gradient-to-r from-emerald-500 to-blue-500" 
          : "bg-gradient-to-r from-slate-600 to-slate-700"
      } text-white p-6`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
            {name}
          </CardTitle>
          <p className="text-sm opacity-90 font-medium">{type}</p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Price</span>
          <span className="text-2xl font-bold text-slate-900">
            ETB {booking.price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Booked Date</span>
          <span className="text-sm font-semibold text-slate-700">
            {format(new Date(booking.createdAt), "MMM d, yyyy")}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status]}`}>
            {booking.status.toUpperCase()}
          </span>
        </div>
        
        {booking.paid && (
          <div className="flex items-center justify-center pt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✓ PAID
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}