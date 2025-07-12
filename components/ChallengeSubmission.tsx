'use client';

import React, { useState } from 'react';
import { Upload, FileText, Code, BarChart3, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';

interface SubmissionItem {
  id: string;
  type: 'file' | 'text' | 'code' | 'url';
  title: string;
  description: string;
  required: boolean;
  acceptedFormats?: string[];
  maxSize?: number; // in MB
}

interface ChallengeSubmissionProps {
  challengeId: string;
  challengeTitle: string;
  submissionItems: SubmissionItem[];
  onSubmit: (submissions: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export function ChallengeSubmission({ 
  challengeId, 
  challengeTitle, 
  submissionItems, 
  onSubmit, 
  isSubmitting = false 
}: ChallengeSubmissionProps) {
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileUpload = (itemId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      setSubmissions(prev => {
        const newSubmissions = { ...prev };
        delete newSubmissions[itemId];
        return newSubmissions;
      });
      return;
    }

    const file = files[0];
    const item = submissionItems.find(i => i.id === itemId);
    
    // Validate file type
    if (item?.acceptedFormats) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!item.acceptedFormats.includes(`.${fileExtension}`)) {
        setErrors(prev => ({
          ...prev,
          [itemId]: `File type not accepted. Please upload: ${item.acceptedFormats?.join(', ')}`
        }));
        return;
      }
    }

    // Validate file size
    if (item?.maxSize && file.size > item.maxSize * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [itemId]: `File too large. Maximum size: ${item.maxSize}MB`
      }));
      return;
    }

    setSubmissions(prev => ({
      ...prev,
      [itemId]: file
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });
  };

  const handleTextChange = (itemId: string, value: string) => {
    setSubmissions(prev => ({
      ...prev,
      [itemId]: value
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    submissionItems.forEach(item => {
      if (item.required && !submissions[item.id]) {
        newErrors[item.id] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(submissions);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'file': return <Upload className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      case 'code': return <Code className="h-5 w-5" />;
      case 'url': return <BarChart3 className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const isSubmitDisabled = () => {
    const requiredItems = submissionItems.filter(item => item.required);
    return requiredItems.some(item => !submissions[item.id]) || isSubmitting;
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Work</h3>
          <p className="text-sm text-gray-600 mb-6">
            Please submit your work for review. This will be evaluated using AI to assess quality and accuracy.
          </p>

          <div className="space-y-6">
            {submissionItems.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getItemIcon(item.type)}
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.required && <Badge variant="error" className="text-xs">Required</Badge>}
                  </div>
                  {item.acceptedFormats && (
                    <span className="text-xs text-gray-500">
                      Accepted: {item.acceptedFormats.join(', ')}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{item.description}</p>

                {item.type === 'file' && (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                      <input
                        type="file"
                        id={`file-${item.id}`}
                        className="hidden"
                        accept={item.acceptedFormats?.join(',')}
                        onChange={(e) => handleFileUpload(item.id, e.target.files)}
                      />
                      <label htmlFor={`file-${item.id}`} className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        {item.maxSize && (
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum size: {item.maxSize}MB
                          </p>
                        )}
                      </label>
                    </div>
                    {submissions[item.id] && (
                      <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          {(submissions[item.id] as File).name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {item.type === 'text' && (
                  <textarea
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                    placeholder="Enter your response..."
                    value={submissions[item.id] || ''}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                  />
                )}

                {item.type === 'code' && (
                  <div className="space-y-2">
                    <textarea
                      rows={12}
                      className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                      placeholder="Paste your code here..."
                      value={submissions[item.id] || ''}
                      onChange={(e) => handleTextChange(item.id, e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Include comments explaining your approach and any assumptions made.
                    </p>
                  </div>
                )}

                {item.type === 'url' && (
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600"
                    placeholder="https://..."
                    value={submissions[item.id] || ''}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                  />
                )}

                {errors[item.id] && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors[item.id]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="secondary"
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit for Review</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 