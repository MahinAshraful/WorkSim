import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface EvaluationCriteria {
  accuracy: number; // 0-100
  completeness: number; // 0-100
  methodology: number; // 0-100
  communication: number; // 0-100
  overall: number; // 0-100
  feedback: string;
  suggestions: string[];
}

export interface SubmissionData {
  challengeId: string;
  challengeType: string;
  challengeDescription: string;
  expectedOutcomes: string[];
  submissions: Record<string, any>;
}

export async function evaluateSubmission(submissionData: SubmissionData): Promise<EvaluationCriteria> {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('Google Gemini API key not configured');
    }

    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error('Evaluation request failed');
    }

    const data = await response.json();
    return data.evaluation;
  } catch (error) {
    console.error('AI evaluation error:', error);
    return {
      accuracy: 0,
      completeness: 0,
      methodology: 0,
      communication: 0,
      overall: 0,
      feedback: 'AI evaluation is not configured. Please set up the GOOGLE_GEMINI_API_KEY environment variable.',
      suggestions: ['Contact your administrator to configure AI evaluation.']
    };
  }
}

function generateEvaluationPrompt(submissionData: SubmissionData): string {
  const { challengeId, challengeType, challengeDescription, expectedOutcomes, submissions } = submissionData;
  
  let prompt = `You are an expert data analyst evaluating a submission for a data analyst challenge. 

CHALLENGE DETAILS:
- Challenge ID: ${challengeId}
- Challenge Type: ${challengeType}
- Description: ${challengeDescription}
- Expected Outcomes: ${expectedOutcomes.join(', ')}

SUBMITTED WORK:
`;

  // Add submission content based on type
  Object.entries(submissions).forEach(([key, value]) => {
    if (typeof value === 'string') {
      prompt += `\n${key}:\n${value}\n`;
    } else if (value instanceof File) {
      prompt += `\n${key}: [File uploaded: ${value.name}]\n`;
    }
  });

  prompt += `

EVALUATION CRITERIA:
1. ACCURACY (0-100): Are the findings and conclusions correct? Are calculations accurate?
2. COMPLETENESS (0-100): Does the work address all aspects of the challenge?
3. METHODOLOGY (0-100): Is the approach sound and well-reasoned?
4. COMMUNICATION (0-100): Is the work clearly presented and explained?

Please provide your evaluation in the following JSON format:
{
  "accuracy": [score],
  "completeness": [score],
  "methodology": [score],
  "communication": [score],
  "overall": [average of all scores],
  "feedback": "[Detailed feedback explaining scores]",
  "suggestions": ["[Specific improvement suggestions]"]
}

Be thorough but constructive in your evaluation. Focus on actionable feedback that would help improve the work.`;

  return prompt;
}

function parseEvaluationResponse(response: string): EvaluationCriteria {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        accuracy: Math.min(100, Math.max(0, parsed.accuracy || 0)),
        completeness: Math.min(100, Math.max(0, parsed.completeness || 0)),
        methodology: Math.min(100, Math.max(0, parsed.methodology || 0)),
        communication: Math.min(100, Math.max(0, parsed.communication || 0)),
        overall: Math.min(100, Math.max(0, parsed.overall || 0)),
        feedback: parsed.feedback || 'No feedback provided',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
  }

  // Fallback parsing if JSON extraction fails
  return {
    accuracy: 50,
    completeness: 50,
    methodology: 50,
    communication: 50,
    overall: 50,
    feedback: 'AI evaluation completed but response format was unexpected. Please review the work manually.',
    suggestions: ['Consider reviewing the submission manually for detailed feedback.']
  };
}

// Challenge-specific evaluation functions
export async function evaluateDataExploration(
  insights: string,
  questions: string[],
  expectedInsights: string[]
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'data-exploration',
    challengeType: 'Data Exploration',
    challengeDescription: 'Explore dataset and identify key insights',
    expectedOutcomes: expectedInsights,
    submissions: {
      'Identified Insights': insights,
      'Exploration Questions': questions.join('\n')
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluateDataCleaning(
  cleaningApproach: string,
  issuesIdentified: string[],
  fixesApplied: string[]
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'data-cleaning',
    challengeType: 'Data Cleaning',
    challengeDescription: 'Identify and fix data quality issues',
    expectedOutcomes: ['All data quality issues addressed', 'Data ready for analysis'],
    submissions: {
      'Cleaning Approach': cleaningApproach,
      'Issues Identified': issuesIdentified.join('\n'),
      'Fixes Applied': fixesApplied.join('\n')
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluateSQLQuery(
  query: string,
  explanation: string,
  expectedColumns: string[]
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'sql-query',
    challengeType: 'SQL Analysis',
    challengeDescription: 'Write SQL query to extract insights',
    expectedOutcomes: expectedColumns,
    submissions: {
      'SQL Query': query,
      'Query Explanation': explanation
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluateVisualization(
  chartDescription: string,
  insights: string,
  chartType: string
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'visualization',
    challengeType: 'Data Visualization',
    challengeDescription: 'Create effective data visualizations',
    expectedOutcomes: ['Clear visualization', 'Insights communicated', 'Appropriate chart type'],
    submissions: {
      'Chart Description': chartDescription,
      'Key Insights': insights,
      'Chart Type': chartType
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluateStatisticalAnalysis(
  analysis: string,
  conclusions: string,
  methodology: string
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'statistical-analysis',
    challengeType: 'Statistical Analysis',
    challengeDescription: 'Perform statistical analysis and hypothesis testing',
    expectedOutcomes: ['Sound methodology', 'Correct conclusions', 'Statistical significance'],
    submissions: {
      'Analysis': analysis,
      'Conclusions': conclusions,
      'Methodology': methodology
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluateABTesting(
  analysis: string,
  conclusions: string,
  recommendations: string
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'ab-testing',
    challengeType: 'A/B Testing',
    challengeDescription: 'Analyze A/B test results and make recommendations',
    expectedOutcomes: ['Statistical significance', 'Practical significance', 'Clear recommendations'],
    submissions: {
      'Analysis': analysis,
      'Conclusions': conclusions,
      'Recommendations': recommendations
    }
  };
  
  return evaluateSubmission(submissionData);
}

export async function evaluatePresentation(
  presentation: string,
  keyFindings: string,
  recommendations: string
): Promise<EvaluationCriteria> {
  const submissionData: SubmissionData = {
    challengeId: 'presentation',
    challengeType: 'Presentation',
    challengeDescription: 'Present findings to stakeholders',
    expectedOutcomes: ['Clear communication', 'Actionable insights', 'Professional presentation'],
    submissions: {
      'Presentation Content': presentation,
      'Key Findings': keyFindings,
      'Recommendations': recommendations
    }
  };
  
  return evaluateSubmission(submissionData);
} 