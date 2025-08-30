'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Target, Gift, Pause, TrendingDown, Users, DollarSign, X, ChevronRight, Zap, Settings } from 'lucide-react';

interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: 'discount' | 'pause' | 'downgrade' | 'custom';
  value: string;
  isActive: boolean;
  conversions: number;
  attempts: number;
  revenue_saved: number;
}

const mockPlaybooks: Playbook[] = [
  {
    id: '1',
    name: 'Price Sensitive Customers',
    description: 'Offer discount to customers citing cost as cancellation reason',
    trigger: 'Too expensive',
    action: 'discount',
    value: '25% off for 3 months',
    isActive: true,
    conversions: 45,
    attempts: 68,
    revenue_saved: 12400
  },
  {
    id: '2', 
    name: 'Underutilization Recovery',
    description: 'Pause subscription for customers not using the product',
    trigger: 'Not using enough',
    action: 'pause',
    value: '3 month pause',
    isActive: true,
    conversions: 32,
    attempts: 52,
    revenue_saved: 8900
  },
  {
    id: '3',
    name: 'Competitor Switch Prevention',
    description: 'Aggressive retention for customers switching to competitors',
    trigger: 'Found alternative',
    action: 'discount',
    value: '40% off for 6 months',
    isActive: true,
    conversions: 28,
    attempts: 41,
    revenue_saved: 15600
  },
  {
    id: '4',
    name: 'Budget Constraint Support',
    description: 'Downgrade option for budget-conscious customers',
    trigger: 'Budget cuts',
    action: 'downgrade',
    value: 'Starter plan for 6 months',
    isActive: false,
    conversions: 12,
    attempts: 25,
    revenue_saved: 3200
  }
];

