"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

const offers = {
  "Too expensive": {
    title: "We hear you! Here's 50% off for 3 months",
    description: "Continue with all premium features at half the price",
    savings: "Save $150 over 3 months",
  },
  "Not using it enough": {
    title: "Let us help you get more value",
    description: "Free 1-on-1 onboarding session + 30 days free",
    savings: "Unlock your full potential",
  },
  "Missing a feature": {
    title: "Your feature is coming soon!",
    description: "Get early access + 2 months free when it launches",
    savings: "Be the first to try new features",
  },
}

export default function CancelFlowModal() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedReason, setSelectedReason] = useState<string>("")

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500 text-white"
        >
          Open Cancel Flow
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Before you go...</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Help us understand why you're leaving so we can make it right
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Radio Options */}
          <div className="space-y-3">
            {Object.keys(offers).map((reason) => (
              <label
                key={reason}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedReason === reason
                    ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{reason}</span>
              </label>
            ))}
          </div>

          {/* Dynamic Offer Display */}
          {selectedReason && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 animate-in slide-in-from-top-2 duration-300">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                {offers[selectedReason as keyof typeof offers].title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {offers[selectedReason as keyof typeof offers].description}
              </p>
              <div className="inline-flex items-center px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                {offers[selectedReason as keyof typeof offers].savings}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              disabled={!selectedReason}
              className="w-full bg-gradient-to-r from-indigo-900 to-violet-600 hover:from-indigo-800 hover:to-violet-500 text-white font-medium py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept Offer
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 py-3 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Continue to Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
