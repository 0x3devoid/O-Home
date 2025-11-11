"use client"

import { useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"

export function useVerification(userId?: number) {
  const currentUser = useStore((state) => state.currentUser)
  const properties = useStore((state) => state.properties)
  const updateProperty = useStore((state) => state.updateProperty)

  const assignedVerifications = useMemo(() => {
    return properties.filter((p) => p.verifier?.id === userId && p.verificationStatus === "pending")
  }, [properties, userId])

  const completedVerifications = useMemo(() => {
    return properties.filter((p) => p.verifier?.id === userId && p.verificationStatus === "verified")
  }, [properties, userId])

  const totalEarnings = useMemo(() => {
    return completedVerifications.reduce((sum, p) => sum + (p.verificationFee || 0), 0)
  }, [completedVerifications])

  const verifyProperty = useCallback(
    (propertyId: number) => {
      updateProperty(propertyId, {
        verificationStatus: "verified" as const,
        verificationCompletedAt: new Date().toISOString(),
      })
    },
    [updateProperty],
  )

  return {
    assignedVerifications,
    completedVerifications,
    totalEarnings,
    verifyProperty,
  }
}
