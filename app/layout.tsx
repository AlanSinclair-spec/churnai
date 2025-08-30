import type React from "react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChurnAI - Stop churn before it happens",
  description: "AI-powered subscription retention tool that prevents cancellations and increases revenue by 40%",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
