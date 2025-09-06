import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Mock checkout session
    const mockCheckoutSession = {
      id: 'cs_test_mock_session_id',
      url: '/complete-order?session_id=cs_test_mock_session_id',
      payment_status: 'pending',
      amount_total: 1475, // €14.75 in cents
      currency: 'eur'
    };

    return NextResponse.json({
      success: true,
      session: mockCheckoutSession
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
