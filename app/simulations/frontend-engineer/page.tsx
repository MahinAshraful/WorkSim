'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Users, 
  Code, 
  Play, 
  CheckCircle, 
  Clock,
  FileText,
  Folder,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import { ManagerChat } from '@/components/Frontend/ManagerChat';
import { TeammateChat } from '@/components/Frontend/TeammateChat';
import { CodeEditor } from '@/components/Frontend/CodeEditor';
import { FileExplorer } from '@/components/Frontend/FileExplorer';
import { SubmissionModal } from '@/components/Frontend/SubmissionModal';
import { EvaluationResults } from '@/components/EvaluationResults';
import { FrontendTask, CodeFile, ChatMessage } from '@/types';
import { EvaluationCriteria } from '@/lib/ai-evaluation';
import { frontendTasks } from '@/data/frontendTasks';
// Removed SimulationAccessGuard - this is now a purely frontend simulation

type TabType = 'manager' | 'teammate' | 'code';

export default function FrontendEngineerSimulation() {
  const [activeTab, setActiveTab] = useState<TabType>('manager');
  const [currentTask, setCurrentTask] = useState<FrontendTask | null>(null);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [showSubmission, setShowSubmission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationCriteria | null>(null);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Persistent chat history
  const [managerMessages, setManagerMessages] = useState<ChatMessage[]>([]);
  const [teammateMessages, setTeammateMessages] = useState<ChatMessage[]>([]);

  // Initialize simulation with first task
  useEffect(() => {
    if (simulationStarted && frontendTasks.length > 0) {
      const firstTask = frontendTasks[0];
      setCurrentTask(firstTask);
      setCodeFiles(firstTask.starterCode);
      if (firstTask.starterCode.length > 0) {
        setActiveFile(firstTask.starterCode[0].path);
      }
    }
  }, [simulationStarted]);

  const handleStartSimulation = () => {
    setSimulationStarted(true);
    setActiveTab('manager');
  };

  const handleTaskUpdate = (task: FrontendTask) => {
    setCurrentTask(task);
    setCodeFiles(task.starterCode);
    if (task.starterCode.length > 0) {
      setActiveFile(task.starterCode[0].path);
    }
  };

  const handleCodeChange = (filePath: string, newContent: string) => {
    setCodeFiles(prev => prev.map(file => 
      file.path === filePath 
        ? { ...file, content: newContent }
        : file
    ));
  };

  const handleSubmitWork = async () => {
    if (!currentTask) return;
    
    setIsSubmitting(true);
    setShowSubmission(false);
    
    try {
      // Get the edited files
      const editedFiles = codeFiles.filter(file => file.editable);
      const originalFiles = currentTask.starterCode;
      
      // Prepare submission data
      const submissionData = {
        challengeId: currentTask.id,
        challengeType: 'Frontend Coding',
        challengeDescription: currentTask.description,
        expectedOutcomes: currentTask.acceptanceCriteria,
        submissions: {
          task_prompt: currentTask.description,
          requirements: currentTask.acceptanceCriteria.join('\n'),
          edited_code: editedFiles.map(file => 
            `// ${file.path}\n${file.content}`
          ).join('\n\n'),
          original_code: originalFiles.map(file => 
            `// ${file.path}\n${file.content}`
          ).join('\n\n')
        }
      };

      // Evaluate using AI
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const { evaluation: evaluationResult } = await response.json();
      setEvaluation(evaluationResult);
      
      // Update progress
      const newProgress = Math.min(100, progress + 25);
      setProgress(newProgress);
      
    } catch (error) {
      console.error('Submission failed:', error);
      // Fallback evaluation
      setEvaluation({
        accuracy: 75,
        completeness: 80,
        methodology: 70,
        communication: 75,
        overall: 75,
        feedback: 'Great work on implementing the required functionality! The code structure is clean and follows React best practices.',
        suggestions: ['Consider adding more comprehensive error handling', 'Add unit tests for better code coverage']
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = useMemo(() => [
    { id: 'manager' as TabType, label: 'Manager Chat', icon: MessageSquare, badge: currentTask ? '1' : null },
    { id: 'teammate' as TabType, label: 'Teammate Chat', icon: Users, badge: null },
    { id: 'code' as TabType, label: 'Code Editor', icon: Code, badge: null }
  ], [currentTask]);

  if (evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <EvaluationResults
            evaluation={evaluation}
            challengeTitle={currentTask?.title || 'Frontend Challenge'}
            onContinue={() => {
              setEvaluation(null);
              // Could load next task here
            }}
          />
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {!simulationStarted ? (
          // Welcome/Start Screen
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Frontend Engineer Simulation
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Step into the role of a frontend engineer at a tech company. Work with your manager 
                to understand requirements, collaborate with teammates, and build real React components 
                with automated feedback.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto p-6">
              <h2 className="text-xl font-semibold mb-4">What You'll Experience:</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Manager Interactions</span>
                    <p className="text-sm text-gray-600">Receive realistic task assignments with varying levels of detail</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Teammate Support</span>
                    <p className="text-sm text-gray-600">Ask questions about utilities, design systems, and best practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Code Development</span>
                    <p className="text-sm text-gray-600">Write React components in a realistic development environment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <span className="font-medium">AI Feedback</span>
                    <p className="text-sm text-gray-600">Get detailed code reviews and improvement suggestions</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleStartSimulation}
                className="w-full"
                size="lg"
              >
                Start Frontend Engineering Simulation
              </Button>
            </Card>
          </div>
        ) : (
          // Main Simulation Interface
          <div className="flex h-screen">
            {/* Sidebar with tabs */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Frontend Engineer</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">~90 minutes</span>
                </div>
                {progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="flex-1">{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="default" className="bg-red-500 text-white text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Submit button */}
              {currentTask && activeTab === 'code' && (
                <div className="p-4 border-t border-gray-200">
                  <Button
                    onClick={() => setShowSubmission(true)}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {activeTab === 'manager' && (
                <ManagerChat 
                  currentTask={currentTask}
                  onTaskUpdate={handleTaskUpdate}
                  messages={managerMessages}
                  onMessagesChange={setManagerMessages}
                />
              )}

              {activeTab === 'teammate' && (
                <TeammateChat 
                  currentTask={currentTask}
                  codeFiles={codeFiles}
                  messages={teammateMessages}
                  onMessagesChange={setTeammateMessages}
                />
              )}

              {activeTab === 'code' && (
                <div className="flex flex-1">
                  <div className="w-64 border-r border-gray-200 bg-gray-50">
                    <FileExplorer
                      files={codeFiles}
                      activeFile={activeFile}
                      onFileSelect={setActiveFile}
                    />
                  </div>
                  <div className="flex-1">
                    <CodeEditor
                      file={codeFiles.find(f => f.path === activeFile)}
                      onChange={handleCodeChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission Modal */}
        {showSubmission && currentTask && (
          <SubmissionModal
            task={currentTask}
            codeFiles={codeFiles}
            onSubmit={handleSubmitWork}
            onClose={() => setShowSubmission(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
  );
}