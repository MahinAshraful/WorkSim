'use client';

import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { CodeFile } from '@/types';

interface CodeEditorProps {
  file: CodeFile | undefined;
  onChange: (filePath: string, content: string) => void;
}

export function CodeEditor({ file, onChange }: CodeEditorProps) {
  const [content, setContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setHasUnsavedChanges(false);
    }
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (file) {
      onChange(file.path, content);
      setHasUnsavedChanges(false);
    }
  };

  const handleReset = () => {
    if (file) {
      setContent(file.content);
      setHasUnsavedChanges(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default:
        return 'text';
    }
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Select a file to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-700">{file.name}</span>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
          )}
          {!file.editable && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Read-only</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-600 hover:text-gray-900"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          {file.editable && hasUnsavedChanges && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex bg-white">
        {/* Line Numbers */}
        <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col select-none">
          <div className="p-4 pt-4 pb-4 font-mono text-xs text-gray-400 text-right">
            {content.split('\n').map((_, index) => (
              <div key={`line-${index}`} className="h-[1.5em] leading-[1.5em]">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            readOnly={!file.editable}
            className={`w-full h-full p-4 pl-4 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0 ${
              file.editable 
                ? 'bg-white text-gray-900' 
                : 'bg-gray-50 text-gray-700 cursor-not-allowed'
            }`}
            style={{
              tabSize: 2,
              lineHeight: '1.5'
            }}
            spellCheck={false}
            placeholder={file.editable ? 'Start typing your code here...' : ''}
          />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Language: {getLanguageFromPath(file.path)}</span>
          <span>Lines: {content.split('\n').length}</span>
          <span>Characters: {content.length}</span>
        </div>
        
        {file.editable && (
          <div className="flex items-center gap-2">
            <span>Press Ctrl+S to save</span>
          </div>
        )}
      </div>
    </div>
  );
}