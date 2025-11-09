import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Brand knowledge base
const BRAND_KNOWLEDGE = `
Loops Integrated Company Information:
- Working Hours: Monday to Friday, 9 AM to 6 PM
- Location: Colombo 03, Sri Lanka
- Services: Digital marketing, creative strategy, performance marketing, content creation
- Contact: hello@loops.lk / +94 77 123 4567
- We specialize in helping businesses grow through innovative digital solutions
`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Enhanced system prompt based on requirements
    const systemPrompt = `You are Loops Integrated's digital sales representative. You must respond in the same language as the user, either English or Sinhala. 

You are friendly, professional, and helpful. If a user asks about Loops Integrated's services, provide accurate information from the knowledge base below.

If a query is unrelated to our services, politely redirect by saying you specialize in digital marketing services and offer to connect them with the human team. DO NOT automatically collect contact info - just politely redirect in your response.

COMPANY KNOWLEDGE BASE:
${BRAND_KNOWLEDGE}

RESPONSE GUIDELINES:
- Match the user's language exactly
- Keep responses concise (2-3 sentences)
- For unrelated queries: "I specialize in Loops Integrated services. I'd be happy to connect you with our team who can assist with that!"
- Never automatically collect info - just offer to connect`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;

    return NextResponse.json({
      response: botResponse,
      detectedLanguage: 'en'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Sorry, I encountered an error. Please try again.' }, 
      { status: 500 }
    );
  }
}