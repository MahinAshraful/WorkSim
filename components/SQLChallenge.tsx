'use client';

import React, { useState } from 'react';
import { Database, Code, Send } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { ChallengeSubmission } from '@/components/ChallengeSubmission';
import { EvaluationResults } from '@/components/EvaluationResults';
import { SQLChallenge as SQLChallengeType } from '@/types';
import { evaluateSQLQuery, EvaluationCriteria } from '@/lib/ai-evaluation';

interface SQLChallengeProps {
  challenge: SQLChallengeType;
  onComplete: (success: boolean) => void;
}

export function SQLChallenge({ challenge, onComplete }: SQLChallengeProps) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationCriteria | null>(null);

  const handleSubmission = async (submissions: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      // Extract SQL query and explanation from submissions
      const query = submissions['sql_query'] || '';
      const explanation = submissions['query_explanation'] || '';
      
      // Evaluate using AI
      const evaluationResult = await evaluateSQLQuery(
        query,
        explanation,
        challenge.testCases[0]?.expectedColumns || []
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
      id: 'sql_query',
      type: 'code' as const,
      title: 'SQL Query',
      description: 'Write your SQL query to solve the challenge. Include comments explaining your approach.',
      required: true
    },
    {
      id: 'query_explanation',
      type: 'text' as const,
      title: 'Query Explanation',
      description: 'Explain your approach, any assumptions made, and why you chose this solution.',
      required: true
    },
    {
      id: 'expected_results',
      type: 'text' as const,
      title: 'Expected Results',
      description: 'Describe what results you expect from your query and why they solve the problem.',
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
      {/* Challenge Description */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-primary-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                <Badge variant="default">{challenge.difficulty}</Badge>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{challenge.description}</p>
          
          {challenge.hint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Code className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Hint</h4>
                  <p className="text-blue-800 text-sm">{challenge.hint}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Database Schema */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Database Schema</h4>
          <div className="space-y-4">
            {challenge.tables.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">{table.name}</h5>
                <div className="grid gap-2">
                  {table.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-gray-700">{col.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{col.type}</span>
                        {col.primaryKey && (
                          <Badge variant="success" className="text-xs">PK</Badge>
                        )}
                        {col.foreignKey && (
                          <Badge variant="warning" className="text-xs">FK</Badge>
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

      {/* Test Cases */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Expected Output</h4>
          <div className="space-y-3">
            {challenge.testCases.map((testCase, index) => (
              <div key={testCase.id} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Test Case {index + 1}</h5>
                <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                {testCase.expectedColumns && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expected columns:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {testCase.expectedColumns.map((col, colIndex) => (
                        <Badge key={colIndex} variant="default" className="text-xs">
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {testCase.expectedRows && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Expected rows: {testCase.expectedRows}
                    </span>
                  </div>
                )}
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
          <Code className="h-5 w-5" />
          <span>Submit SQL Solution</span>
        </Button>
      </div>
    </div>
  );
} 