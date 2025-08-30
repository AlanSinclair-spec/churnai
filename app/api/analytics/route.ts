import { NextRequest, NextResponse } from 'next/server';
import { getTenantAnalytics, getConversations } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || '00000000-0000-0000-0000-000000000000';

    // Get analytics data
    const analytics = await getTenantAnalytics(tenantId);
    
    // Get recent conversations for additional metrics
    const conversations = await getConversations(tenantId, 50);
    
    // Calculate additional metrics from conversations
    const totalAttempts = conversations.length;
    const successfulSaves = conversations.filter(c => c.accepted).length;
    const saveRate = totalAttempts > 0 ? (successfulSaves / totalAttempts) * 100 : 0;
    
    // Calculate revenue saved (simplified calculation)
    const revenuePerCustomer = 99; // Average monthly revenue
    const revenueSaved = successfulSaves * revenuePerCustomer;

    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        attempts: totalAttempts,
        saves: successfulSaves,
        saveRate: Math.round(saveRate * 10) / 10,
        revenueSaved: revenueSaved,
        conversations: conversations.slice(0, 10) // Return latest 10
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    
    // Return demo data if there's an error
    return NextResponse.json({
      success: true,
      demo: true,
      data: {
        total_subscribers: 2543,
        churn_rate: 3.2,
        mrr: 24543,
        at_risk_count: 142,
        retention_rate: 96.8,
        avg_ltv: 2400,
        attempts: 120,
        saves: 88,
        saveRate: 73.3,
        revenueSaved: 26340,
        conversations: []
      }
    });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
