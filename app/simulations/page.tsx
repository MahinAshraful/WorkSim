'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { SimulationCard } from '@/components/SimulationCard';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { JOB_SIMULATIONS } from '@/lib/constants';
import { JobCategory, Difficulty } from '@/types';

export default function Simulations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filteredSimulations = JOB_SIMULATIONS.filter((sim) => {
    const matchesSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sim.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || sim.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || sim.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Object.values(JobCategory);
  const difficulties = Object.values(Difficulty);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Animated morphing blob accent for grid area */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-tr from-primary-300 via-primary-100 to-primary-500 opacity-30 blur-3xl animate-blobMorph z-0" />
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Simulations</h1>
        <p className="text-lg text-gray-600">
          Choose from our library of professional simulations to practice real job skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search simulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'default'}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category 
                    ? 'bg-primary-600 text-white' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'default'}
                className={`cursor-pointer transition-all ${
                  selectedDifficulty === difficulty 
                    ? 'bg-primary-600 text-white' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setSelectedDifficulty(
                  selectedDifficulty === difficulty ? null : difficulty
                )}
              >
                {difficulty}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSimulations.map((simulation) => (
          <SimulationCard key={simulation.id} simulation={simulation} />
        ))}
      </div>

      {filteredSimulations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No simulations found matching your criteria.</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
              setSelectedDifficulty(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}