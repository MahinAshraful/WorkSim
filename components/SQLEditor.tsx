'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, CheckCircle, XCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { Badge } from './UI/Badge';
import { executeQuery, initSqlJs, setupDatabase } from '@/lib/sqlUtils';
import { SQLChallenge } from '@/types';
import { SAMPLE_DATABASE_SCHEMA, SAMPLE_DATA } from '@/data/sqlChallenges';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface SQLEditorProps {
  challenge: SQLChallenge;
  onComplete?: (success: boolean, query: string) => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ challenge, onComplete }) => {
  const [query, setQuery] = useState('-- Write your SQL query here\nSELECT * FROM employees LIMIT 5;');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | 'warning' | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setLoading(true);
        const database = await initSqlJs();
        await setupDatabase(database, SAMPLE_DATABASE_SCHEMA, SAMPLE_DATA);
        setDb(database);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError('Failed to initialize database. Please refresh the page and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initDatabase();
    }
  }, []);

  const validateQuery = (result: any, challenge: SQLChallenge): { success: boolean; message: string; status: 'success' | 'error' | 'warning' } => {
    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        message: 'Query executed successfully but returned no results. Check your WHERE conditions.',
        status: 'warning'
      };
    }

    // Check if expected columns are present
    if (challenge.testCases[0]?.expectedColumns) {
      const expectedColumns = challenge.testCases[0].expectedColumns;
      const actualColumns = result.columns;
      
      const missingColumns = expectedColumns.filter((col: string) => !actualColumns.includes(col));
      const extraColumns = actualColumns.filter((col: string) => !expectedColumns.includes(col));
      
      if (missingColumns.length > 0) {
        return {
          success: false,
          message: `Missing expected columns: ${missingColumns.join(', ')}`,
          status: 'error'
        };
      }
      
      if (extraColumns.length > 0) {
        return {
          success: false,
          message: `Unexpected columns found: ${extraColumns.join(', ')}. Only include the required columns.`,
          status: 'warning'
        };
      }
    }

    // Check expected row count if specified
    if (challenge.testCases[0]?.expectedRows && result.data.length !== challenge.testCases[0].expectedRows) {
      return {
        success: false,
        message: `Expected ${challenge.testCases[0].expectedRows} rows, but got ${result.data.length} rows`,
        status: 'warning'
      };
    }

    // Challenge-specific data validation
    if (challenge.id === 'challenge-1') {
      // Employee Salary Analysis validation
      const invalidRows = result.data.filter((row: any) => {
        return row.department !== 'Engineering' || 
               row.salary <= 100000 || 
               new Date(row.hire_date) <= new Date('2021-12-31');
      });
      
      if (invalidRows.length > 0) {
        return {
          success: false,
          message: `Your query returned ${invalidRows.length} rows that don't meet the criteria. All results must be Engineering employees with salary > $100,000 hired after 2021.`,
          status: 'error'
        };
      }
      
      // Check if we have the expected results
      const expectedEmployees = [1, 2, 4, 9]; // John Doe, Jane Smith, Alice Williams, Grace Anderson
      const returnedIds = result.data.map((row: any) => row.employee_id).sort();
      const expectedIds = expectedEmployees.sort();
      
      if (JSON.stringify(returnedIds) !== JSON.stringify(expectedIds)) {
        return {
          success: false,
          message: `Your query should return exactly 4 employees: John Doe, Jane Smith, Alice Williams, and Grace Anderson. Check your WHERE conditions.`,
          status: 'error'
        };
      }
    }

    // Challenge-specific data validation for other challenges
    if (challenge.id === 'challenge-2') {
      // Product Category Performance validation
      const categories = result.data.map((row: any) => row.category);
      const uniqueCategories = [...new Set(categories)];
      
      if (uniqueCategories.length < 3) {
        return {
          success: false,
          message: 'Your query should return results for all product categories (Electronics, Furniture, Stationery).',
          status: 'error'
        };
      }
      
      // Check if results are ordered by total_revenue descending
      for (let i = 0; i < result.data.length - 1; i++) {
        if (result.data[i].total_revenue < result.data[i + 1].total_revenue) {
          return {
            success: false,
            message: 'Results should be ordered by total_revenue in descending order.',
            status: 'error'
          };
        }
      }
    }

    if (challenge.id === 'challenge-4') {
      // Top Performing Products validation
      if (result.data.length !== 3) {
        return {
          success: false,
          message: 'Your query should return exactly 3 products (top 3 by quantity sold).',
          status: 'error'
        };
      }
      
      // Check if results are ordered by total_quantity descending
      for (let i = 0; i < result.data.length - 1; i++) {
        if (result.data[i].total_quantity < result.data[i + 1].total_quantity) {
          return {
            success: false,
            message: 'Results should be ordered by total_quantity in descending order.',
            status: 'error'
          };
        }
      }
    }

    // Basic validation passed
    return {
      success: true,
      message: 'Great job! Your query looks correct and returns the expected results.',
      status: 'success'
    };
  };

  const handleExecute = () => {
    if (!db) {
      setError('Database not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setValidationMessage(null);
    setValidationStatus(null);

    const startTime = performance.now();

    setTimeout(() => {
      const result = executeQuery(db, query);
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));

      if (result.success) {
        setResults(result);
        
        // Validate the query against challenge requirements
        const validation = validateQuery(result, challenge);
        setValidationMessage(validation.message);
        setValidationStatus(validation.status);
        
        if (onComplete) {
          onComplete(validation.success, query);
        }
      } else {
        setError(result.error);
        setValidationStatus('error');
      }
      setLoading(false);
    }, 300); // Simulate execution time
  };

  const handleReset = () => {
    setQuery('-- Write your SQL query here\nSELECT * FROM employees LIMIT 5;');
    setResults(null);
    setError(null);
    setExecutionTime(null);
    setValidationMessage(null);
    setValidationStatus(null);
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
            <Badge variant="warning">{challenge.difficulty}</Badge>
          </div>
          <p className="text-gray-600 mb-4">{challenge.description}</p>
          
          {challenge.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHint ? 'Hide' : 'Show'} Hint</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-800">{challenge.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">SQL Editor</h4>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecute}
                disabled={loading || !db}
              >
                <Play className="h-4 w-4 mr-1" />
                {loading ? 'Running...' : 'Run Query'}
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <MonacoEditor
              height="300px"
              language="sql"
              theme="vs-light"
              value={query}
              onChange={(value) => setQuery(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true },
              }}
            />
          </div>
        </div>
      </Card>

      {(results || error || validationMessage) && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Results</h4>
              {executionTime !== null && (
                <span className="text-sm text-gray-500">
                  Executed in {executionTime}ms
                </span>
              )}
            </div>
            
            {error ? (
              <div className="flex items-start space-x-2 text-red-600">
                <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            ) : results && (
              <div>
                {results.data.length === 0 ? (
                  <p className="text-gray-500 text-sm">Query executed successfully but returned no results.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {results.columns.map((col: string) => (
                            <th
                              key={col}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.data.slice(0, 10).map((row: any, idx: number) => (
                          <tr key={idx}>
                            {results.columns.map((col: string) => (
                              <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row[col] !== null ? String(row[col]) : 'NULL'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {results.data.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2 px-6">
                        Showing first 10 of {results.data.length} rows
                      </p>
                    )}
                  </div>
                )}
                
                {validationMessage && (
                  <div className={`mt-4 flex items-start space-x-2 ${getValidationColor()}`}>
                    {getValidationIcon()}
                    <p className="text-sm">{validationMessage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Available Tables</h4>
          <div className="space-y-4">
            {challenge.tables.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">{table.name}</h5>
                <div className="text-sm text-gray-600">
                  <div className="grid grid-cols-3 gap-2">
                    {table.columns.map((col) => (
                      <div key={col.name} className="flex items-center space-x-1">
                        <span className="font-mono">{col.name}</span>
                        <span className="text-gray-400">({col.type})</span>
                        {col.primaryKey && <Badge variant="success" className="text-xs">PK</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};