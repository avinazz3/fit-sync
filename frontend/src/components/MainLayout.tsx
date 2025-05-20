import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, Settings, Users, MapPin } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/community", label: "Community", icon: Users },
  { path: "/explore", label: "Gym Finder", icon: MapPin },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Global header */}
      <header className="bg-gray-800 shadow-md p-4 hidden md:block sticky top-0 z-40 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center h-10">
          <Link to="/dashboard" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            Wellnash
          </Link>
          <div>
            {/* Placeholder for potential user avatar/menu on desktop header */}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pb-16 md:pb-0"> {/* Added padding-bottom for mobile to account for nav bar height */}
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-60 bg-gray-800 shadow-r sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-gray-700 pt-4">
          <nav className="px-3 py-2">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                                 (item.path === "/select-duration" && (location.pathname.startsWith("/workout") || location.pathname === "/generating-workout" || location.pathname === "/select-duration")) ||
                                 (item.path === "/" && location.pathname === "/app"); // Treat /app as Home for active state
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out 
                        ${isActive 
                          ? "bg-purple-900 text-purple-300 font-semibold shadow-sm ring-1 ring-purple-700"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-gray-300"}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-gray-900">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 shadow-top p-2 border-t border-gray-700 z-40 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path === "/select-duration" && (location.pathname.startsWith("/workout") || location.pathname === "/generating-workout" || location.pathname === "/select-duration")) ||
                           (item.path === "/" && location.pathname === "/app"); // Treat /app as Home
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/5 min-w-0 
                ${isActive 
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-purple-300"
                }`}
            >
              <item.icon className={`w-6 h-6 mb-0.5 ${isActive ? "text-purple-400" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-purple-400" : "text-gray-300"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* This div is no longer needed as padding is added to the parent of main content area */}
      {/* <div className="md:hidden h-16" /> */}
    </div>
  );
};

export default MainLayout;
