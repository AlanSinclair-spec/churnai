'use client';

import { useState } from 'react';
import { User, Bell, CreditCard, Shield, Trash2, Save, Eye, EyeOff, AlertTriangle, CheckCircle, Settings as SettingsIcon, Users, Zap, Globe } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'owner',
    lastActive: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'admin',
    lastActive: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    role: 'member',
    lastActive: '2024-01-13T09:15:00Z'
  }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'billing' | 'team' | 'security' | 'danger'>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weeklyReport: true,
    monthlyReport: true,
    alerts: true
  });
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john@example.com',
    company: 'Acme Corp',
    timezone: 'America/New_York'
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account, team, and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === id
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
            {activeTab === 'profile' && (
              <div className="card p-6 animate-slideUp">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gray-100">
                    <User className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your personal information and preferences</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-border">
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button type="button" className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6 animate-slideUp">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Bell className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                    <p className="text-sm text-gray-600 mt-1">Choose how you want to be notified about important events</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Delivery Methods</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                        { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts for critical events' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-border rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Report Frequency</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'weeklyReport', label: 'Weekly Reports', description: 'Summary of retention performance' },
                        { key: 'monthlyReport', label: 'Monthly Reports', description: 'Detailed analytics and insights' },
                        { key: 'alerts', label: 'Real-time Alerts', description: 'Immediate notifications for critical events' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-border rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-border">
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                {/* Current Plan */}
                <div className="card p-6 animate-slideUp">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-green-100">
                      <CreditCard className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your subscription and billing information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-border rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Current Plan</h3>
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                          Growth
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-2">$99<span className="text-lg text-gray-600">/month</span></p>
                      <p className="text-sm text-gray-600 mb-4">Up to 10,000 subscribers</p>
                      <button className="btn-ghost w-full">Change Plan</button>
                    </div>

                    <div className="p-6 border border-border rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4">Usage This Month</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Subscribers</span>
                            <span>2,543 / 10,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-accent h-2 rounded-full" style={{ width: '25.4%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>API Calls</span>
                            <span>45,231 / 100,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-success h-2 rounded-full" style={{ width: '45.2%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card p-6 animate-slideUp">
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-600">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="btn-ghost">Update</button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="card p-6 animate-slideUp">
                  <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-01', amount: '$99.00', status: 'paid' },
                      { date: '2023-12-01', amount: '$99.00', status: 'paid' },
                      { date: '2023-11-01', amount: '$99.00', status: 'paid' }
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.amount}</p>
                          <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                            Paid
                          </span>
                          <button className="btn-ghost text-sm">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="card p-6 animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-100">
                      <Users className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage team members and their permissions</p>
                    </div>
                  </div>
                  <button className="btn-primary">Invite Member</button>
                </div>

                <div className="space-y-4">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-xs text-gray-500">Last active: {formatDate(member.lastActive)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                        {member.role !== 'owner' && (
                          <button className="btn-ghost text-sm">Remove</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card p-6 animate-slideUp">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-red-100">
                    <Shield className="h-6 w-6 text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage your account security and API access</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                          />
                        </div>
                      </div>
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">API Keys</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value="ca_sk_1234567890abcdef1234567890abcdef12345678"
                            readOnly
                            className="flex-1 px-4 py-3 border border-border rounded-xl bg-gray-50 text-gray-600"
                          />
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="btn-ghost p-3"
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Keep your API key secure. Don't share it in publicly accessible areas.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="btn-ghost">Regenerate Key</button>
                        <button className="btn-ghost">View Usage</button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Authenticator App</p>
                        <p className="text-sm text-gray-600">Use an authenticator app for additional security</p>
                      </div>
                      <button className="btn-primary">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="card p-6 animate-slideUp border-danger/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-danger/10">
                    <AlertTriangle className="h-6 w-6 text-danger" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
                    <p className="text-sm text-gray-600 mt-1">Irreversible and destructive actions</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 border border-danger/20 rounded-xl bg-danger/5">
                    <h3 className="font-semibold text-gray-900 mb-2">Export Account Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download all your account data including conversations, playbooks, and analytics.
                    </p>
                    <button className="btn-ghost border-danger/20 text-danger hover:bg-danger/10">
                      Export Data
                    </button>
                  </div>

                  <div className="p-6 border border-danger/20 rounded-xl bg-danger/5">
                    <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="btn-ghost border-danger text-danger hover:bg-danger hover:text-white flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
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
