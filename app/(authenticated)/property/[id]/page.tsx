"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import type { Property } from "@/types"
import TourBookingModal from "@/components/booking/TourBookingModal"

export default function PropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTourModalOpen, setIsTourModalOpen] = useState(false)

  const properties = useStore((state) => state.properties)
  const currentUser = useStore((state) => state.currentUser)
  const setBookingTourFor = useStore((state) => state.setBookingTourFor)

  useEffect(() => {
    // Find property by ID
    const prop = properties.find((p) => p.id === Number.parseInt(params.id))
    setProperty(prop || null)
    setIsLoading(false)
  }, [params.id, properties])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Property Not Found</h2>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={property.images?.[0] || "/placeholder.svg"}
          alt={property.location}
          className="w-full h-96 object-cover"
        />

        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{property.location}</h1>

          <div className="flex items-center gap-4">
            <img
              src={property.lister?.avatar || "/placeholder.svg"}
              alt={property.lister?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">{property.lister?.name}</p>
              <p className="text-sm text-gray-500">@{property.lister?.username}</p>
            </div>
          </div>

          <p className="text-gray-700">{property.description}</p>

          <div className="grid grid-cols-3 gap-4">
            {property.beds && (
              <div className="text-center">
                <p className="text-2xl font-bold">{property.beds}</p>
                <p className="text-sm text-gray-600">Beds</p>
              </div>
            )}
            {property.baths && (
              <div className="text-center">
                <p className="text-2xl font-bold">{property.baths}</p>
                <p className="text-sm text-gray-600">Baths</p>
              </div>
            )}
            {property.price && (
              <div className="text-center">
                <p className="text-2xl font-bold">₦{property.price}</p>
                <p className="text-sm text-gray-600">Price</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setBookingTourFor(property)}
              className="flex-1 py-3 px-6 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors"
            >
              Schedule Tour
            </button>
          </div>
        </div>
      </div>

      {/* Tour Booking Modal is now handled by the layout */}
    </div>
  )
}
