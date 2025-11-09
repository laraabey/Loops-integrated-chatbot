import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log('📧 Contact Form Submission:', {
      name,
      email, 
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Our team will contact you soon.'
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' }, 
      { status: 500 }
    );
  }
}