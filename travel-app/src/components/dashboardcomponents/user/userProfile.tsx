import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
  import {
    Mail,
    Lock,
    MapPin,
    Calendar,
    Phone,
    Globe,
    Twitter,
    Linkedin,
    LogOut,
    ShieldCheck,
    Bell,
    Activity,
    CreditCard,
    Smartphone,
  } from "lucide-react";
  import { useEffect,useState } from "react";
  import axios from "axios";
  import { useSession } from 'next-auth/react';

  interface User {
    _id: string;
    name: string;
    email: string;
    image:string
    role: 'user' | 'admin' | 'guide';
    password?: string;
    createdAt: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
      linkedin: string;
    };
  }
  
  
  export default function UserProfile() {
   const { data: session } = useSession();
   const [user ,setUser]=useState<User |null> (null)


  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return; // ensures it's a string
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        const userData: User = response.data.data;
        setUser(userData);
        console.log('user is ',userData)

        // find tours
        const tourResponse =await axios.get(`/api/tours`);
        console.log(tourResponse.data) 
     
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [session]);
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`/userimages/${user?.image}` || '/pro.png'} alt="User profile" />
              <AvatarFallback>BB</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.role}</p>
              <p className="text-sm text-muted-foreground">
  Last login:{' '}
  <span className="font-semibold">
    {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}
  </span>
</p>

            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">Edit Profile</Button>
            </div>
          </div>
        </Card>
  
        {/* Grid for Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
              <CardDescription>Your personal contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<Mail />} label="Email" value={user?.email} />
              <InfoRow icon={<Phone />} label="Phone" value="+251 911 123 456" />
              <InfoRow icon={<MapPin />} label="Location" value="Addis Ababa, Ethiopia" />
              <InfoRow icon={<Calendar />} label="Joined" value={user?.createdAt} />
            </CardContent>
          </Card>
  
          {/* Social Links */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <SocialButton icon={<Twitter />} label={`${user?.socialMedia?.twitter}`} />
              <SocialButton icon={<Linkedin />} label={`${user?.socialMedia?.linkedin}`} />
              <SocialButton icon={<Globe />} label="www.default.dev" />
            </CardContent>
          </Card>
  
          {/* Security */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<Lock />} label="Password" value="********" action="Change" />
              <InfoRow icon={<ShieldCheck />} label="2FA" value="Enabled" />
              <InfoRow icon={<Smartphone />} label="Devices" value="connected" />
              <InfoRow icon={<LogOut />} label="Sessions" action="Logout" />
            </CardContent>
          </Card>
  
          {/* Notifications */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<Bell />} label="Email Alerts" value="Enabled" />
              <InfoRow icon={<Bell />} label="SMS Alerts" value="Disabled" />
            </CardContent>
          </Card>
  
          {/* Activity */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<Activity />} label="Last login" value="Chrome on Ubuntu" />
              <InfoRow icon={<Calendar />} label="Last activity" value="2 hours ago" />
            </CardContent>
          </Card>
  
          {/* Billing */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<CreditCard />} label="Plan" value="Premium" />
              <InfoRow icon={<CreditCard />} label="Next Billing" value="Aug 12, 2025" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  function InfoRow({
    icon,
    label,
    value,
    action,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    action?: string;
  }) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-medium">{label}:</span>
        </div>
        <div className="flex items-center gap-2 text-right">
          {value && <span className="font-semibold text-foreground">{value}</span>}
          {action && (
            <Button variant="link" size="sm" className="px-0 text-blue-600">
              {action}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
      <Button variant="outline" className="justify-start gap-2 text-sm">
        {icon}
        {label}
      </Button>
    );
  }
  