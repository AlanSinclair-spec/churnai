'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, Settings, Code, Webhook, CreditCard, Globe, Zap, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config?: any;
}

const integrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    icon: CreditCard,
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      publishableKey: 'pk_test_...',
      webhookUrl: 'https://api.churnai.com/webhooks/stripe',
      webhookStatus: 'active'
    }
  },
  {
    id: 'webhook',
    name: 'Webhook Endpoint',
    description: 'Receive real-time events from your application',
    icon: Webhook,
    status: 'connected',
    lastSync: '2024-01-15T10:25:00Z',
    config: {
      url: 'https://api.churnai.com/webhooks/events',
      secret: 'whsec_...',
      events: ['customer.subscription.deleted', 'invoice.payment_failed']
    }
  },
  {
    id: 'website',
    name: 'Website Widget',
    description: 'Embed cancellation flow on your website',
    icon: Globe,
    status: 'connected',
    config: {
      widgetId: 'ca_widget_123',
      domains: ['example.com', 'app.example.com']
    }
  }
];

export default function Integrations() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stripe' | 'webhook' | 'widget'>('overview');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState('');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-success bg-success/10';
      case 'error': return 'text-danger bg-danger/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  const widgetCode = `<!-- ChurnAI Widget -->
<script>
  (function(c,h,u,r,n,a,i){
    c[n]=c[n]||function(){(c[n].q=c[n].q||[]).push(arguments)};
    a=h.createElement(u);i=h.getElementsByTagName(u)[0];
    a.async=1;a.src=r;i.parentNode.insertBefore(a,i);
  })(window,document,'script','https://widget.churnai.com/v1/widget.js','churnai');
  
  churnai('init', {
    tenantId: 'your-tenant-id',
    apiKey: 'your-api-key'
  });
