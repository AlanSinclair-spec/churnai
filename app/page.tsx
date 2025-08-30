"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Target,
  Clock,
  CheckCircle as CheckCircleIcon,
} from "lucide-react"

export default function ChurnAILanding() {
  const handleSeeDemo = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-900 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold gradient-text">ChurnAI</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-600 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
              🚀 AI-Powered Retention Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
              Stop churn before it happens
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty">
              AI-powered subscription retention that intercepts cancellations and increases revenue by 40%. Turn
              churning customers into loyal subscribers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-white/90 font-semibold px-8 py-4 text-lg animate-pulse-glow"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See Demo
              </Button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <Clock className="h-5 w-5 text-emerald-400" />
                <span className="font-medium">Install in 10 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="font-medium">Never blocks cancel</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="font-medium">Measurable ROI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Step Process */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How ChurnAI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI identifies at-risk customers and intervenes with personalized retention strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Intercept */}
            <Card className="relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-indigo-200 dark:hover:border-indigo-800">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-900 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">1. Intercept</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  AI detects cancellation intent through behavioral patterns, support tickets, and usage analytics
                  before customers hit cancel.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2: Respond */}
            <Card className="relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-violet-200 dark:hover:border-violet-800">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">2. Respond</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Personalized retention flows activate automatically with targeted offers, feature education, and
                  proactive support.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3: Save */}
            <Card className="relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-emerald-200 dark:hover:border-emerald-800">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">3. Save</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Convert churning customers into loyal subscribers while maintaining trust and providing genuine value.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include our core AI retention features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">Perfect for small SaaS businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Up to 1,000 subscribers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Basic AI retention flows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Email & chat support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Basic analytics</span>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full mt-8 bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-violet-200 dark:border-violet-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-indigo-900 to-violet-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Growth</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">For growing SaaS companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Up to 10,000 subscribers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Advanced AI retention flows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Advanced analytics & insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Custom retention campaigns</span>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full mt-8 bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Scale Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Scale</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">For enterprise SaaS platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Unlimited subscribers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Enterprise AI features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Dedicated success manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Custom integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>White-label options</span>
                </div>
                <Button className="w-full mt-8 bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-violet-600 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
            Ready to stop losing customers?
          </h2>
          <p className="text-xl text-white/90 mb-8 text-pretty">
            Join thousands of SaaS companies using ChurnAI to increase retention and grow revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-white/90 font-semibold px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-900 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold gradient-text">ChurnAI</span>
            </Link>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2025 ChurnAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
