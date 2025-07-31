'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Code2 } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { ChatMessage, FrontendTask, CodeFile } from '@/types';

interface TeammateChatProps {
  currentTask: FrontendTask | null;
  codeFiles: CodeFile[];
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

export function TeammateChat({ currentTask, codeFiles, messages, onMessagesChange }: TeammateChatProps) {
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

  // Initialize with helpful teammate message (only once)
  useEffect(() => {
    if (messages.length === 0 && !hasInitialized) {
      setHasInitialized(true);
      
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'teammate',
        content: "Hey! I'm Alex, one of the senior frontend engineers here. I saw Sarah assigned you a new task. Feel free to ask me anything about our codebase, design system, or if you need help with implementation details. I'm here to help! 🚀",
        timestamp: new Date(),
        type: 'text'
      };
      onMessagesChange([welcomeMessage]);
    }
  }, [messages.length, hasInitialized, onMessagesChange]);

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

    // Simulate teammate response using Gemini
    try {
      const response = await getTeammateResponse(inputValue, currentTask, codeFiles, messages);
      
      setTimeout(() => {
        setIsTyping(false);
        const teammateMessage: ChatMessage = {
          id: `teammate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'teammate',
          content: response,
          timestamp: new Date(),
          type: 'text'
        };
        onMessagesChange(prev => [...prev, teammateMessage]);
      }, 1200);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMessage: ChatMessage = {
          id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'teammate',
          content: "Good question! For something like that, I'd suggest checking our component library first. We usually have utility functions in the `utils/` folder that might help. Feel free to ask if you need more specific guidance!",
          timestamp: new Date(),
          type: 'text'
        };
        onMessagesChange(prev => [...prev, fallbackMessage]);
      }, 1200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Do we have a design system I should follow?",
    "Are there any existing hooks I can use?",
    "What's our coding style for React components?",
    "How do we handle form validation here?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Code2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Alex Rivera</h3>
            <p className="text-sm text-gray-500">Senior Frontend Engineer</p>
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
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-green-600" />
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
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-green-600" />
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

      {/* Suggested Questions (only show if conversation is short) */}
      {messages.length <= 3 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Common questions:</h4>
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={`suggested-${index}-${question.substring(0, 20)}`}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about utilities, design system, best practices, or get code help..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="self-end bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This is a simulated teammate conversation using AI
        </p>
      </div>
    </div>
  );
}

async function getTeammateResponse(
  userMessage: string, 
  currentTask: FrontendTask | null, 
  codeFiles: CodeFile[],
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch('/api/chat/teammate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        currentTask,
        codeFiles,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get teammate response');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Teammate chat error:', error);
    
    // Fallback to encouraging responses if API fails
    const fallbackResponses = [
      "That's a really good question! I'd probably approach it the same way you're thinking. Trust your instincts! 🤔",
      "Good instincts! I'd probably go with whatever feels most maintainable. Future you will thank you for keeping it simple.",
      "Love the attention to detail! That kind of thinking makes for really solid code. What's your gut feeling on it?",
      "Nice catch! Those are exactly the kinds of details that separate good code from great code. 🌟"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}