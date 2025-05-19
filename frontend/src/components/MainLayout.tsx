import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, Settings, Users, Compass } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/community", label: "Community", icon: Users },
  { path: "/explore", label: "Explore", icon: Compass },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Global header */}
      <header className="bg-white shadow-sm p-4 hidden md:block sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center h-10">
          <Link to="/dashboard" className="text-2xl font-bold text-purple-700 hover:text-purple-800 transition-colors">
            FitSync
          </Link>
          <div>
            {/* Placeholder for potential user avatar/menu on desktop header */}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pb-16 md:pb-0"> {/* Added padding-bottom for mobile to account for nav bar height */}
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-60 bg-white shadow-r sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-gray-200 pt-4">
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
                          ? "bg-purple-100 text-purple-700 font-semibold shadow-sm ring-1 ring-purple-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-500"}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top p-2 border-t border-gray-200 z-40 flex justify-around items-center">
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
                  ? "text-purple-700"
                  : "text-gray-500 hover:text-purple-600"
                }`}
            >
              <item.icon className={`w-6 h-6 mb-0.5 ${isActive ? "text-purple-600" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-purple-700" : "text-gray-600"}`}>{item.label}</span>
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
