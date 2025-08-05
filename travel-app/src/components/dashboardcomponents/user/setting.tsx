'use client';

import { useState,useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, User2 } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin'|'guide';
  password?: string;
  createdAt: string;
}

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const {data:session}=useSession()
  const [user,setUser]=useState<User|null>(null)


    useEffect(() => {
      const email = session?.user?.email;
      if (!email) return; // ensures it's a string
    
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
          const userData: User = response.data.data;
          setUser(userData);
  
    
        
          
       
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserData();
    }, [session]);

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white min-h-screen">
      <h2 className="text-4xl font-bold text-neutral-800 mb-6 text-center">⚙️ Settings</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-neutral-100 rounded-xl p-1 mb-6 flex justify-center gap-4">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            <User2 className="w-4 h-4 inline-block mr-1" /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            <Lock className="w-4 h-4 inline-block mr-1" /> Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            <Bell className="w-4 h-4 inline-block mr-1" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{user?.name}</Label>
              <Input id="name" placeholder={user?.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">{user?.email}</Label>
              <Input id="email" type="email" placeholder={user?.name} className="mt-1" />
            </div>
            <Button className="mt-4 bg-neutral-900 text-white hover:bg-neutral-700 rounded-xl">
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>
            <Button className="mt-4 bg-neutral-900 text-white hover:bg-neutral-700 rounded-xl">
              Update Password
            </Button>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label>Email Notifications</Label>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <p className="text-sm text-gray-500">
              You’ll receive booking confirmations, account updates, and offers.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
