import { NextRequest, NextResponse } from 'next/server';
import { evaluateSubmission } from '@/lib/ai-evaluation';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI evaluation not configured',
          message: 'Please set up the GOOGLE_GEMINI_API_KEY environment variable'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { challengeId, challengeType, challengeDescription, expectedOutcomes, submissions } = body;

    // Validate required fields
    if (!challengeId || !challengeType || !submissions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Evaluate the submission using AI
    const evaluation = await evaluateSubmission({
      challengeId,
      challengeType,
      challengeDescription: challengeDescription || '',
      expectedOutcomes: expectedOutcomes || [],
      submissions
    });

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Evaluation API error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed' },
      { status: 500 }
    );
  }
} 