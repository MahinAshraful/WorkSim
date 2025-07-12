import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600">© 2024 JobSim. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};