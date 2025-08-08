'use client';

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  available: boolean;
  image?: string;
  role: 'guide' | 'user' | 'admin';

}

export default function GuideSettings() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const email = session?.user?.email;
      if (!email) return;
      try {
        const response = await axios.get(`/api/user/${email}`);
        setUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const handleToggleAvailability = async () => {
    if (!user) return;
    try {
      const updatedAvailable = !user.available;
      
      const response= await axios.patch(`/api/user/notform/${user._id}`, {
        available: updatedAvailable,
        
      });

      console.log('setting dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',response.data)
      setUser(prev => prev ? { ...prev, available: updatedAvailable } : prev);
      toast.success(`Availability updated to ${updatedAvailable ? "available" : "unavailable"}`);
    } catch (err) {
      toast.error("Failed to update availability");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700">Guide Settings</CardTitle>
          <CardDescription className="text-gray-500">Manage your tour availability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Profile Info */}
          <div className="w-16 h-16 rounded-full overflow-hidden border">
  <Image
    src={user.image ? `/userimages/${user.image}` : "/pro.png"}
    alt="Profile"
    width={64}
    height={64}
    className="object-cover"
  />
</div>


          {/* Bio */}
          {user.bio && (
            <div>
              <Label className="text-sm text-gray-600">Bio</Label>
              <p className="text-gray-700 text-sm mt-1">{user.bio}</p>
            </div>
          )}

          <Separator />

          {/* Availability Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="available" className="text-md font-medium">Available for Tours</Label>
            <Switch
              id="available"
              checked={user.available}
              onCheckedChange={handleToggleAvailability}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
