'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  FolderOpen, 
  Folder,
  Settings,
  FileCode,
  FileType,
  Palette
} from 'lucide-react';
import { CodeFile } from '@/types';

interface FileExplorerProps {
  files: CodeFile[];
  activeFile: string;
  onFileSelect: (filePath: string) => void;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  file?: CodeFile;
}

export function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/utils', 'src/styles']));

  // Build file tree from flat file list
  const buildFileTree = (files: CodeFile[]): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // First, create all folders
    files.forEach(file => {
      const pathParts = file.path.split('/');
      let currentPath = '';
      
      pathParts.forEach((part, index) => {
        const previousPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (index === pathParts.length - 1) {
          // This is a file
          const fileNode: FileNode = {
            name: part,
            path: currentPath,
            type: 'file',
            file: file
          };
          
          if (previousPath) {
            const parentFolder = folderMap.get(previousPath);
            if (parentFolder) {
              parentFolder.children = parentFolder.children || [];
              parentFolder.children.push(fileNode);
            }
          } else {
            tree.push(fileNode);
          }
        } else {
          // This is a folder
          if (!folderMap.has(currentPath)) {
            const folderNode: FileNode = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: []
            };
            
            folderMap.set(currentPath, folderNode);
            
            if (previousPath) {
              const parentFolder = folderMap.get(previousPath);
              if (parentFolder) {
                parentFolder.children = parentFolder.children || [];
                parentFolder.children.push(folderNode);
              }
            } else {
              tree.push(folderNode);
            }
          }
        }
      });
    });

    return tree;
  };

  const fileTree = buildFileTree(files);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case 'ts':
      case 'js':
        return <FileType className="h-4 w-4 text-yellow-500" />;
      case 'css':
        return <Palette className="h-4 w-4 text-purple-500" />;
      case 'html':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'json':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = node.type === 'file' && node.path === activeFile;
    const isEditable = node.file?.editable;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
            isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else if (node.file) {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'folder' && (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
            </>
          )}
          
          {node.type === 'file' && (
            <>
              {getFileIcon(node.name)}
            </>
          )}
          
          <span className={`flex-1 truncate ${!isEditable && node.type === 'file' ? 'text-gray-500' : ''}`}>
            {node.name}
          </span>
          
          {node.type === 'file' && !isEditable && (
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">readonly</span>
          )}
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children
              .sort((a, b) => {
                // Folders first, then files
                if (a.type !== b.type) {
                  return a.type === 'folder' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
              })
              .map(child => renderNode(child, depth + 1))
            }
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 p-3 bg-white">
        <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-600" />
          File Explorer
        </h3>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="py-1">
          {fileTree
            .sort((a, b) => {
              // Folders first, then files
              if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
              }
              return a.name.localeCompare(b.name);
            })
            .map(node => renderNode(node))
          }
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2 text-xs text-gray-500 bg-white">
        <div className="flex items-center justify-between">
          <span>{files.length} files</span>
          <span>{files.filter(f => f.editable).length} editable</span>
        </div>
      </div>
    </div>
  );
}