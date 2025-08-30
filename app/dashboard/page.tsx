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

// TODO: Add authentication

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


export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, conversationsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/analytics') // Using same endpoint for conversations for now
        ])
        
        const analyticsData = await analyticsRes.json()
        const conversationsData = await conversationsRes.json()
        
        setAnalytics(analyticsData)
        setConversations(conversationsData.conversations || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set fallback data
        setAnalytics({
          total_attempts: 120,
          successful_saves: 89,
          revenue_saved: 12450,
          conversion_rate: 74.2
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-900"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
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
              <div className="text-2xl font-bold text-foreground">{analytics?.total_attempts || 120}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saves</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics?.successful_saves || 89}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${analytics?.revenue_saved?.toLocaleString() || '12,450'}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +23% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics?.conversion_rate || 74.2}%</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +5% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Retention Performance</CardTitle>
            <CardDescription className="text-muted-foreground">
              Daily attempts vs successful saves over the last 7 days
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Line
                    type="monotone"
                    dataKey="attempts"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saves"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: "#82ca9d" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Conversations</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest retention attempts and their outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversationsData.slice(0, 5).map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{conversation.reason}</p>
                      <p className="text-xs text-muted-foreground">{conversation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{conversation.offer}</p>
                      <p className="text-xs font-medium text-foreground">{conversation.revenueImpact}</p>
                    </div>
                    <Badge
                      variant={conversation.outcome === "Saved" ? "default" : "destructive"}
                      className={
                        conversation.outcome === "Saved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }
                    >
                      {conversation.outcome}
                    </Badge>
                  </div>
                </div>
              ))}
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
  )
}
