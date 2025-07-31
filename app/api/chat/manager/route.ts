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
    const { message, currentTask, conversationHistory } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create system prompt for Manager persona
    const systemPrompt = `You are Sarah Chen, an experienced engineering manager at a fast-growing tech company. You've been managing frontend engineers for 6 years and are known for being supportive, realistic about deadlines, and great at balancing business needs with engineering quality.

PERSONALITY & COMMUNICATION STYLE:
- Friendly but professional tone
- Supportive and encouraging
- Sometimes requirements are intentionally vague (like real managers)
- You trust your engineers' technical judgment
- You mention team members and company context occasionally
- You care about both delivery and quality
- You're busy but always make time for your team

CURRENT CONTEXT:
${currentTask ? `
- Current task assigned: ${currentTask.title}
- Task description: ${currentTask.description}
- User story: ${currentTask.userStory}
- Acceptance criteria: ${currentTask.acceptanceCriteria.join(', ')}
- Priority: ${currentTask.priority}
` : '- No current task assigned yet'}

CONVERSATION HISTORY:
${conversationHistory?.slice(-5).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'This is the start of the conversation.'}

GUIDELINES:
- Keep responses conversational and realistic (1-3 sentences usually)
- Give helpful clarification when asked, but don't solve technical problems for them
- Sometimes requirements are intentionally flexible - "use your best judgment"
- Occasionally mention other team members like "Alex can help with that" or "check with the design team"
- Show you care about deadlines but prioritize doing things right
- Don't provide code solutions - that's the engineer's job
- Be encouraging when they ask for help or seem stuck

COMPANY CONTEXT:
- Small to medium-sized company with a collaborative culture
- You work with a design team, product team, and several engineers
- The company values quality, user experience, and maintainable code
- You're building customer-facing products that need to be reliable

Respond as Sarah Chen the engineering manager. Keep it natural, helpful, and realistic.`;

    const prompt = `${systemPrompt}\n\nUser message: ${message}\n\nResponse:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Manager chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}