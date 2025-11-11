"use client"

import { useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"

export function useTours(userId?: number) {
  const scheduledTours = useStore((state) => state.scheduledTours)
  const confirmTour = useStore((state) => state.confirmTour)

  const userTours = useMemo(() => {
    return userId ? scheduledTours.filter((t) => t.agent.id === userId || t.renter.id === userId) : scheduledTours
  }, [scheduledTours, userId])

  const pendingTours = useMemo(() => {
    return userTours.filter((t) => t.status === "pending")
  }, [userTours])

  const confirmedTours = useMemo(() => {
    return userTours.filter((t) => t.status === "confirmed")
  }, [userTours])

  const handleConfirmTour = useCallback(
    (tourId: number, proposedTime: string) => {
      confirmTour(tourId, proposedTime)
    },
    [confirmTour],
  )

  return {
    tours: userTours,
    pendingTours,
    confirmedTours,
    confirmTour: handleConfirmTour,
  }
}
