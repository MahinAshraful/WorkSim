'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { ChatMessage, FrontendTask } from '@/types';
import { frontendTasks } from '@/data/frontendTasks';

interface ManagerChatProps {
  currentTask: FrontendTask | null;
  onTaskUpdate: (task: FrontendTask) => void;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

export function ManagerChat({ currentTask, onTaskUpdate, messages, onMessagesChange }: ManagerChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message and first task (only once)
  useEffect(() => {
    if (messages.length === 0 && !hasInitialized) {
      setHasInitialized(true);
      
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'manager',
        content: "Hey there! Welcome to the team. I'm Sarah, your engineering manager. I have a task for you today that I think would be perfect for your skill level.",
        timestamp: new Date(),
        type: 'text'
      };

      onMessagesChange([welcomeMessage]);

      // Simulate manager typing and then sending the first task
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const firstTask = frontendTasks[0];
          const taskMessage: ChatMessage = {
            id: `task-${Date.now()}`,
            role: 'manager',
            content: firstTask.managerPrompt,
            timestamp: new Date(),
            type: 'text',
            metadata: { taskId: firstTask.id }
          };
          onMessagesChange(prev => [...prev, taskMessage]);
          onTaskUpdate(firstTask);
        }, 2000);
      }, 1000);
    }
  }, [messages.length, onTaskUpdate, hasInitialized, onMessagesChange]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    onMessagesChange(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate manager response using Gemini
    try {
      const response = await getManagerResponse(inputValue, currentTask, messages);
      
      setTimeout(() => {
        setIsTyping(false);
        const managerMessage: ChatMessage = {
          id: `manager-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'manager',
          content: response,
          timestamp: new Date(),
          type: 'text'
        };
        onMessagesChange(prev => [...prev, managerMessage]);
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMessage: ChatMessage = {
          id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'manager',
          content: "That's a great question! Feel free to use your best judgment on the implementation. If you need clarification on requirements, just let me know.",
          timestamp: new Date(),
          type: 'text'
        };
        onMessagesChange(prev => [...prev, fallbackMessage]);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
            <p className="text-sm text-gray-500">Engineering Manager</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Current Task Summary */}
      {currentTask && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <Card className="p-3">
            <h4 className="font-medium text-sm text-gray-900 mb-1">Current Task</h4>
            <p className="text-sm text-gray-600">{currentTask.title}</p>
            <div className="flex gap-2 mt-2">
              {currentTask.acceptanceCriteria.slice(0, 2).map((criteria, index) => (
                <span key={`criteria-${index}-${criteria.substring(0, 15)}`} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {criteria}
                </span>
              ))}
              {currentTask.acceptanceCriteria.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{currentTask.acceptanceCriteria.length - 2} more
                </span>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about requirements, timeline, or get clarification..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This is a simulated manager conversation using AI
        </p>
      </div>
    </div>
  );
}

async function getManagerResponse(
  userMessage: string, 
  currentTask: FrontendTask | null, 
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch('/api/chat/manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        currentTask,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get manager response');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Manager chat error:', error);
    
    // Fallback to a realistic response if API fails
    const fallbackResponses = [
      "That's a great question! Use your best judgment on that - I trust your technical expertise.",
      "Good point! Go with whatever approach feels most maintainable to you.",
      "Feel free to make that call - you're the technical expert here. I trust your judgment.",
      "That's exactly the kind of detail-oriented thinking we need. Nice catch!"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}