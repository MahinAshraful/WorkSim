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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              <p className="text-sm text-gray-500 mb-6">Member since {userData.joinDate}</p>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Edit Profile
                </Button>
                <form action={logout}>
                  <Button variant="secondary" className="w-full" type="submit">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userData.totalScore}</p>
              <p className="text-sm text-gray-600">Total Score</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userData.completedSimulations}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userData.totalTimeSpent}m</p>
              <p className="text-sm text-gray-600">Time Spent</p>
            </Card>
            <Card className="p-4 text-center">
              <BarChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{userData.averageScore}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.simulation}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <Badge variant="success" className="text-lg">
                    {activity.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Chart Placeholder */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Progress Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}