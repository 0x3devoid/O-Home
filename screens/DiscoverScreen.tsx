"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Property, User } from "../types"
import DiscoverPost from "../components/discover/DiscoverPost"

interface DiscoverScreenProps {
  properties: Property[]
  currentUser: User
  onViewComments: (property: Property) => void
  onShare: (property: Property) => void
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ properties, currentUser, onViewComments, onShare }) => {
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null)
  const postRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Effect 1: Set the initial active property only when the list loads for the first time.
  useEffect(() => {
    if (properties.length > 0 && activePropertyId === null) {
      setActivePropertyId(properties[0].id)
    }
  }, [properties, activePropertyId])

  // Effect 2: Set up the intersection observer to track which post is visible.
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const propertyId = Number(entry.target.getAttribute("data-property-id"))
            if (propertyId) {
              setActivePropertyId(propertyId)
            }
          }
        })
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.7,
      },
    )
    observerRef.current = observer

    const currentRefs = postRefs.current
    currentRefs.forEach((postEl) => {
      if (postEl) observer.observe(postEl)
    })

    return () => {
      observer.disconnect()
    }
  }, [properties])

  // Effect 3: Update the URL when the active post changes.
  useEffect(() => {
    if (activePropertyId !== null) {
      try {
        const newUrl = `${window.location.pathname}?view=discover&post=${activePropertyId}`
        window.history.replaceState({ path: newUrl }, "", newUrl)
      } catch (error) {
        // silently fail in sandboxed environments
      }
    }
  }, [activePropertyId])

  if (properties.length === 0) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center text-white">
        No discoverable posts available.
      </div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-full w-full snap-y snap-mandatory overflow-y-auto no-scrollbar bg-black"
    >
      {properties.map((property) => (
        <div
          key={property.id}
          ref={(el) => {
            if (el) {
              postRefs.current.set(property.id, el)
            } else {
              postRefs.current.delete(property.id)
            }
          }}
          data-property-id={property.id}
          className="h-full w-full snap-start flex-shrink-0"
        >
          <DiscoverPost
            property={property}
            currentUser={currentUser}
            onViewComments={() => onViewComments(property)}
            onShare={() => onShare(property)}
            isActive={activePropertyId === property.id}
          />
        </div>
      ))}
    </div>
  )
}

export default DiscoverScreen
