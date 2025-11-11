"use client"

import type React from "react"
import type { Tab } from "@/lib/store"

interface NavItemConfig {
  tab: Tab
  label: string
  icon: React.ElementType
}

interface SideNavProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  navItems: NavItemConfig[]
}

const NavItem: React.FC<{
  label: string
  icon: React.ElementType
  isActive: boolean
  onClick: () => void
}> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-4 w-full p-3 rounded-full transition-colors duration-200 ${
      isActive ? "text-violet-600 bg-violet-100 font-bold" : "text-gray-700 hover:bg-gray-100"
    }`}
    aria-label={label}
  >
    <Icon isActive={isActive} />
    <span className="text-lg">{label}</span>
  </button>
)

const SideNav: React.FC<SideNavProps> = ({ activeTab, setActiveTab, navItems }) => {
  return (
    <div className="hidden md:flex flex-col w-64 p-4 border-r border-gray-200 h-screen sticky top-0 bg-white">
      <div className="text-2xl font-bold text-violet-600 mb-8 px-3">edQorta</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.tab}
            onClick={() => setActiveTab(item.tab)}
          />
        ))}
      </nav>
    </div>
  )
}

export default SideNav
