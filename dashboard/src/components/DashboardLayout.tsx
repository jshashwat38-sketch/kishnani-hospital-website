"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Calendar,
  Building,
  LayoutTemplate,
  Image as ImageIcon,
  FileText,
  Star,
  Mail,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Stethoscope,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    user,
    logoutUser,
    notifications,
    markNotificationRead,
    clearNotifications,
    loginUser
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Auto redirect to /login if user is not logged in
  useEffect(() => {
    if (!user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, pathname, router]);

  // Sync theme class with HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  if (!user && pathname !== "/login") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-12 w-12 animate-pulse text-teal-600 dark:text-teal-400" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Doctors", path: "/doctors", icon: HeartPulse },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Departments", path: "/departments", icon: Building },
    { name: "Website CMS", path: "/cms", icon: LayoutTemplate },
    { name: "Gallery", path: "/gallery", icon: ImageIcon },
    { name: "Blog Posts", path: "/blog", icon: FileText },
    { name: "Testimonials", path: "/testimonials", icon: Star },
    { name: "Enquiries & Leads", path: "/contact", icon: Mail },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "ERP Settings", path: "/settings", icon: SettingsIcon },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      {/* BACKGROUND GRAPHIC GLOWS */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/5" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-white/70 dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors duration-300">
        {/* LOGO */}
        <div className="flex items-center space-x-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-md shadow-teal-500/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight">Kishnani ERP</h1>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold tracking-wider uppercase">Bairagarh Admin</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className="block">
                <span
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "" : "text-slate-400 group-hover:text-teal-500 dark:group-hover:text-teal-400"}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white"
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* SYSTEM USER DRAWER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user?.name}</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium block">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              router.push("/login");
            }}
            className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR WRAPPER */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <h1 className="font-bold text-slate-800 dark:text-white">Kishnani ERP</h1>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path} className="block" onClick={() => setMobileSidebarOpen(false)}>
                      <span
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-teal-600 text-white shadow-md"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    logoutUser();
                    router.push("/login");
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-xs font-medium text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 h-16 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors duration-300 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="hidden sm:block text-lg font-bold text-slate-800 dark:text-white">
              {menuItems.find((m) => m.path === pathname)?.name || "Kishnani Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* QUICK ROLE SELECTOR (FOR ERP DEMONSTRATION) */}
            <div className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide mr-1.5 font-bold">Role:</span>
              <button
                onClick={() => loginUser(user?.name || "Administrator", "Super Admin")}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  user?.role === "Super Admin" ? "bg-teal-600 text-white font-semibold" : "hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Director
              </button>
              <button
                onClick={() => loginUser("Dr. Lal Kishnani", "Doctor")}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  user?.role === "Doctor" ? "bg-blue-600 text-white font-semibold" : "hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => loginUser("Reception Staff", "Staff")}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  user?.role === "Staff" ? "bg-indigo-600 text-white font-semibold" : "hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Staff
              </button>
            </div>

            {/* LIGHT/DARK TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-200"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-200 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* NOTIFICATION BOX DROPDOWN */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h4>
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 uppercase tracking-wide"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-xs text-slate-400 dark:text-slate-500">No active alerts</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markNotificationRead(notif.id)}
                              className={`p-2.5 rounded-xl border transition-colors cursor-pointer text-xs ${
                                notif.read
                                  ? "bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/50 opacity-70"
                                  : "bg-teal-50/30 dark:bg-teal-950/10 border-teal-100/50 dark:border-teal-900/20"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className={`font-semibold ${
                                  notif.type === "error" ? "text-red-600 dark:text-red-400" :
                                  notif.type === "warning" ? "text-amber-600 dark:text-amber-400" :
                                  notif.type === "success" ? "text-emerald-600 dark:text-emerald-400" :
                                  "text-teal-600 dark:text-teal-400"
                                }`}>
                                  {notif.title}
                                </span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500">{notif.time}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-snug">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <Link href="/notifications" onClick={() => setNotificationsOpen(false)} className="block mt-3 text-center">
                        <span className="text-xs text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 font-medium">
                          View all notifications
                        </span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* AVATAR DRAWER */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 text-white font-bold flex items-center justify-center text-xs">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                      </div>
                      <Link href="/settings" onClick={() => setUserDropdownOpen(false)}>
                        <span className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                          <SettingsIcon className="h-4 w-4 text-slate-400" />
                          <span>ERP Settings</span>
                        </span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutUser();
                          router.push("/login");
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE DISPLAY CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
