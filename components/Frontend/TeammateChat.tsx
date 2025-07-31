'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Code2 } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { ChatMessage, FrontendTask, CodeFile } from '@/types';

interface TeammateChatProps {
  currentTask: FrontendTask | null;
  codeFiles: CodeFile[];
}

export function TeammateChat({ currentTask, codeFiles }: TeammateChatProps) {
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

  // Initialize with helpful teammate message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'teammate',
        content: "Hey! I'm Alex, one of the senior frontend engineers here. I saw Sarah assigned you a new task. Feel free to ask me anything about our codebase, design system, or if you need help with implementation details. I'm here to help! 🚀",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

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

    // Simulate teammate response using Gemini
    try {
      const response = await getTeammateResponse(inputValue, currentTask, codeFiles, messages);
      
      setTimeout(() => {
        setIsTyping(false);
        const teammateMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'teammate',
          content: response,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, teammateMessage]);
      }, 1200);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'teammate',
          content: "Good question! For something like that, I'd suggest checking our component library first. We usually have utility functions in the `utils/` folder that might help. Feel free to ask if you need more specific guidance!",
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, fallbackMessage]);
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
                key={index}
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
  // Simulate helpful teammate responses
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = [
    // Questions about design system
    {
      keywords: ['design', 'system', 'style', 'css', 'tokens'],
      responses: [
        "Yeah! We have design tokens in `src/styles/tokens.js` with all our colors, spacing, and typography. Super helpful for consistency! 🎨",
        "Our design system is pretty solid. Check out the tokens file - it has everything you need. Sarah from design did a great job setting it up.",
        "For styling, we use the design tokens and try to keep things consistent. The colors and spacing are all defined there. Need help with anything specific?",
        "The design tokens are your friend! All the spacing, colors, and typography values are in there. Makes everything look cohesive 👍"
      ]
    },
    // Questions about hooks and utilities
    {
      keywords: ['hook', 'useinput', 'form', 'state', 'utility', 'util'],
      responses: [
        "Oh definitely! The `useInput` hook in `utils/hooks.js` is perfect for form state. It handles value, errors, and validation really nicely.",
        "We have some great utilities! The `useInput` hook is super handy for forms - handles all the state management for you. Check it out! 🪝",
        "For form stuff, definitely use the `useInput` hook. It's in `utils/hooks.js` and saves you a ton of boilerplate. Really clean API too.",
        "The `useInput` hook is a lifesaver for forms! Alex (the previous Alex, not me 😄) built it and it's really well designed."
      ]
    },
    // Questions about validation
    {
      keywords: ['valid', 'validate', 'email', 'password', 'error'],
      responses: [
        "For validation, we have `validateEmail` and `validatePassword` functions in `utils/validators.js`. They're pretty straightforward to use!",
        "The validation functions are in the validators file. `validateEmail` uses a solid regex pattern that catches most edge cases. 📧",
        "We've got email and password validation utilities already set up. They're in `utils/validators.js` - just import and use them!",
        "The validation functions work great! `validateEmail` is particularly good - handles all the weird email edge cases you don't want to think about."
      ]
    },
    // Questions about React patterns
    {
      keywords: ['react', 'component', 'pattern', 'prop', 'typescript'],
      responses: [
        "We generally follow pretty standard React patterns here. TypeScript interfaces for props, functional components, and hooks for state. Keep it simple! ⚛️",
        "For React patterns, we like to keep components small and focused. One responsibility per component usually works well.",
        "TypeScript is your friend! Define good interfaces for your props and the rest usually falls into place. IntelliSense will love you.",
        "We're pretty conventional with our React patterns. Functional components, custom hooks for logic, and good prop interfaces. Nothing too fancy!"
      ]
    },
    // Questions about accessibility
    {
      keywords: ['accessibility', 'a11y', 'aria', 'screen reader'],
      responses: [
        "Great question! We take accessibility seriously here. Make sure to use semantic HTML, proper labels, and ARIA attributes where needed. 🌟",
        "For a11y, focus on semantic HTML first - that gets you like 80% of the way there. Then add ARIA labels for anything that needs extra context.",
        "Accessibility is super important! Use proper form labels, make sure everything is keyboard navigable, and test with a screen reader if you can.",
        "Love that you're thinking about accessibility! The basics: semantic HTML, proper labels, good color contrast, and keyboard navigation. You've got this! 💪"
      ]
    },
    // Questions about best practices
    {
      keywords: ['best', 'practice', 'convention', 'standard', 'clean'],
      responses: [
        "Our main conventions: keep components small, use TypeScript interfaces, extract custom hooks for reusable logic, and test the happy path at least! 📝",
        "Best practices here are pretty standard: good naming, small functions, proper TypeScript types, and don't over-engineer. Simple is good!",
        "We like clean, readable code over clever code. If someone else can't understand it in 6 months, it's probably too complex. Keep it simple! 🧹",
        "Main thing is consistency. Use the patterns you see in the existing codebase, follow the linting rules, and you'll be fine!"
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

  // Default encouraging responses
  const defaultResponses = [
    "That's a really good question! I'd probably approach it the same way you're thinking. Trust your instincts! 🤔",
    "Hmm, interesting challenge! What have you tried so far? Sometimes talking through it helps.",
    "I've run into similar issues before. Usually the simplest solution ends up being the right one. What are you thinking?",
    "That's exactly the kind of thing I would ask about too! Shows you're thinking about it the right way. 👍",
    "Good instincts! I'd probably go with whatever feels most maintainable. Future you will thank you for keeping it simple.",
    "Love the attention to detail! That kind of thinking makes for really solid code. What's your gut feeling on it?",
    "That's a great point I hadn't considered! How are you leaning towards solving it?",
    "Nice catch! Those are exactly the kinds of details that separate good code from great code. 🌟"
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}