export default function Playbooks() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    action: 'discount' as const,
    value: '',
    isActive: true
  });

  const totalConversions = playbooks.reduce((sum, p) => sum + p.conversions, 0);
  const totalAttempts = playbooks.reduce((sum, p) => sum + p.attempts, 0);
  const totalRevenue = playbooks.reduce((sum, p) => sum + p.revenue_saved, 0);
  const conversionRate = totalAttempts > 0 ? (totalConversions / totalAttempts * 100).toFixed(1) : '0';

  const handleCreatePlaybook = () => {
    setEditingPlaybook(null);
    setFormData({
      name: '',
      description: '',
      trigger: '',
      action: 'discount',
      value: '',
      isActive: true
    });
    setCurrentStep(1);
    setIsDrawerOpen(true);
  };

  const handleEditPlaybook = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setFormData({
      name: playbook.name,
      description: playbook.description,
      trigger: playbook.trigger,
      action: playbook.action,
      value: playbook.value,
      isActive: playbook.isActive
    });
    setCurrentStep(1);
    setIsDrawerOpen(true);
  };

  const handleSavePlaybook = () => {
    if (editingPlaybook) {
      setPlaybooks(prev => prev.map(p => 
        p.id === editingPlaybook.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newPlaybook: Playbook = {
        id: Date.now().toString(),
        ...formData,
        conversions: 0,
        attempts: 0,
        revenue_saved: 0
      };
      setPlaybooks(prev => [...prev, newPlaybook]);
    }
    setIsDrawerOpen(false);
  };

  const handleDeletePlaybook = (id: string) => {
    setPlaybooks(prev => prev.filter(p => p.id !== id));
  };

  const togglePlaybookStatus = (id: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'discount': return Gift;
      case 'pause': return Pause;
      case 'downgrade': return TrendingDown;
      default: return Settings;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'discount': return 'text-green-600 bg-green-50';
      case 'pause': return 'text-blue-600 bg-blue-50';
      case 'downgrade': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Playbooks
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Automated retention rules and offers for different cancellation scenarios
              </p>
            </div>
            <button 
              onClick={handleCreatePlaybook}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Playbook
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Playbooks</p>
                <p className="text-3xl font-bold text-gray-900">{playbooks.filter(p => p.isActive).length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-accent/10">
                <Zap className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                <Target className="h-3 w-3 mr-1" />
                {playbooks.length} total
              </span>
            </div>
          </div>

          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-success/10">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                +2.3% vs last month
              </span>
            </div>
          </div>

          <div className="stat-card animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Saves</p>
                <p className="text-3xl font-bold text-gray-900">{totalConversions}</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="trend-up">
                +18% vs last month
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
                +22% vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {playbooks.map((playbook) => {
            const ActionIcon = getActionIcon(playbook.action);
            const conversionRate = playbook.attempts > 0 ? (playbook.conversions / playbook.attempts * 100).toFixed(1) : '0';
            
            return (
              <div key={playbook.id} className="card p-6 animate-slideUp group hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${getActionColor(playbook.action)}`}>
                      <ActionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                        {playbook.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {playbook.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlaybookStatus(playbook.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        playbook.isActive 
                          ? 'bg-success/10 text-success hover:bg-success/20' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {playbook.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Trigger:</span>
                    <span className="font-medium text-gray-900">"{playbook.trigger}"</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Offer:</span>
                    <span className="font-medium text-gray-900">{playbook.value}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{conversionRate}%</p>
                    <p className="text-xs text-gray-600">Conversion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{playbook.conversions}</p>
                    <p className="text-xs text-gray-600">Saves</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">${(playbook.revenue_saved / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPlaybook(playbook)}
                    className="flex-1 btn-ghost text-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlaybook(playbook.id)}
                    className="px-4 py-2 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {playbooks.length === 0 && (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No playbooks yet</h3>
            <p className="text-gray-600 mb-6">Create your first playbook to start automating retention offers</p>
            <button 
              onClick={handleCreatePlaybook}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create First Playbook
            </button>
          </div>
        )}
      </main>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingPlaybook ? 'Edit Playbook' : 'Create New Playbook'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Step {currentStep} of 3
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress */}
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep 
                          ? 'bg-accent text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Playbook Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                            placeholder="e.g., Price Sensitive Customers"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                            placeholder="Describe when this playbook should be used..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trigger Conditions</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cancellation Reason
                          </label>
                          <select
                            value={formData.trigger}
                            onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                          >
                            <option value="">Select a reason...</option>
                            <option value="Too expensive">Too expensive</option>
                            <option value="Not using enough">Not using enough</option>
                            <option value="Found alternative">Found alternative</option>
                            <option value="Budget cuts">Budget cuts</option>
                            <option value="Too complex">Too complex</option>
                            <option value="Missing features">Missing features</option>
                            <option value="Poor support">Poor support</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Offer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Action Type
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: 'discount', label: 'Discount', icon: Gift },
                              { value: 'pause', label: 'Pause', icon: Pause },
                              { value: 'downgrade', label: 'Downgrade', icon: TrendingDown },
                              { value: 'custom', label: 'Custom', icon: Settings }
                            ].map(({ value, label, icon: Icon }) => (
                              <button
                                key={value}
                                onClick={() => setFormData(prev => ({ ...prev, action: value as any }))}
                                className={`p-4 border rounded-xl flex items-center gap-3 transition-all ${
                                  formData.action === value
                                    ? 'border-accent bg-accent/5 text-accent'
                                    : 'border-border hover:border-gray-300'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offer Details
                          </label>
                          <input
                            type="text"
                            value={formData.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                            placeholder={
                              formData.action === 'discount' ? 'e.g., 25% off for 3 months' :
                              formData.action === 'pause' ? 'e.g., 3 month pause' :
                              formData.action === 'downgrade' ? 'e.g., Starter plan for 6 months' :
                              'e.g., Custom offer details'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                    {currentStep < 3 ? (
                      <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="btn-primary"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={handleSavePlaybook}
                        className="btn-primary"
                      >
                        {editingPlaybook ? 'Update Playbook' : 'Create Playbook'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
