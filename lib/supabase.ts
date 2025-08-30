import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TenantAnalytics {
  total_subscribers: number;
  churn_rate: number;
  mrr: number;
  at_risk_count: number;
  retention_rate: number;
  avg_ltv: number;
}

export interface Conversation {
  id?: string;
  tenant_id: string;
  customer_email: string;
  reason: string;
  offer_type: string;
  offer_value: string;
  accepted: boolean;
  created_at?: string;
}

export async function getTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function saveConversation(conversation: Conversation) {
  const { data, error } = await supabase
    .from('conversations')
    .insert(conversation)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTenantAnalytics(tenantId: string = '00000000-0000-0000-0000-000000000000'): Promise<TenantAnalytics> {
  try {
    const { data, error } = await supabase
      .rpc('get_tenant_analytics', { tenant_id: tenantId });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('Using demo data - Supabase not configured:', error);
    // Fallback to demo data
    return {
      total_subscribers: 2543,
      churn_rate: 3.2,
      mrr: 24543,
      at_risk_count: 142,
      retention_rate: 96.8,
      avg_ltv: 2400
    };
  }
}

export async function getConversations(tenantId: string = '00000000-0000-0000-0000-000000000000', limit = 10) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log('Using demo conversations - Supabase not configured:', error);
    // Return demo conversations
    return [
      {
        id: '1',
        tenant_id: tenantId,
        customer_email: 'sarah@techcorp.com',
        reason: 'Too expensive',
        offer_type: 'discount',
        offer_value: '50% off 3 months',
        accepted: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        tenant_id: tenantId,
        customer_email: 'mike@startup.com',
        reason: 'Not using it enough',
        offer_type: 'onboarding',
        offer_value: 'Free session + 30 days',
        accepted: false,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}

export async function getPlaybooks(tenantId: string = '00000000-0000-0000-0000-000000000000') {
  try {
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log('Using demo playbooks - Supabase not configured:', error);
    return [
      {
        id: '1',
        tenant_id: tenantId,
        name: 'Price Objection',
        trigger: 'Too expensive',
        offer_type: 'discount',
        offer_value: '50% off 3 months',
        active: true
      },
      {
        id: '2',
        tenant_id: tenantId,
        name: 'Low Usage',
        trigger: 'Not using it enough',
        offer_type: 'onboarding',
        offer_value: 'Free session + 30 days',
        active: true
      }
    ];
  }
}

export async function getRecentConversations(tenantId: string, limit = 10) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function logEvent(tenantId: string, eventType: string, eventData: any) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      tenant_id: tenantId,
      event_type: eventType,
      event_data: eventData,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}
