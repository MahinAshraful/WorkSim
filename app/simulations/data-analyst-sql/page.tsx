'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Clock, Target, CheckCircle, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { SQLEditor } from '@/components/SQLEditor';
import { SQL_CHALLENGES } from '@/data/sqlChallenges';
import { SQLChallenge, Difficulty } from '@/types';

export default function DataAnalystSQLSimulation() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const currentChallenge = SQL_CHALLENGES[currentChallengeIndex];
  const totalChallenges = SQL_CHALLENGES.length;
  const completedCount = completedChallenges.size;
  const progress = (completedCount / totalChallenges) * 100;

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  const handleChallengeComplete = (success: boolean, query: string) => {
    if (success) {
      const newCompleted = new Set(completedChallenges);
      newCompleted.add(currentChallenge.id);
      setCompletedChallenges(newCompleted);
      
      // Move to next challenge if available
      if (currentChallengeIndex < totalChallenges - 1) {
        setTimeout(() => {
          setCurrentChallengeIndex(currentChallengeIndex + 1);
        }, 1500);
      }
    }
    
    // Track attempts
    setAttempts(prev => ({
      ...prev,
      [currentChallenge.id]: (prev[currentChallenge.id] || 0) + 1
    }));
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.BEGINNER: return 'success';
      case Difficulty.INTERMEDIATE: return 'warning';
      case Difficulty.ADVANCED: return 'error';
      case Difficulty.EXPERT: return 'error';
      default: return 'default';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Link href="/simulations" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Simulations
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Analyst SQL Simulation</h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice real-world SQL queries and data analysis skills
          </p>
        </div>

        <Card className="mb-8">
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{totalChallenges} Challenges</h3>
                <p className="text-sm text-gray-600">Progressive difficulty levels</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">60 Minutes</h3>
                <p className="text-sm text-gray-600">Estimated completion time</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real Data</h3>
                <p className="text-sm text-gray-600">Authentic business scenarios</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What You'll Practice:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Queries</h4>
                    <p className="text-sm text-gray-600">SELECT, WHERE, ORDER BY</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Aggregations</h4>
                    <p className="text-sm text-gray-600">GROUP BY, COUNT, SUM, AVG</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Joins</h4>
                    <p className="text-sm text-gray-600">INNER, LEFT, RIGHT joins</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Subqueries</h4>
                    <p className="text-sm text-gray-600">Complex nested queries</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setShowInstructions(false)}
                className="group"
              >
                Start Simulation
                <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/simulations" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Analyst SQL Simulation</h1>
            <p className="text-gray-600">Challenge {currentChallengeIndex + 1} of {totalChallenges}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="font-semibold text-gray-900">{completedCount}/{totalChallenges}</p>
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <SQLEditor 
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Progress */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Challenges</h3>
              <div className="space-y-3">
                {SQL_CHALLENGES.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      index === currentChallengeIndex
                        ? 'border-primary-300 bg-primary-50'
                        : completedChallenges.has(challenge.id)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentChallengeIndex(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        completedChallenges.has(challenge.id)
                          ? 'bg-green-600 text-white'
                          : index === currentChallengeIndex
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completedChallenges.has(challenge.id) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{challenge.title}</p>
                        <Badge variant={getDifficultyColor(challenge.difficulty) as any} className="text-xs">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {attempts[challenge.id] && (
                      <span className="text-xs text-gray-500">
                        {attempts[challenge.id]} attempt{attempts[challenge.id] > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Database Schema */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Database Schema</h3>
              <div className="space-y-4">
                {currentChallenge.tables.map((table) => (
                  <div key={table.name} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">{table.name}</h4>
                    <div className="space-y-1">
                      {table.columns.map((col) => (
                        <div key={col.name} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-gray-700">{col.name}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">{col.type}</span>
                            {col.primaryKey && (
                              <Badge variant="success" className="text-xs">PK</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Use the hint button if you get stuck</p>
                <p>• Test your queries with small datasets first</p>
                <p>• Check the database schema for table structures</p>
                <p>• Use proper SQL syntax and formatting</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Modal */}
      {completedCount === totalChallenges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You've completed all SQL challenges. Great job on mastering these data analysis skills!
              </p>
              <div className="space-y-4">
                <Link href="/simulations">
                  <Button variant="primary" className="w-full">
                    Back to Simulations
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setCurrentChallengeIndex(0);
                    setCompletedChallenges(new Set());
                    setAttempts({});
                  }}
                >
                  Restart Simulation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}