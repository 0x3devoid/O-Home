"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export default function ListingsPage() {
  const router = useRouter()
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)

  const userListings = useMemo(() => {
    return properties.filter((p) => p.lister?.id === currentUser?.id)
  }, [properties, currentUser?.id])

  const verifiedListings = useMemo(() => {
    return userListings.filter((p) => p.verificationStatus === "verified")
  }, [userListings])

  const pendingListings = useMemo(() => {
    return userListings.filter((p) => p.verificationStatus === "pending")
  }, [userListings])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Listings</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Verified Listings ({verifiedListings.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedListings.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/property/${property.id}`)}
                className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={property.images?.[0] || "/placeholder.svg"}
                  alt={property.location}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{property.location}</h3>
                  <p className="text-sm text-gray-600 mt-1">₦{property.price?.toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Verification ({pendingListings.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingListings.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/property/${property.id}`)}
                className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={property.images?.[0] || "/placeholder.svg"}
                  alt={property.location}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{property.location}</h3>
                  <p className="text-sm text-gray-600 mt-1">₦{property.price?.toLocaleString()}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
