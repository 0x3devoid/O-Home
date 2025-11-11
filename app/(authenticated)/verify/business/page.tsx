"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BusinessVerifyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-2xl bg-white">
        <main className="flex-grow overflow-y-auto no-scrollbar p-4 sm:p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Business Verification</h2>
              <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                Get your business verified to unlock premium features and gain customer trust.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Registration Number</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Email</label>
                <input
                  type="email"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-2.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
