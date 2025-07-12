import React from 'react';
import Link from 'next/link';
import { Clock, Users, Lock, ArrowRight } from 'lucide-react';
import { JobSimulation, Difficulty } from '@/types';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { Badge } from './UI/Badge';
import { cn } from '@/lib/utils';

interface SimulationCardProps {
  simulation: JobSimulation;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation }) => {
  const difficultyColors = {
    [Difficulty.BEGINNER]: 'success',
    [Difficulty.INTERMEDIATE]: 'warning',
    [Difficulty.ADVANCED]: 'error',
    [Difficulty.EXPERT]: 'error',
  };

  return (
    <Card 
      hover 
      className={cn(
        "relative overflow-hidden",
        !simulation.available && "opacity-75"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{simulation.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{simulation.title}</h3>
              <p className="text-sm text-gray-500">{simulation.category}</p>
            </div>
          </div>
          {!simulation.available && (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{simulation.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {simulation.skills.map((skill) => (
            <Badge key={skill} variant="default">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{simulation.estimatedTime} min</span>
            </div>
            <Badge variant={difficultyColors[simulation.difficulty] as any}>
              {simulation.difficulty}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {simulation.available ? (
            <Link href={`/simulations/${simulation.id}`} className="w-full">
              <Button variant="primary" className="w-full group">
                Start Simulation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled className="w-full">
              Coming Soon
            </Button>
          )}
        </div>
      </div>

      {!simulation.available && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent pointer-events-none" />
      )}
    </Card>
  );
};