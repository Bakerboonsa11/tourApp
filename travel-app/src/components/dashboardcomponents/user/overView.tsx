'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, CalendarCheck2, Star, PlaneTakeoff } from 'lucide-react';

export default function UserDashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-700">Welcome back, Boonsa!</h1>
        <p className="text-muted-foreground mt-1">Here’s what’s happening with your account today.</p>
      </div>

      {/* User Info */}
      <Card className="border-emerald-100 shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>BB</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Boonsa Baker</CardTitle>
            <p className="text-sm text-muted-foreground">boonsa@example.com</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Member since: <strong>March 2023</strong></p>
          <p className="text-sm text-muted-foreground mt-1">
            Last login:{' '}
            <span className="font-semibold text-emerald-600">July 23, 2025</span>
          </p>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <CalendarCheck2 className="text-emerald-700" size={32} />
            <div>
              <h3 className="text-lg font-semibold">3 Upcoming Trips</h3>
              <p className="text-muted-foreground text-sm">Next: Zanzibar Tour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <Star className="text-blue-600" size={32} />
            <div>
              <h3 className="text-lg font-semibold">12 Reviews Written</h3>
              <p className="text-muted-foreground text-sm">Average Rating: 4.6</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <PlaneTakeoff className="text-yellow-500" size={32} />
            <div>
              <h3 className="text-lg font-semibold">7 Completed Tours</h3>
              <p className="text-muted-foreground text-sm">Visited: 5 countries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Mount Kenya Expedition</p>
              <p className="text-sm text-muted-foreground">June 2025</p>
            </div>
            <Badge
              className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmed
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Rwanda Gorilla Safari</p>
              <p className="text-sm text-muted-foreground">May 2025</p>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Membership + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-muted-foreground text-sm">Membership Status:</p>
          <p className="font-semibold text-emerald-700">Gold Member</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default">Upgrade Plan</Button>
          <Button variant="secondary">Edit Profile</Button>
        </div>
      </div>
    </div>
  );
}
