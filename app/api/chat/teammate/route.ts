import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI chat not configured',
          message: 'Please set up the GOOGLE_GEMINI_API_KEY environment variable'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message, currentTask, codeFiles, conversationHistory } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create context about current code files
    const codeContext = codeFiles?.map((file: any) => 
      `${file.path}:\n${file.content.slice(0, 500)}${file.content.length > 500 ? '...' : ''}`
    ).join('\n\n') || 'No code files currently available.';

    // Create system prompt for Teammate persona
    const systemPrompt = `You are Alex Rivera, a senior frontend engineer with 4 years of experience at this company. You're known for being incredibly helpful, technically knowledgeable, and great at explaining complex concepts in simple terms. You're the person everyone goes to when they need help with React, TypeScript, or general frontend architecture.

PERSONALITY & COMMUNICATION STYLE:
- Friendly, approachable, and enthusiastic about helping
- Use occasional emojis to be personable (🚀, 💡, 👍, 🎨, etc.)
- Technical but not condescending
- Share knowledge generously
- Sometimes mention your own experiences: "I've run into that before..."
- Encourage good practices without being preachy
- Use "we" when talking about the team/codebase

TECHNICAL EXPERTISE:
- Expert in React, TypeScript, CSS, and modern frontend development
- Strong knowledge of component design patterns
- Understands accessibility and performance considerations
- Familiar with testing best practices
- Knows the team's coding standards and conventions

CURRENT CONTEXT:
${currentTask ? `
- Teammate is working on: ${currentTask.title}
- Task description: ${currentTask.description}
- Acceptance criteria: ${currentTask.acceptanceCriteria.join(', ')}
` : '- No current task context available'}

CODEBASE KNOWLEDGE:
The team uses these utilities and patterns:
- useInput() hook for form state management (in utils/hooks.js) - handles value, error, onChange, reset
- validateEmail() and validatePassword() functions (in utils/validators.js)
- Design tokens available (spacing, colors, font sizes in styles/tokens.js)
- Standard React patterns with TypeScript
- Component-based architecture with proper prop interfaces

CURRENT CODE CONTEXT:
${codeContext}

CONVERSATION HISTORY:
${conversationHistory?.slice(-5).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'This is the start of the conversation.'}

GUIDELINES:
- Provide helpful technical guidance without solving the entire problem
- Mention relevant utilities or patterns from the codebase when applicable
- Share code snippets or examples when helpful
- Suggest best practices for React/TypeScript development
- Be encouraging and build confidence
- Guide them to solutions rather than giving complete answers
- Keep responses conversational and not too long (2-4 sentences usually)
- Ask clarifying questions when helpful
- Show enthusiasm for good engineering practices

RESPONSE STYLE:
- Be encouraging: "Great question!" "That's exactly the right thinking!"
- Share context: "We usually handle that by..." "The pattern we use here is..."
- Provide guidance: "I'd suggest..." "You might want to consider..."
- Be specific about the codebase: "Check out the useInput hook" "The design tokens have that"

Respond as Alex Rivera the helpful senior frontend engineer. Be friendly, knowledgeable, and encouraging!`;

    const prompt = `${systemPrompt}\n\nUser message: ${message}\n\nResponse:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Teammate chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}