</script>`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Integrations
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Connect ChurnAI with your existing tools and workflows
              </p>
            </div>
            <button className="btn-primary text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync All
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Settings },
                { id: 'stripe', label: 'Stripe', icon: CreditCard },
                { id: 'webhook', label: 'Webhooks', icon: Webhook },
                { id: 'widget', label: 'Website Widget', icon: Globe }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedTab(id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    selectedTab === id
                      ? 'bg-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* Status Overview */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="stat-card animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Connected</p>
                        <p className="text-3xl font-bold text-gray-900">{integrations.filter(i => i.status === 'connected').length}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-success/10">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Integrations</p>
                        <p className="text-3xl font-bold text-gray-900">{integrations.length}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-primary/10">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Health Score</p>
                        <p className="text-3xl font-bold text-gray-900">100%</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-success/10">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration Cards */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Available Integrations</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {integrations.map((integration) => {
                      const Icon = integration.icon;
                      const StatusIcon = getStatusIcon(integration.status);
                      
                      return (
                        <div key={integration.id} className="card p-6 animate-slideUp">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-gray-100">
                                <Icon className="h-6 w-6 text-gray-700" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                                {integration.lastSync && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Last sync: {formatDate(integration.lastSync)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(integration.status)}`}>
                                <StatusIcon className="h-4 w-4 mr-1" />
                                {integration.status === 'connected' ? 'Connected' : 
                                 integration.status === 'error' ? 'Error' : 'Disconnected'}
                              </span>
                              <button
                                onClick={() => setSelectedTab(integration.id as any)}
                                className="btn-ghost text-sm"
                              >
                                Configure
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'stripe' && (
              <div className="space-y-8">
                <div className="card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-blue-100">
                      <CreditCard className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Stripe Integration</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage subscription billing and payment processing</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Publishable Key
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="pk_test_51234567890abcdef..."
                            readOnly
                            className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                          />
                          <button
                            onClick={() => handleCopy('pk_test_51234567890abcdef...', 'publishable')}
                            className="btn-ghost p-3"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook Endpoint
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value="https://api.churnai.com/webhooks/stripe"
                            readOnly
                            className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                          />
                          <button
                            onClick={() => handleCopy('https://api.churnai.com/webhooks/stripe', 'webhook')}
                            className="btn-ghost p-3"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Webhook Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          'customer.subscription.deleted',
                          'customer.subscription.updated',
                          'invoice.payment_failed',
                          'invoice.payment_succeeded'
                        ].map((event) => (
                          <div key={event} className="flex items-center justify-between p-3 border border-border rounded-xl">
                            <code className="text-sm text-gray-700">{event}</code>
                            <CheckCircle className="h-4 w-4 text-success" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-border">
                      <button className="btn-primary">Test Connection</button>
                      <button className="btn-ghost">View Stripe Dashboard</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'webhook' && (
              <div className="space-y-8">
                <div className="card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-purple-100">
                      <Webhook className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Webhook Configuration</h2>
                      <p className="text-sm text-gray-600 mt-1">Configure webhooks to receive real-time events</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value="https://api.churnai.com/webhooks/events"
                          readOnly
                          className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                        />
                        <button
                          onClick={() => handleCopy('https://api.churnai.com/webhooks/events', 'webhook-url')}
                          className="btn-ghost p-3"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook Secret
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value="whsec_1234567890abcdef1234567890abcdef12345678"
                          readOnly
                          className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="btn-ghost p-3"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy('whsec_1234567890abcdef1234567890abcdef12345678', 'webhook-secret')}
                          className="btn-ghost p-3"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Recent Webhook Deliveries</h3>
                      <div className="space-y-3">
                        {[
                          { id: '1', event: 'customer.subscription.deleted', status: 'success', timestamp: '2024-01-15T10:30:00Z' },
                          { id: '2', event: 'invoice.payment_failed', status: 'success', timestamp: '2024-01-15T10:25:00Z' },
                          { id: '3', event: 'customer.subscription.updated', status: 'failed', timestamp: '2024-01-15T10:20:00Z' }
                        ].map((delivery) => (
                          <div key={delivery.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                delivery.status === 'success' ? 'bg-success' : 'bg-danger'
                              }`} />
                              <code className="text-sm text-gray-700">{delivery.event}</code>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {formatDate(delivery.timestamp)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                delivery.status === 'success' 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-danger/10 text-danger'
                              }`}>
                                {delivery.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-border">
                      <button className="btn-primary">Test Webhook</button>
                      <button className="btn-ghost">View Logs</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'widget' && (
              <div className="space-y-8">
                <div className="card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-green-100">
                      <Globe className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Website Widget</h2>
                      <p className="text-sm text-gray-600 mt-1">Embed the cancellation flow directly on your website</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Widget ID
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value="ca_widget_123456789"
                          readOnly
                          className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                        />
                        <button
                          onClick={() => handleCopy('ca_widget_123456789', 'widget-id')}
                          className="btn-ghost p-3"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authorized Domains
                      </label>
                      <div className="space-y-2">
                        {['example.com', 'app.example.com'].map((domain) => (
                          <div key={domain} className="flex items-center justify-between p-3 border border-border rounded-xl">
                            <span className="text-sm text-gray-700">{domain}</span>
                            <CheckCircle className="h-4 w-4 text-success" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Installation Code</h3>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
                          <code>{widgetCode}</code>
                        </pre>
                        <button
                          onClick={() => handleCopy(widgetCode, 'widget-code')}
                          className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Copy className="h-4 w-4 text-gray-300" />
                        </button>
                      </div>
                      {copied === 'widget-code' && (
                        <p className="text-sm text-success mt-2">Code copied to clipboard!</p>
                      )}
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Widget Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-border rounded-xl text-center">
                          <p className="text-2xl font-bold text-gray-900">1,234</p>
                          <p className="text-sm text-gray-600">Total Impressions</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl text-center">
                          <p className="text-2xl font-bold text-gray-900">89</p>
                          <p className="text-sm text-gray-600">Interactions</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl text-center">
                          <p className="text-2xl font-bold text-gray-900">7.2%</p>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-border">
                      <button className="btn-primary">Preview Widget</button>
                      <button className="btn-ghost">Customize Appearance</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
