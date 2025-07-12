'use client';

import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, MessageSquare, Lightbulb } from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { EvaluationCriteria } from '@/lib/ai-evaluation';

interface EvaluationResultsProps {
  evaluation: EvaluationCriteria;
  challengeTitle: string;
  onContinue?: () => void;
}

export function EvaluationResults({ evaluation, challengeTitle, onContinue }: EvaluationResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Satisfactory';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  const getOverallGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Complete</h3>
          <p className="text-gray-600 mb-6">{challengeTitle}</p>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">{evaluation.overall}</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{getOverallGrade(evaluation.overall)}</div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
          </div>

          <Badge variant={getScoreColor(evaluation.overall)} className="text-lg px-4 py-2">
            {getScoreLabel(evaluation.overall)}
          </Badge>
        </div>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Assessment</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${evaluation.accuracy}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluation.accuracy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Completeness</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${evaluation.completeness}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluation.completeness}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Methodology</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${evaluation.methodology}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluation.methodology}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Communication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${evaluation.communication}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{evaluation.communication}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Feedback */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <h4 className="text-lg font-semibold text-gray-900">Detailed Feedback</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{evaluation.feedback}</p>
          </div>
        </div>
      </Card>

      {/* Suggestions */}
      {evaluation.suggestions.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <h4 className="text-lg font-semibold text-gray-900">Improvement Suggestions</h4>
            </div>
            <div className="space-y-3">
              {evaluation.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Action Items */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h4>
          <div className="space-y-3">
            {evaluation.overall >= 80 ? (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Great work! You're ready to move to the next challenge.</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800">Consider reviewing the feedback and suggestions before proceeding.</span>
              </div>
            )}
            
            {evaluation.overall < 60 && (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800">This score indicates significant areas for improvement. Consider revisiting the challenge.</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Continue Button */}
      {onContinue && (
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue to Next Challenge
          </button>
        </div>
      )}
    </div>
  );
} 