'use client';

import React from 'react';
import { User, Trophy, Clock, Target, BarChart, LogOut } from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { logout } from '@/app/login/actions';

export default function Profile() {
  // Placeholder data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalScore: 1850,
    completedSimulations: 5,
    totalTimeSpent: 245, // minutes
    averageScore: 85,
    recentActivity: [
      { simulation: 'Data Analyst', score: 92, date: '2024-03-15' },
      { simulation: 'Frontend Engineer', score: 88, date: '2024-03-12' },
      { simulation: 'Product Manager', score: 85, date: '2024-03-10' },
    ],
    skills: ['SQL', 'Data Analysis', 'React', 'Problem Solving'],
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      {/* Animated accent blob in bottom right corner */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[220px] rounded-full bg-gradient-to-tr from-primary-200 via-primary-400 to-primary-700 opacity-25 blur-2xl animate-blobCorner z-0" />
      {/* (SVG background removed for new animated visual) */}
      <div className="grid lg:grid-cols-3 gap-10 relative z-10">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 rounded-2xl shadow-lg border border-primary-100 bg-white/95 animate-slide-up">
            <div className="text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <User className="h-14 w-14 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-primary-900 mb-2 font-sans">{userData.name}</h1>
              <p className="text-primary-700 mb-3 font-medium">{userData.email}</p>
              <p className="text-sm text-primary-400 mb-8">Member since {userData.joinDate}</p>
              <div className="space-y-4">
                <Button variant="primary" className="w-full rounded-xl text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600">
                  Edit Profile
                </Button>
                <form action={logout}>
                  <Button variant="secondary" className="w-full rounded-xl text-lg font-bold" type="submit">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border border-primary-100 bg-white/95 animate-slide-up">
            <h3 className="font-semibold text-primary-900 mb-4 text-lg font-sans">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill) => (
                <Badge key={skill} variant="default" className="bg-primary-50 text-primary-700 font-semibold px-3 py-1 rounded-lg">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="p-6 text-center rounded-2xl border border-primary-100 bg-white/95">
              <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-extrabold text-primary-900 mb-1">{userData.totalScore}</p>
              <p className="text-base text-primary-700 font-medium">Total Score</p>
            </Card>
            <Card className="p-6 text-center rounded-2xl border border-primary-100 bg-white/95">
              <Target className="h-10 w-10 text-primary-600 mx-auto mb-3" />
              <p className="text-3xl font-extrabold text-primary-900 mb-1">{userData.completedSimulations}</p>
              <p className="text-base text-primary-700 font-medium">Completed</p>
            </Card>
            <Card className="p-6 text-center rounded-2xl border border-primary-100 bg-white/95">
              <Clock className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-extrabold text-primary-900 mb-1">{userData.totalTimeSpent}m</p>
              <p className="text-base text-primary-700 font-medium">Time Spent</p>
            </Card>
            <Card className="p-6 text-center rounded-2xl border border-primary-100 bg-white/95">
              <BarChart className="h-10 w-10 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-extrabold text-primary-900 mb-1">{userData.averageScore}%</p>
              <p className="text-base text-primary-700 font-medium">Avg Score</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-8 rounded-2xl border border-primary-100 bg-white/95 animate-slide-up">
            <h3 className="font-semibold text-primary-900 mb-6 text-lg font-sans">Recent Activity</h3>
            <div className="space-y-5">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-primary-100 last:border-0">
                  <div>
                    <p className="font-semibold text-primary-900 mb-1">{activity.simulation}</p>
                    <p className="text-sm text-primary-400">{activity.date}</p>
                  </div>
                  <Badge variant="success" className="text-lg px-4 py-1 rounded-lg font-bold">
                    {activity.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Chart Placeholder */}
          <Card className="p-8 rounded-2xl border border-primary-100 bg-white/95 animate-slide-up">
            <h3 className="font-semibold text-primary-900 mb-6 text-lg font-sans">Progress Over Time</h3>
            <div className="h-64 bg-primary-50 rounded-xl flex items-center justify-center">
              <p className="text-primary-400 font-medium">Chart visualization would go here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}