'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Types } from 'mongoose';
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

interface Transaction {
  tx_ref: string;
  payment_method: string;
  payment_status: string;
  payment_date: Date;
}
export interface Tour {
  _id: string;
  status:string
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[]; // e.g., ['adventure', 'forest', 'mountain']
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[]; // image paths or URLs
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[]; // ISO date strings
  endDate: string; // ISO date string
  likes: string[]; // user IDs who liked
  comments: {
    user: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string; // ISO date string
  guides: string[]; // guide user IDs
  __v: number;
}




export interface IBooking {
  _id: Types.ObjectId;
  tour: Tour
  user: Types.ObjectId | string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: Transaction;
  createdAt: Date | string;
  updatedAt: Date | string;
}



const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingsSection() {
  const [emailSearch, setEmailSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get('/api/bookings');
        console.log('Fetched bookings:', res.data);
        setBookings(res.data.instanceFiltered || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleViewReceipt = async (book: IBooking) => {
    try {
      const res = await axios.get(`/api/receipt/${book.transaction.tx_ref}`);
      const user = await axios.get(`/api/user/${book.email}`);
      const data = res.data?.data;
  
      if (data) {
        const receiptHTML = `
        <html>
          <head>
            <title>Chapa Payment Receipt</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Segoe UI', Tahoma, sans-serif;
                background-color: #f3f4f6;
                color: #111827;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 800px;
                margin: 40px auto;
                background: #ffffff;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 24px;
              }
              .logo img {
                height: 60px;
              }
              h2 {
                text-align: center;
                font-size: 28px;
                color: #1e3a8a;
                margin-bottom: 30px;
              }
              .section {
                margin-bottom: 24px;
              }
              .section-title {
                font-size: 20px;
                margin-bottom: 12px;
                font-weight: 600;
                color: #374151;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 6px;
              }
              .info {
                margin-bottom: 8px;
                font-size: 16px;
                line-height: 1.5;
              }
              .info strong {
                color: #374151;
              }
              .highlight {
                color: #059669;
                font-weight: 600;
              }
              .badge {
                background: #1e40af;
                color: white;
                padding: 4px 10px;
                border-radius: 9999px;
                font-size: 12px;
                float: right;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #6b7280;
                margin-top: 40px;
              }
              .download-btn {
                display: block;
                margin: 30px auto 0;
                background-color: #1e3a8a;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s ease;
              }
              .download-btn:hover {
                background-color: #1d4ed8;
              }
      
              @media (max-width: 600px) {
                .container {
                  margin: 20px;
                  padding: 20px;
                }
                h2 {
                  font-size: 22px;
                }
                .section-title {
                  font-size: 18px;
                }
                .info {
                  font-size: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container" id="receipt">
              <div class="logo">
                <img src="/static/log.png" alt="Chapa Logo" />
              </div>
              <h2>🧾 Payment Receipt</h2>
      
              <div class="section">
                <div class="section-title">👤 Customer Info</div>
                <div class="info"><strong>Name:</strong> ${data.first_name}</div>
                <div class="info"><strong>Email:</strong> ${user.data.data.email}</div>
              </div>
      
              <div class="section">
                <div class="section-title">💳 Payment Details 
                  <span class="badge">${data.status.toUpperCase()}</span>
                </div>
                <div class="info"><strong>Transaction ID:</strong> ${data.tx_ref}</div>
                <div class="info"><strong>Amount:</strong> <span class="highlight">${data.amount} ${data.currency}</span></div>
                <div class="info"><strong>Date:</strong> ${new Date(data.created_at).toLocaleString()}</div>
              </div>
      
              <div class="section">
                <div class="section-title">🌍 Tour Info</div>
                <div class="info"><strong>Tour Name:</strong> ${data.tour?.name ?? 'N/A'}</div>
                <div class="info"><strong>Region:</strong> ${data.tour?.region ?? 'N/A'}</div>
                <div class="info"><strong>Duration:</strong> ${data.tour?.duration ?? 'N/A'} days</div>
              </div>
      
              <div class="footer">
                Thank you for traveling with us!<br />
                <strong>TravelXperience Tours</strong> 🌴✨
              </div>
      
              <button class="download-btn" onclick="downloadPDF()">Download PDF</button>
              <button class="download-btn" onclick="handlecancel()">Cancel</button>

            </div>
      
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
            <script>
              async function downloadPDF() {
                const { jsPDF } = window.jspdf;
                const receipt = document.getElementById('receipt');
                const canvas = await html2canvas(receipt);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const width = pdf.internal.pageSize.getWidth();
                const height = (canvas.height * width) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                pdf.save('${data.tx_ref}_receipt.pdf');
              }
              function handlecancel() {
              alert('Receipt download cancelled.');
                 window.location.reload();

              }
            </script>
          </body>
        </html>
      `;
      
  
        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
          receiptWindow.document.write(receiptHTML);
          receiptWindow.document.close();
        }
      } else {
        alert('No receipt found.');
      }
    } catch (err) {
      console.error('Failed to load receipt:', err);
      alert('Error fetching receipt.');
    }
  };
  
  
  

  const filteredBookings = bookings
    .filter((b) => {
      const matchesEmail = b.email.toLowerCase().includes(emailSearch.toLowerCase());
      const matchesDate =
        !dateSearch ||
        new Date(b.createdAt).toISOString().slice(0, 10) === dateSearch;
      return matchesEmail && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-cyan-800 text-2xl">Bookings Management</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Search by email or date, and sort bookings by date.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              type="text"
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-52"
            />
            <Input
              type="date"
              placeholder="Search by date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className="w-44"
            />
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-500 px-4 py-6">Loading bookings...</p>
          ) : (
            <table className="w-full border-collapse mt-2">
              <thead className="bg-cyan-100 text-cyan-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Booking ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Tour ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b._id.toString()} className="border-b hover:bg-cyan-50 transition">
                      <td className="p-3 font-mono text-xs text-gray-700">
                        {b._id.toString().slice(-6)}
                      </td>
                      <td className="p-3 text-sm text-gray-800">{b.email}</td>
                      <td className="p-3 text-sm text-gray-600">{b.tour?._id?.toString().slice(-6)}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge className={`${statusColors[b.status]} capitalize`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-green-700">{b.price} 💵</td>
                      <td className="p-3 space-x-2">
                      <Button
  size="sm"
  className="bg-cyan-600 hover:bg-cyan-700 text-white"
  onClick={() => handleViewReceipt(b)}
>
  View
</Button>

                       
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-6">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
