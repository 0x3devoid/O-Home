import type React from "react"
import type { Tab } from "@/lib/store"

export interface NavItem {
  tab: Tab
  label: string
  icon: React.ElementType
}
