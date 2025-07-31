'use client';

import React from 'react';
import { X, CheckCircle, Code, FileText, Send } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { FrontendTask, CodeFile } from '@/types';

interface SubmissionModalProps {
  task: FrontendTask;
  codeFiles: CodeFile[];
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function SubmissionModal({ 
  task, 
  codeFiles, 
  onSubmit, 
  onClose, 
  isSubmitting 
}: SubmissionModalProps) {
  const editableFiles = codeFiles.filter(file => file.editable);
  const hasChanges = editableFiles.some(file => 
    file.content !== task.starterCode.find(starter => starter.path === file.path)?.content
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Submit for Review</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ready to submit your work for AI evaluation?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Summary */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Task Summary
            </h3>
            <p className="text-sm text-gray-700 mb-3">{task.description}</p>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Acceptance Criteria:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {task.acceptanceCriteria.map((criteria, index) => (
                  <li key={`criteria-${index}-${criteria.substring(0, 15)}`} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Files Changed */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Code className="h-4 w-4" />
              Files to Submit
            </h3>
            {hasChanges ? (
              <div className="space-y-2">
                {editableFiles.map((file) => {
                  const originalFile = task.starterCode.find(starter => starter.path === file.path);
                  const hasFileChanges = file.content !== originalFile?.content;
                  return (
                    <div key={file.path} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        hasFileChanges ? 'bg-orange-400' : 'bg-gray-300'
                      }`} />
                      <span className="font-mono text-gray-700">{file.path}</span>
                      {hasFileChanges && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          Modified
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No changes detected in editable files.</p>
            )}
          </Card>

          {/* Evaluation Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">How Your Work Will Be Evaluated</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Functionality:</strong> Does your code meet the requirements?</li>
              <li>• <strong>Code Quality:</strong> Is your code clean, readable, and well-structured?</li>
              <li>• <strong>Best Practices:</strong> Do you follow React and TypeScript best practices?</li>
              <li>• <strong>Completeness:</strong> Have you addressed all acceptance criteria?</li>
            </ul>
          </div>

          {/* Warning if no changes */}
          {!hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> You haven't made any changes to the editable files. 
                You can still submit for feedback on the current code structure.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}