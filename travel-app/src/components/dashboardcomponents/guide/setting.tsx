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
import { Loader2 } from "lucide-react"; // spinner icon
import { useTranslations } from "next-intl";
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
  const [updating, setUpdating] = useState(false); // track toggle update
     const t = useTranslations('guideDashboard');
  
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
      setUpdating(true); // show loader
      const updatedAvailable = !user.available;

      const response = await axios.patch(`/api/user/notform/${user._id}`, {
        available: updatedAvailable,
      });

      setUser(prev => prev ? { ...prev, available: updatedAvailable } : prev);
      toast.success(`Availability updated to ${updatedAvailable ? "available ✅" : "unavailable ❌"}`);
    } catch (err) {
      toast.error("Failed to update availability");
    } finally {
      setUpdating(false); // hide loader
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700 font-bold">
            {t("sett.guideSettings")}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {t("sett.manageTourAvailability")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
  
          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-400 shadow-md">
              <Image
                src={user.image ? `/userimages/${user.image}` : "/pro.png"}
                alt="Profile"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
  
          {/* Bio */}
          {user.bio && (
            <div>
              <Label className="text-sm text-gray-600">{t("sett.bio")}</Label>
              <p className="text-gray-700 text-sm mt-1 bg-gray-50 p-3 rounded-md border">
                {user.bio}
              </p>
            </div>
          )}
  
          <Separator />
  
          {/* Availability Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="available" className="text-md font-medium">
              {t("sett.availableForTours")}
            </Label>
            <div className="flex items-center gap-2">
              {updating && (
                <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
              )}
              <Switch
                id="available"
                checked={user.available}
                disabled={updating} // disable while loading
                onCheckedChange={handleToggleAvailability}
              />
            </div>
          </div>
  
        </CardContent>
      </Card>
    </div>
  );
  
}
