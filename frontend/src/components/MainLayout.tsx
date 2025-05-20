"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History, Settings, Users, MapPin, Menu, X, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface MainLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/community", label: "Community", icon: Users },
  { path: "/explore", label: "Explore", icon: MapPin },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <Link
            to="/dashboard"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 hover:from-purple-300 hover:via-blue-300 hover:to-cyan-300 transition-colors"
          >
            Wellnash
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop nav items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/select-duration" &&
                  (location.pathname.startsWith("/workout") ||
                    location.pathname === "/generating-workout" ||
                    location.pathname === "/select-duration"))
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <item.icon className="w-4 h-4 mr-1.5" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-blue-600/40 rounded-md -z-0 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User avatar placeholder */}
          <div className="hidden md:block w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-gray-900/90 backdrop-blur-md border-l border-gray-800 shadow-xl p-4 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <nav>
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * navItems.indexOf(item) }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isActive
                              ? "bg-gradient-to-r from-purple-900/60 to-blue-900/60 text-white backdrop-blur-sm"
                              : "text-gray-300 hover:bg-gray-800/60 hover:backdrop-blur-sm"
                          }`}
                        >
                          <span className="flex items-center">
                            <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-purple-400" : "text-gray-400"}`} />
                            {item.label}
                          </span>
                          {isActive && <ChevronRight className="w-4 h-4 text-purple-400" />}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 fixed left-0 top-16 bottom-0 overflow-y-auto z-30">
          {/* Sidebar background with glass effect */}
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md border-r border-gray-800/50 shadow-xl"></div>

          {/* Sidebar content */}
          <div className="relative z-10 p-4">
            {/* User profile section */}
            <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <h3 className="font-medium text-white">Alex</h3>
                  <p className="text-xs text-gray-400">Premium Member</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Weekly Goal</span>
                  <span className="text-purple-400">3/5 workouts</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === "/select-duration" &&
                      (location.pathname.startsWith("/workout") ||
                        location.pathname === "/generating-workout" ||
                        location.pathname === "/select-duration"))
                  return (
                    <li key={item.path} className="relative">
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-purple-900/40 to-blue-900/30 text-white backdrop-blur-sm"
                            : "text-gray-300 hover:bg-gray-800/40 hover:text-white hover:backdrop-blur-sm"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive ? "text-purple-400" : "text-gray-400 group-hover:text-gray-300"
                          }`}
                        />
                        <span>{item.label}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Quick stats */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-800/50">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-gray-800/50">
                  <div className="text-xs text-gray-400">Workouts</div>
                  <div className="text-lg font-bold text-white">24</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-800/50">
                  <div className="text-xs text-gray-400">Calories</div>
                  <div className="text-lg font-bold text-white">12.4k</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-4 pb-20 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-1 backdrop-blur-md bg-black/70 border-t border-gray-800/50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center py-2 relative">
                <div
                  className={`relative z-10 flex flex-col items-center transition-all duration-200 ${
                    isActive ? "text-white -translate-y-1" : "text-gray-500"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-purple-400" : ""}`} />
                  <span className={`text-xs mt-1 font-medium ${isActive ? "text-purple-400" : ""}`}>{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default MainLayout
