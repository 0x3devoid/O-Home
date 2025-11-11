"use client"

import { useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"
import type { Property } from "@/types"

export function usePropertyManagement(userId?: number) {
  const properties = useStore((state) => state.properties)
  const addProperty = useStore((state) => state.addProperty)
  const updateProperty = useStore((state) => state.updateProperty)
  const deleteProperty = useStore((state) => state.deleteProperty)
  const addComment = useStore((state) => state.addComment)
  const togglePropertyLike = useStore((state) => state.togglePropertyLike)

  const userProperties = useMemo(() => {
    return userId ? properties.filter((p) => p.lister?.id === userId) : properties
  }, [properties, userId])

  const verifiedProperties = useMemo(() => {
    return userProperties.filter((p) => p.verificationStatus === "verified")
  }, [userProperties])

  const pendingProperties = useMemo(() => {
    return userProperties.filter((p) => p.verificationStatus === "pending")
  }, [userProperties])

  const handleAddProperty = useCallback(
    (property: Omit<Property, "id">) => {
      addProperty({
        ...property,
        id: Date.now(),
      })
    },
    [addProperty],
  )

  const handleUpdateProperty = useCallback(
    (id: number, updates: Partial<Property>) => {
      updateProperty(id, updates)
    },
    [updateProperty],
  )

  const handleDeleteProperty = useCallback(
    (id: number) => {
      deleteProperty(id)
    },
    [deleteProperty],
  )

  return {
    properties: userProperties,
    verifiedProperties,
    pendingProperties,
    addProperty: handleAddProperty,
    updateProperty: handleUpdateProperty,
    deleteProperty: handleDeleteProperty,
    addComment,
    togglePropertyLike,
  }
}
