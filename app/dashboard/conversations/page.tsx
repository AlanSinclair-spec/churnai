'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, X, Clock, User, MessageSquare, Gift, CheckCircle, XCircle, Calendar, Mail, DollarSign } from 'lucide-react';

interface ConversationEvent {
  id: string;
  type: 'trigger' | 'offer' | 'response' | 'outcome';
  timestamp: string;
  title: string;
  description: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  customer_email: string;
  customer_name: string;
  subscription_value: number;
  reason: string;
  offer_type: string;
  offer_value: string;
  accepted: boolean;
  created_at: string;
  events: ConversationEvent[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    customer_email: 'john@example.com',
    customer_name: 'John Smith',
    subscription_value: 99,
    reason: 'Too expensive',
    offer_type: 'discount',
    offer_value: '25% off for 3 months',
    accepted: true,
    created_at: '2024-01-15T10:30:00Z',
    events: [
      {
        id: '1-1',
        type: 'trigger',
        timestamp: '2024-01-15T10:30:00Z',
        title: 'Cancellation Detected',
        description: 'Customer initiated cancellation process citing "Too expensive"'
      },
      {
        id: '1-2',
        type: 'offer',
        timestamp: '2024-01-15T10:30:15Z',
        title: 'Retention Offer Presented',
        description: 'Showed 25% discount offer for 3 months based on Price Sensitive playbook'
      },
      {
        id: '1-3',
        type: 'response',
        timestamp: '2024-01-15T10:32:45Z',
        title: 'Customer Considered Offer',
        description: 'Customer spent 2 minutes reviewing the offer details'
      },
      {
        id: '1-4',
        type: 'outcome',
        timestamp: '2024-01-15T10:33:12Z',
        title: 'Offer Accepted',
        description: 'Customer accepted the discount offer and continued subscription'
      }
    ]
  },
  {
    id: '2',
    customer_email: 'sarah@company.com',
    customer_name: 'Sarah Johnson',
    subscription_value: 199,
    reason: 'Not using enough',
    offer_type: 'pause',
    offer_value: '3 month pause',
    accepted: false,
    created_at: '2024-01-14T15:45:00Z',
    events: [
      {
        id: '2-1',
        type: 'trigger',
        timestamp: '2024-01-14T15:45:00Z',
        title: 'Cancellation Detected',
        description: 'Customer initiated cancellation citing "Not using enough"'
      },
      {
        id: '2-2',
        type: 'offer',
        timestamp: '2024-01-14T15:45:20Z',
        title: 'Retention Offer Presented',
        description: 'Offered 3-month subscription pause based on Underutilization playbook'
      },
      {
        id: '2-3',
        type: 'outcome',
        timestamp: '2024-01-14T15:46:05Z',
        title: 'Offer Declined',
        description: 'Customer declined the pause offer and proceeded with cancellation'
      }
    ]
  },
  {
    id: '3',
    customer_email: 'mike@startup.io',
    customer_name: 'Mike Chen',
    subscription_value: 299,
    reason: 'Found alternative',
    offer_type: 'discount',
    offer_value: '40% off for 6 months',
    accepted: true,
    created_at: '2024-01-13T09:15:00Z',
    events: [
      {
        id: '3-1',
        type: 'trigger',
        timestamp: '2024-01-13T09:15:00Z',
        title: 'Cancellation Detected',
        description: 'Customer mentioned switching to a competitor solution'
      },
      {
        id: '3-2',
        type: 'offer',
        timestamp: '2024-01-13T09:15:30Z',
        title: 'Competitive Retention Offer',
        description: 'Presented aggressive 40% discount for 6 months to counter competitor'
      },
      {
        id: '3-3',
        type: 'outcome',
        timestamp: '2024-01-13T09:18:22Z',
        title: 'Offer Accepted',
        description: 'Customer accepted the competitive discount and stayed'
      }
    ]
  }
];

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'saved' | 'lost'>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'saved' && conv.accepted) ||
                         (statusFilter === 'lost' && !conv.accepted);
    
    return matchesSearch && matchesStatus;
  });

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsDrawerOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'trigger': return User;
      case 'offer': return Gift;
      case 'response': return MessageSquare;
      case 'outcome': return CheckCircle;
      default: return Clock;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'text-orange-600 bg-orange-50';
      case 'offer': return 'text-blue-600 bg-blue-50';
      case 'response': return 'text-purple-600 bg-purple-50';
      case 'outcome': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalSaves = conversations.filter(c => c.accepted).length;
  const totalRevenue = conversations.filter(c => c.accepted).reduce((sum, c) => sum + c.subscription_value, 0);
  const saveRate = conversations.length > 0 ? (totalSaves / conversations.length * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Conversations
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Detailed timeline of all customer retention interactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-ghost text-sm flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Conversations</p>
                <p className="text-3xl font-bold text-gray-900">{conversations.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                +12% vs last month
              </span>
            </div>
          </div>

          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Save Rate</p>
                <p className="text-3xl font-bold text-gray-900">{saveRate}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                +4.2% vs last month
              </span>
            </div>
          </div>

          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revenue Saved</p>
                <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-3 rounded-2xl bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                +18% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            >
              <option value="all">All Status</option>
              <option value="saved">Saved</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Conversations Table */}
        <div className="card overflow-hidden animate-slideUp">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {conversation.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {conversation.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {conversation.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {conversation.offer_value}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conversation.accepted 
                          ? 'bg-success/10 text-success' 
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {conversation.accepted ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Saved
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Lost
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        ${conversation.subscription_value}/mo
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(conversation.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewConversation(conversation)}
                        className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Timeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Conversations will appear here as customers interact with retention offers'
                }
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Timeline Drawer */}
      {isDrawerOpen && selectedConversation && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Conversation Timeline
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedConversation.customer_name} • {selectedConversation.customer_email}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="border-b border-border p-6 bg-gray-50/50">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <p className="text-sm text-gray-900">{selectedConversation.customer_email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Subscription Value</span>
                    </div>
                    <p className="text-sm text-gray-900">${selectedConversation.subscription_value}/month</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Cancellation Reason</span>
                    </div>
                    <p className="text-sm text-gray-900">{selectedConversation.reason}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Final Status</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedConversation.accepted 
                        ? 'bg-success/10 text-success' 
                        : 'bg-danger/10 text-danger'
                    }`}>
                      {selectedConversation.accepted ? 'Customer Saved' : 'Customer Lost'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {selectedConversation.events.map((event, index) => {
                    const EventIcon = getEventIcon(event.type);
                    const isLast = index === selectedConversation.events.length - 1;
                    
                    return (
                      <div key={event.id} className="relative">
                        {!isLast && (
                          <div className="absolute left-6 top-12 w-0.5 h-6 bg-border" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getEventColor(event.type)}`}>
                            <EventIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {event.title}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(event.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {formatDate(selectedConversation.created_at)}
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
