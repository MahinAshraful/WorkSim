'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Home, Trophy, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg group-hover:from-primary-600 group-hover:to-primary-700 transition-all">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">JobSim</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link href="/simulations" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Briefcase className="h-4 w-4" />
              <span>Simulations</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-up">
            <Link href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            <Link href="/simulations" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Simulations
            </Link>
            <Link href="/leaderboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Leaderboard
            </Link>
            <Link href="/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};