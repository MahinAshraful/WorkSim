'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Clock, Target, CheckCircle, Play, BookOpen, BarChart3, Database, PieChart, TrendingUp, Users, FileText, Presentation } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { DATA_ANALYST_PHASES, DATA_ANALYST_SIMULATION_CONFIG } from '@/data/dataAnalystChallenges';
import { ChallengeType, Difficulty } from '@/types';
import { DataExplorationChallenge } from '@/components/DataExplorationChallenge';
import { DataCleaningChallenge } from '@/components/DataCleaningChallenge';
import { SQLChallenge } from '@/components/SQLChallenge';

export default function ComprehensiveDataAnalystSimulation() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  const currentPhase = DATA_ANALYST_PHASES[currentPhaseIndex];
  const currentChallenge = currentPhase?.challenges[currentChallengeIndex];
  const totalPhases = DATA_ANALYST_PHASES.length;
  const completedPhaseCount = completedPhases.size;
  const progress = (completedPhaseCount / totalPhases) * 100;

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  const handleChallengeComplete = (success: boolean) => {
    if (success) {
      const newCompleted = new Set(completedChallenges);
      newCompleted.add(currentChallenge.id);
      setCompletedChallenges(newCompleted);
      
      // Check if phase is complete
      const phaseChallenges = currentPhase.challenges;
      const completedPhaseChallenges = phaseChallenges.filter(challenge => 
        newCompleted.has(challenge.id)
      );
      
      if (completedPhaseChallenges.length === phaseChallenges.length) {
        const newCompletedPhases = new Set(completedPhases);
        newCompletedPhases.add(currentPhase.id);
        setCompletedPhases(newCompletedPhases);
        
        // Move to next phase if available
        if (currentPhaseIndex < totalPhases - 1) {
          setTimeout(() => {
            setCurrentPhaseIndex(currentPhaseIndex + 1);
            setCurrentChallengeIndex(0);
          }, 2000);
        }
      } else {
        // Move to next challenge in current phase
        if (currentChallengeIndex < phaseChallenges.length - 1) {
          setTimeout(() => {
            setCurrentChallengeIndex(currentChallengeIndex + 1);
          }, 1500);
        }
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

  const getChallengeTypeIcon = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.SQL: return <Database className="h-4 w-4" />;
      case ChallengeType.DATA_EXPLORATION: return <BookOpen className="h-4 w-4" />;
      case ChallengeType.DATA_CLEANING: return <FileText className="h-4 w-4" />;
      case ChallengeType.VISUALIZATION: return <BarChart3 className="h-4 w-4" />;
      case ChallengeType.STATISTICAL_ANALYSIS: return <TrendingUp className="h-4 w-4" />;
      case ChallengeType.BUSINESS_INTELLIGENCE: return <PieChart className="h-4 w-4" />;
      case ChallengeType.AB_TESTING: return <Users className="h-4 w-4" />;
      case ChallengeType.DASHBOARD: return <BarChart3 className="h-4 w-4" />;
      case ChallengeType.PRESENTATION: return <Presentation className="h-4 w-4" />;
      case ChallengeType.DATA_STORYTELLING: return <FileText className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Data Analyst Simulation</h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience a complete data analyst workflow from data exploration to stakeholder presentation
          </p>
        </div>

        <Card className="mb-8">
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{totalPhases} Phases</h3>
                <p className="text-sm text-gray-600">Progressive skill building</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{formatTime(DATA_ANALYST_SIMULATION_CONFIG.totalEstimatedTime)}</h3>
                <p className="text-sm text-gray-600">Estimated completion time</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real Workflow</h3>
                <p className="text-sm text-gray-600">End-to-end analysis process</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stakeholder Focus</h3>
                <p className="text-sm text-gray-600">Business communication skills</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What You'll Practice:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Data Exploration & Cleaning</h4>
                    <p className="text-sm text-gray-600">Understand data quality and prepare for analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">SQL & Data Analysis</h4>
                    <p className="text-sm text-gray-600">Write complex queries and extract insights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Data Visualization</h4>
                    <p className="text-sm text-gray-600">Create compelling charts and dashboards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Statistical Analysis</h4>
                    <p className="text-sm text-gray-600">Perform hypothesis testing and correlation analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">A/B Testing</h4>
                    <p className="text-sm text-gray-600">Design and analyze experiments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Business Intelligence</h4>
                    <p className="text-sm text-gray-600">Track KPIs and create executive dashboards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Data Storytelling</h4>
                    <p className="text-sm text-gray-600">Communicate insights to stakeholders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Presentation Skills</h4>
                    <p className="text-sm text-gray-600">Deliver findings to business leaders</p>
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
                Start Comprehensive Simulation
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
            <h1 className="text-2xl font-bold text-gray-900">Comprehensive Data Analyst Simulation</h1>
            <p className="text-gray-600">
              Phase {currentPhaseIndex + 1} of {totalPhases}: {currentPhase.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="font-semibold text-gray-900">{completedPhaseCount}/{totalPhases} Phases</p>
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
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getChallengeTypeIcon(currentChallenge.type)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentChallenge.title}</h2>
                    <p className="text-gray-600">Challenge {currentChallengeIndex + 1} of {currentPhase.challenges.length}</p>
                  </div>
                </div>
                <Badge variant={getDifficultyColor(currentChallenge.difficulty)}>
                  {currentChallenge.difficulty}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-4">{currentChallenge.description}</p>
              
              {currentChallenge.hint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Hint</h4>
                      <p className="text-blue-800 text-sm">{currentChallenge.hint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Challenge-specific content will be rendered here based on type */}
              {currentChallenge.type === ChallengeType.DATA_EXPLORATION && (
                <DataExplorationChallenge 
                  challenge={currentChallenge as any}
                  onComplete={handleChallengeComplete}
                />
              )}
              {currentChallenge.type === ChallengeType.DATA_CLEANING && (
                <DataCleaningChallenge 
                  challenge={currentChallenge as any}
                  onComplete={handleChallengeComplete}
                />
              )}
              {currentChallenge.type as string === ChallengeType.SQL && (
                <SQLChallenge 
                  challenge={currentChallenge as any}
                  onComplete={handleChallengeComplete}
                />
              )}
              {!Object.values(ChallengeType).includes(currentChallenge.type as ChallengeType) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-center">
                    Challenge interface for {currentChallenge.type} will be implemented here
                  </p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => handleChallengeComplete(false)}
                    >
                      Skip Challenge
                    </Button>
                    <Button 
                      onClick={() => handleChallengeComplete(true)}
                    >
                      Complete Challenge
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-fade-in">
          {/* Phase Progress */}
          <Card className="rounded-2xl shadow-lg border border-primary-100 bg-white/95">
            <div className="p-6">
              <h3 className="font-semibold text-primary-900 mb-4 text-lg font-sans">Simulation Phases</h3>
              <div className="space-y-3">
                {DATA_ANALYST_PHASES.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all
                      ${index === currentPhaseIndex
                        ? 'border-primary-400 bg-primary-50 text-primary-900 shadow-sm'
                        : completedPhases.has(phase.id)
                        ? 'border-green-300 bg-green-50 text-green-800'
                        : 'border-primary-100 bg-white hover:border-primary-200 hover:bg-primary-50 text-primary-700'}
                    `}
                    onClick={() => {
                      setCurrentPhaseIndex(index);
                      setCurrentChallengeIndex(0);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Phase {phase.order}</span>
                      <Badge variant={index === currentPhaseIndex ? 'default' : 'default'} className="text-xs">
                        {formatTime(phase.estimatedTime)}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-base mb-1">{phase.title}</h4>
                    <p className="text-xs opacity-75">{phase.description}</p>
                    {completedPhases.has(phase.id) && (
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-xs text-green-700">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Current Phase Challenges */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Current Phase Challenges</h3>
              <div className="space-y-2">
                {currentPhase.challenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                      ${index === currentChallengeIndex
                        ? 'border-primary-300 bg-primary-50 text-primary-900'
                        : completedChallenges.has(challenge.id)
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'}
                    `}
                    onClick={() => setCurrentChallengeIndex(index)}
                  >
                    <div className="flex items-center space-x-2">
                      {getChallengeTypeIcon(challenge.type)}
                      <span className="text-sm font-medium">{challenge.title}</span>
                    </div>
                    <Badge variant={getDifficultyColor(challenge.difficulty)} className="text-xs">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Skills Progress */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Skills Progress</h3>
              <div className="space-y-3">
                {DATA_ANALYST_SIMULATION_CONFIG.skills.map((skill) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 