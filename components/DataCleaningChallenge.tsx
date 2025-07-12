'use client';

import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { ChallengeSubmission } from '@/components/ChallengeSubmission';
import { EvaluationResults } from '@/components/EvaluationResults';
import { DataCleaningChallenge as DataCleaningChallengeType } from '@/types';
import { evaluateDataCleaning, EvaluationCriteria } from '@/lib/ai-evaluation';

interface DataCleaningChallengeProps {
  challenge: DataCleaningChallengeType;
  onComplete: (success: boolean) => void;
}

export function DataCleaningChallenge({ challenge, onComplete }: DataCleaningChallengeProps) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationCriteria | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [appliedFixes, setAppliedFixes] = useState<Record<string, string>>({});
  const [dataQualityScore, setDataQualityScore] = useState(0.75); // Starting score

  const handleIssueSelect = (issueType: string) => {
    const newSelected = new Set(selectedIssues);
    if (newSelected.has(issueType)) {
      newSelected.delete(issueType);
    } else {
      newSelected.add(issueType);
    }
    setSelectedIssues(newSelected);
  };

  const handleFixApply = (issueType: string, fixType: string) => {
    setAppliedFixes(prev => ({ ...prev, [issueType]: fixType }));
    
    // Simulate quality improvement
    const qualityImprovement = 0.05;
    setDataQualityScore(prev => Math.min(1, prev + qualityImprovement));
  };

  const handleSubmission = async (submissions: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      // Extract cleaning approach and issues from submissions
      const cleaningApproach = submissions['cleaning_approach'] || '';
      const issuesIdentified = submissions['issues_identified']?.split('\n').filter((i: string) => i.trim()) || [];
      const fixesApplied = submissions['fixes_applied']?.split('\n').filter((f: string) => f.trim()) || [];
      
      // Evaluate using AI
      const evaluationResult = await evaluateDataCleaning(
        cleaningApproach,
        issuesIdentified,
        fixesApplied
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

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'missing_values': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'duplicates': return <RefreshCw className="h-4 w-4 text-orange-500" />;
      case 'outliers': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'inconsistent_format': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'data_type_mismatch': return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const submissionItems = [
    {
      id: 'cleaning_approach',
      type: 'text' as const,
      title: 'Data Cleaning Approach',
      description: 'Describe your overall approach to cleaning this dataset. What strategy did you use?',
      required: true
    },
    {
      id: 'issues_identified',
      type: 'text' as const,
      title: 'Issues Identified',
      description: 'List all the data quality issues you identified and their severity levels.',
      required: true
    },
    {
      id: 'fixes_applied',
      type: 'text' as const,
      title: 'Fixes Applied',
      description: 'Describe the specific fixes you applied to address each issue.',
      required: true
    },
    {
      id: 'quality_improvement',
      type: 'text' as const,
      title: 'Quality Improvement Results',
      description: 'Summarize how your cleaning improved the data quality and what metrics you used.',
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
              <FileText className="h-6 w-6 text-primary-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{challenge.dataset.name}</h3>
                <p className="text-sm text-gray-600">{challenge.dataset.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(dataQualityScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">Data Quality Score</div>
            </div>
          </div>

          {/* Quality Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${dataQualityScore * 100}%` }}
            />
          </div>

          {/* Target Quality */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Target Quality Standards</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Completeness:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {Math.round(challenge.expectedOutput.dataQualityThresholds.completeness! * 100)}%
                </span>
              </div>
              <div>
                <span className="text-blue-700">Accuracy:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {Math.round(challenge.expectedOutput.dataQualityThresholds.accuracy! * 100)}%
                </span>
              </div>
              <div>
                <span className="text-blue-700">Consistency:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {Math.round(challenge.expectedOutput.dataQualityThresholds.consistency! * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Issues */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Identify Data Quality Issues</h3>
          <div className="space-y-3">
            {challenge.issues.map((issue, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedIssues.has(issue.type)
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleIssueSelect(issue.type)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {issue.type.replace('_', ' ')}
                        </h4>
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <p className="text-xs text-gray-500">
                        Affected columns: {issue.affectedColumns.join(', ')}
                      </p>
                    </div>
                  </div>
                  {selectedIssues.has(issue.type) && (
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Fix Application */}
      {selectedIssues.size > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Data Cleaning Fixes</h3>
            <div className="space-y-4">
              {challenge.issues
                .filter(issue => selectedIssues.has(issue.type))
                .map((issue, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {getIssueIcon(issue.type)}
                      <h4 className="font-medium text-gray-900 capitalize">
                        {issue.type.replace('_', ' ')}
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Select appropriate fix:</h5>
                      <div className="grid gap-2">
                        {getFixOptions(issue.type).map((fix, fixIndex) => (
                          <Button
                            key={fixIndex}
                            variant={appliedFixes[issue.type] === fix.value ? 'primary' : 'secondary'}
                            size="sm"
                            className="justify-start"
                            onClick={() => handleFixApply(issue.type, fix.value)}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-xs bg-gray-100 rounded px-1 py-0.5">
                                {String.fromCharCode(65 + fixIndex)}
                              </span>
                              <div className="text-left">
                                <div className="font-medium">{fix.label}</div>
                                <div className="text-xs text-gray-600">{fix.description}</div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      {/* Expected Output */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Output</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expected dataset shape:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {challenge.expectedOutput.expectedShape[0]} rows × {challenge.expectedOutput.expectedShape[1]} columns
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expected columns:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {challenge.expectedOutput.expectedColumns.map((col, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Required transformations:</span>
              <ul className="mt-1 space-y-1">
                {challenge.expectedOutput.transformations.map((transformation, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>{transformation}</span>
                  </li>
                ))}
              </ul>
            </div>
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
          <FileText className="h-5 w-5" />
          <span>Submit Data Cleaning Results</span>
        </Button>
      </div>
    </div>
  );
}

function getFixOptions(issueType: string) {
  switch (issueType) {
    case 'missing_values':
      return [
        {
          value: 'imputation_mean',
          label: 'Mean Imputation',
          description: 'Replace missing values with column mean'
        },
        {
          value: 'imputation_median',
          label: 'Median Imputation',
          description: 'Replace missing values with column median'
        },
        {
          value: 'imputation_mode',
          label: 'Mode Imputation',
          description: 'Replace missing values with most frequent value'
        },
        {
          value: 'remove_rows',
          label: 'Remove Rows',
          description: 'Delete rows with missing values'
        }
      ];
    case 'duplicates':
      return [
        {
          value: 'remove_all',
          label: 'Remove All Duplicates',
          description: 'Keep only unique records'
        },
        {
          value: 'keep_first',
          label: 'Keep First Occurrence',
          description: 'Keep first duplicate, remove others'
        },
        {
          value: 'keep_last',
          label: 'Keep Last Occurrence',
          description: 'Keep last duplicate, remove others'
        }
      ];
    case 'outliers':
      return [
        {
          value: 'iqr_method',
          label: 'IQR Method',
          description: 'Remove outliers using IQR range'
        },
        {
          value: 'z_score',
          label: 'Z-Score Method',
          description: 'Remove outliers using z-score threshold'
        },
        {
          value: 'cap_values',
          label: 'Cap Values',
          description: 'Cap outliers at percentile thresholds'
        }
      ];
    case 'inconsistent_format':
      return [
        {
          value: 'standardize',
          label: 'Standardize Format',
          description: 'Apply consistent formatting rules'
        },
        {
          value: 'validate',
          label: 'Validate & Clean',
          description: 'Validate format and clean invalid entries'
        }
      ];
    case 'data_type_mismatch':
      return [
        {
          value: 'convert_types',
          label: 'Convert Data Types',
          description: 'Convert columns to appropriate data types'
        },
        {
          value: 'clean_and_convert',
          label: 'Clean & Convert',
          description: 'Clean data first, then convert types'
        }
      ];
    default:
      return [
        {
          value: 'general_clean',
          label: 'General Cleaning',
          description: 'Apply general data cleaning procedures'
        }
      ];
  }
} 