"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Settings,
  Zap,
  Calendar,
  ArrowUpRight,
} from "lucide-react"

// Sample data for the chart
const chartData = [
  { date: "Jan 1", attempts: 12, saves: 8 },
  { date: "Jan 2", attempts: 15, saves: 11 },
  { date: "Jan 3", attempts: 8, saves: 6 },
  { date: "Jan 4", attempts: 22, saves: 16 },
  { date: "Jan 5", attempts: 18, saves: 13 },
  { date: "Jan 6", attempts: 25, saves: 19 },
  { date: "Jan 7", attempts: 20, saves: 15 },
]

// Sample conversations data
const conversationsData = [
  {
    id: 1,
    date: "2024-01-07",
    reason: "Price too high",
    offer: "20% discount for 3 months",
    outcome: "Saved",
    revenueImpact: "$299",
  },
  {
    id: 2,
    date: "2024-01-07",
    reason: "Not using features",
    offer: "Free onboarding call",
    outcome: "Saved",
    revenueImpact: "$99",
  },
  {
    id: 3,
    date: "2024-01-06",
    reason: "Found competitor",
    offer: "Feature comparison + discount",
    outcome: "Lost",
    revenueImpact: "-$199",
  },
  {
    id: 4,
    date: "2024-01-06",
    reason: "Budget constraints",
    offer: "Downgrade to Starter",
    outcome: "Saved",
    revenueImpact: "$29",
  },
  {
    id: 5,
    date: "2024-01-05",
    reason: "Technical issues",
    offer: "Priority support + credit",
    outcome: "Saved",
    revenueImpact: "$299",
  },
]

const sidebarItems = [
  { name: "Overview", icon: BarChart3, active: true },
  { name: "Playbooks", icon: Zap, active: false },
  { name: "Conversations", icon: MessageSquare, active: false },
  { name: "Integrations", icon: Users, active: false },
  { name: "Settings", icon: Settings, active: false },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview")
  const [analytics, setAnalytics] = useState({
    attempts: 0,
    saves: 0,
    saveRate: 0,
    revenueSaved: 0
  })
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics?tenantId=00000000-0000-0000-0000-000000000000')
        const data = await response.json()
        
        if (data.success) {
          setAnalytics({
            attempts: data.data.attempts || 120,
            saves: data.data.saves || 88,
            saveRate: data.data.saveRate || 73.3,
            revenueSaved: data.data.revenueSaved || 26340
          })
          setConversations(data.data.conversations || conversationsData)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        // Use fallback data
        setAnalytics({
          attempts: 120,
          saves: 88,
          saveRate: 73.3,
          revenueSaved: 26340
        })
        setConversations(conversationsData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-900 to-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ChurnAI</span>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.name === activeTab
                    ? "bg-gradient-to-r from-indigo-900/20 to-violet-600/20 text-indigo-900 dark:text-violet-400 border border-indigo-900/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Monitor your retention performance and revenue impact</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attempts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">120</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last week
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saves</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">88</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8% from last week
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Save Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">73.3%</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +2.1% from last week
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Saved</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$26,340</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +18% from last week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Attempts vs Saves Over Time</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your retention performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  attempts: {
                    label: "Attempts",
                    color: "hsl(var(--chart-1))",
                  },
                  saves: {
                    label: "Saves",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="attempts"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="saves"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Conversations Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Conversations</CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest retention attempts and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reason</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Offer</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Outcome</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversationsData.map((conversation) => (
                      <tr key={conversation.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {conversation.date}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">{conversation.reason}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{conversation.offer}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant={conversation.outcome === "Saved" ? "default" : "destructive"}
                            className={
                              conversation.outcome === "Saved"
                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            }
                          >
                            {conversation.outcome}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          <span
                            className={conversation.revenueImpact.startsWith("-") ? "text-red-500" : "text-emerald-500"}
                          >
                            {conversation.revenueImpact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="text-muted-foreground hover:text-foreground bg-transparent">
                  View All Conversations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
