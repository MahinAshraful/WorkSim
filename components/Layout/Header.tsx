'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Home, Trophy, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-primary-50 via-white to-primary-100/80 backdrop-blur-lg border-b border-primary-100 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl shadow-md group-hover:from-primary-700 group-hover:to-primary-600 transition-all">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-primary-900 tracking-tight font-sans drop-shadow-sm">JobSim</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-2 font-semibold text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-xl hover:bg-primary-100/60 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/simulations" className="flex items-center space-x-2 font-semibold text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-xl hover:bg-primary-100/60 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <Briefcase className="h-5 w-5" />
              <span>Simulations</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-2 font-semibold text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-xl hover:bg-primary-100/60 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-2 font-semibold text-primary-700 hover:text-primary-900 transition-colors px-3 py-2 rounded-xl hover:bg-primary-100/60 focus:outline-none focus:ring-2 focus:ring-primary-300">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl text-primary-700 hover:bg-primary-100/60 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-up bg-white/95 rounded-2xl shadow-lg mt-2 border border-primary-100">
            <Link href="/" className="block px-4 py-3 rounded-xl font-semibold text-primary-700 hover:bg-primary-100/60 transition-colors">Home</Link>
            <Link href="/simulations" className="block px-4 py-3 rounded-xl font-semibold text-primary-700 hover:bg-primary-100/60 transition-colors">Simulations</Link>
            <Link href="/leaderboard" className="block px-4 py-3 rounded-xl font-semibold text-primary-700 hover:bg-primary-100/60 transition-colors">Leaderboard</Link>
            <Link href="/profile" className="block px-4 py-3 rounded-xl font-semibold text-primary-700 hover:bg-primary-100/60 transition-colors">Profile</Link>
          </div>
        )}
      </nav>
    </header>
  );
};