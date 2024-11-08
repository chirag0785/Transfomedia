"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Star,
  Settings,
  TrendingUp,
  Mail,
  FileText,
  ShieldAlert,
  Bell,
  BarChart3
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}


const StatCard = ({ title, value, icon, trend, trendUp }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const QuickAction = ({ title, description, icon, href }: QuickActionProps) => (
  <Link href={href}>
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gray-100 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);
interface Stats{
  totalUsers: string;
  activeUsers: string;
  testimonials: string;
  avgRating: string;
}
const AdminDashboard = () => {
  const router = useRouter();
  const {userId,isLoaded}=useAuth();
  useEffect(()=>{
    if(!userId && isLoaded){
      router.refresh();
      router.push('/');
      return;
    }

    if(userId){
      fetchStats()
    }

  },[userId])
  const [stats,setStats] = useState<Stats>({ totalUsers: '0', activeUsers: '0', testimonials: '0', avgRating: '0' });
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/get-admin-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6 text-blue-500" />}
            trend="12% this month"
            trendUp={true}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            trend="5% this week"
            trendUp={true}
          />
          <StatCard
            title="Testimonials"
            value={stats.testimonials}
            icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
          />
          <StatCard
            title="Average Rating"
            value={stats.avgRating}
            icon={<Star className="h-6 w-6 text-yellow-500" />}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickAction
                title="Manage Users"
                description="View and manage user accounts"
                icon={<Users className="h-6 w-6 text-blue-500" />}
                href="/admin/users"
              />
              <QuickAction
                title="Testimonials"
                description="Review and moderate testimonials"
                icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
                href="/admin/testimonials"
              />
              <QuickAction
                title="Analytics"
                description="View website statistics"
                icon={<BarChart3 className="h-6 w-6 text-green-500" />}
                href="/admin/analytics"
              />
              <QuickAction
                title="Content Management"
                description="Manage website content"
                icon={<FileText className="h-6 w-6 text-orange-500" />}
                href="/admin/content"
              />
              <QuickAction
                title="Messages"
                description="View user messages and inquiries"
                icon={<Mail className="h-6 w-6 text-red-500" />}
                href="/admin/messages"
              />
              <QuickAction
                title="Security"
                description="Manage security settings"
                icon={<ShieldAlert className="h-6 w-6 text-gray-500" />}
                href="/admin/security"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "New user registration: John Doe",
                "New testimonial submitted by Sarah Smith",
                "Content update: Homepage banner",
                "Security alert: Login attempt",
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span>{activity}</span>
                  <span className="text-sm text-gray-500">2 mins ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;