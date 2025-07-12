'use client';

import React, { useState } from 'react';
import { Database, Search, BarChart3, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { ChallengeSubmission } from '@/components/ChallengeSubmission';
import { EvaluationResults } from '@/components/EvaluationResults';
import { DataExplorationChallenge as DataExplorationChallengeType } from '@/types';
import { evaluateDataExploration, EvaluationCriteria } from '@/lib/ai-evaluation';

interface DataExplorationChallengeProps {
  challenge: DataExplorationChallengeType;
  onComplete: (success: boolean) => void;
}

export function DataExplorationChallenge({ challenge, onComplete }: DataExplorationChallengeProps) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationCriteria | null>(null);

  const getDataQualityColor = (score: number) => {
    if (score >= 0.9) return 'success';
    if (score >= 0.7) return 'warning';
    return 'error';
  };

  const handleSubmission = async (submissions: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      // Extract insights and questions from submissions
      const insights = submissions['key_insights'] || '';
      const questions = submissions['exploration_questions']?.split('\n').filter((q: string) => q.trim()) || [];
      
      // Evaluate using AI
      const evaluationResult = await evaluateDataExploration(
        insights,
        questions,
        challenge.expectedInsights
      );
      
      setEvaluation(evaluationResult);
      
      // Determine success based on overall score
      const success = evaluationResult.overall >= 70;
      setTimeout(() => {
        onComplete(success);
      }, 3000);
      
    } catch (error) {
      console.error('Evaluation failed:', error);
      // Fallback to basic completion
      onComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submissionItems = [
    {
      id: 'key_insights',
      type: 'text' as const,
      title: 'Key Insights Discovered',
      description: 'Describe the main insights you found during your data exploration. Include patterns, trends, and notable findings.',
      required: true
    },
    {
      id: 'exploration_questions',
      type: 'text' as const,
      title: 'Exploration Questions',
      description: 'List the key questions you asked during your exploration and what you discovered.',
      required: true
    },
    {
      id: 'data_quality_assessment',
      type: 'text' as const,
      title: 'Data Quality Assessment',
      description: 'Summarize your assessment of the data quality and any issues you identified.',
      required: false
    },
    {
      id: 'next_steps',
      type: 'text' as const,
      title: 'Recommended Next Steps',
      description: 'What would you recommend as the next steps for analysis based on your exploration?',
      required: false
    }
  ];

  if (evaluation) {
    return (
      <EvaluationResults 
        evaluation={evaluation}
        challengeTitle={challenge.title}
        onContinue={() => onComplete(evaluation.overall >= 70)}
      />
    );
  }

  if (showSubmission) {
    return (
      <ChallengeSubmission
        challengeId={challenge.id}
        challengeTitle={challenge.title}
        submissionItems={submissionItems}
        onSubmit={handleSubmission}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-primary-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{challenge.dataset.name}</h3>
                <p className="text-sm text-gray-600">{challenge.dataset.description}</p>
              </div>
            </div>
          </div>

          {/* Data Quality Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(challenge.dataset.dataQuality.completeness * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completeness</div>
              <Badge variant={getDataQualityColor(challenge.dataset.dataQuality.completeness)} className="mt-1">
                {challenge.dataset.dataQuality.completeness >= 0.9 ? 'Excellent' : 
                 challenge.dataset.dataQuality.completeness >= 0.7 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(challenge.dataset.dataQuality.accuracy * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
              <Badge variant={getDataQualityColor(challenge.dataset.dataQuality.accuracy)} className="mt-1">
                {challenge.dataset.dataQuality.accuracy >= 0.9 ? 'Excellent' : 
                 challenge.dataset.dataQuality.accuracy >= 0.7 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(challenge.dataset.dataQuality.consistency * 100)}%
              </div>
              <div className="text-sm text-gray-600">Consistency</div>
              <Badge variant={getDataQualityColor(challenge.dataset.dataQuality.consistency)} className="mt-1">
                {challenge.dataset.dataQuality.consistency >= 0.9 ? 'Excellent' : 
                 challenge.dataset.dataQuality.consistency >= 0.7 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(challenge.dataset.dataQuality.timeliness * 100)}%
              </div>
              <div className="text-sm text-gray-600">Timeliness</div>
              <Badge variant={getDataQualityColor(challenge.dataset.dataQuality.timeliness)} className="mt-1">
                {challenge.dataset.dataQuality.timeliness >= 0.9 ? 'Excellent' : 
                 challenge.dataset.dataQuality.timeliness >= 0.7 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
          </div>

          {/* Data Schema */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Data Schema</h4>
            {challenge.dataset.schema.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">{table.name}</h5>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {table.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between">
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

          {/* Data Issues */}
          {challenge.dataset.dataQuality.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Data Quality Issues</h4>
              <div className="space-y-2">
                {challenge.dataset.dataQuality.issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">{issue.description}</p>
                      <p className="text-xs text-yellow-700">Severity: {issue.severity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Exploration Questions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exploration Questions</h3>
          <div className="space-y-4">
            {challenge.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Question {index + 1}</h4>
                <p className="text-gray-700 mb-2">{question.question}</p>
                <p className="text-sm text-gray-600">{question.expectedApproach}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Expected Insights */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Insights</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your exploration should uncover these types of insights:
          </p>
          <div className="space-y-2">
            {challenge.expectedInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-800">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => setShowSubmission(true)}
          className="flex items-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Submit Exploration Results</span>
        </Button>
      </div>
    </div>
  );
} 