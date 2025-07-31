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
}

export function ManagerChat({ currentTask, onTaskUpdate }: ManagerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message and first task
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'manager',
        content: "Hey there! Welcome to the team. I'm Sarah, your engineering manager. I have a task for you today that I think would be perfect for your skill level.",
        timestamp: new Date(),
        type: 'text'
      };

      setMessages([welcomeMessage]);

      // Simulate manager typing and then sending the first task
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const firstTask = frontendTasks[0];
          const taskMessage: ChatMessage = {
            id: '2',
            role: 'manager',
            content: firstTask.managerPrompt,
            timestamp: new Date(),
            type: 'text',
            metadata: { taskId: firstTask.id }
          };
          setMessages(prev => [...prev, taskMessage]);
          onTaskUpdate(firstTask);
        }, 2000);
      }, 1000);
    }
  }, [messages.length, onTaskUpdate]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate manager response using Gemini
    try {
      const response = await getManagerResponse(inputValue, currentTask, messages);
      
      setTimeout(() => {
        setIsTyping(false);
        const managerMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'manager',
          content: response,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, managerMessage]);
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'manager',
          content: "That's a great question! Feel free to use your best judgment on the implementation. If you need clarification on requirements, just let me know.",
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, fallbackMessage]);
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
                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
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
  // Simulate manager responses based on common questions
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = [
    // Questions about requirements
    {
      keywords: ['requirement', 'spec', 'what', 'how', 'clarify', 'clarification'],
      responses: [
        "Good question! For this task, I'd say focus on the core functionality first. We can always iterate on the design later.",
        "The main thing is making sure it works well on both desktop and mobile. Users access our app from everywhere!",
        "I intentionally kept some details flexible - use your best judgment. That's why we hired you!",
        "Check with Alex if you need specifics about our component patterns. They know our codebase really well."
      ]
    },
    // Questions about timeline
    {
      keywords: ['time', 'deadline', 'when', 'timeline', 'priority'],
      responses: [
        "No huge rush, but it would be great to have this done by end of week. Take your time to do it right.",
        "This is medium priority. Focus on getting it working correctly rather than rushing.",
        "The product team is asking about this, but I told them quality over speed. Do it right!"
      ]
    },
    // Questions about design/UX
    {
      keywords: ['design', 'ui', 'ux', 'look', 'style', 'color', 'font'],
      responses: [
        "We have design tokens in the styles folder - use those for consistency. Sarah in design put a lot of work into those!",
        "Keep it simple and clean. Our users prefer functionality over fancy animations.",
        "Make sure it's accessible! We take that seriously here. Check the WCAG guidelines if you need to.",
        "Alex can help you with the design system if you get stuck. They're great with that stuff."
      ]
    },
    // Questions about testing
    {
      keywords: ['test', 'testing', 'qa', 'bug'],
      responses: [
        "Write some basic tests if you have time, but don't stress about 100% coverage for this first version.",
        "The QA team will do a full pass later, but make sure it works in Chrome and Safari at least.",
        "Good thinking about edge cases! That's exactly the kind of thing that separates junior from senior engineers."
      ]
    },
    // General encouragement
    {
      keywords: ['help', 'stuck', 'difficult', 'hard', 'problem'],
      responses: [
        "You've got this! Don't hesitate to ask Alex or me if you need help. We're all here to support each other.",
        "Totally normal to feel overwhelmed on new tasks. Break it down into smaller pieces - that usually helps.",
        "Remember, perfect is the enemy of good. Get something working first, then we can polish it.",
        "That's a common challenge! Most of us have been there. The team is really helpful - just ask around."
      ]
    }
  ];

  // Find matching response category
  for (const category of responses) {
    if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
      const randomResponse = category.responses[Math.floor(Math.random() * category.responses.length)];
      return randomResponse;
    }
  }

  // Default responses for anything else
  const defaultResponses = [
    "That's a great question! Use your best judgment on that - I trust your technical expertise.",
    "Hmm, I hadn't thought about that angle. What do you think would work best?",
    "Good point! Go with whatever approach feels most maintainable to you.",
    "I'm curious what you're thinking. Any ideas on how to approach it?",
    "That's exactly the kind of detail-oriented thinking we need. Nice catch!",
    "Feel free to make that call - you're the technical expert here. I trust your judgment.",
    "Interesting! What are you leaning towards? I'd love to hear your thoughts."
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}