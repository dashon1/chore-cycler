
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Users, ClipboardList, Gift, Trophy } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: createPageUrl("Dashboard") },
    { name: "Members", icon: Users, path: createPageUrl("Members") },
    { name: "Chores", icon: ClipboardList, path: createPageUrl("Chores") },
    { name: "Rewards", icon: Gift, path: createPageUrl("Rewards") },
    { name: "History", icon: Trophy, path: createPageUrl("RewardHistory") }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Top Navigation */}
      <nav className="hidden sm:block bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-xl font-bold text-gray-900">Chore Scheduler</h2>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      {children}
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Add padding for mobile nav */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}
