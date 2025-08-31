'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Zap,
  Puzzle,
  LogOut
} from 'lucide-react';

const sidebarItems = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Playbooks', href: '/dashboard/playbooks', icon: Zap },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-900 to-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ChurnAI</span>
          </Link>

          <nav className="space-y-2 mb-8">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-900/20 to-violet-600/20 text-indigo-900 dark:text-violet-400 border border-indigo-900/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-border pt-4">
            <div className="text-xs text-muted-foreground mb-2">
              {user?.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
