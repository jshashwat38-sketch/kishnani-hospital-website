"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  Activity,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  AlertTriangle,
  Info,
  Check,
  X,
  MailOpen,
  Volume2,
  VolumeX,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsHubPage() {
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
    addNotification
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [enableSound, setEnableSound] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Clinical Alerts Vault...</p>
        </div>
      </div>
    );
  }

  // Handle Mark All Read
  const handleMarkAllRead = () => {
    notifications.forEach((notif) => {
      if (!notif.read) {
        markNotificationRead(notif.id);
      }
    });
    addNotification("All Alerts Cleared", "Marked all active dispatcher logs as read.", "success");
  };

  const handleTriggerDemoAlert = () => {
    addNotification(
      "Ambulance Dispatch Dispatch",
      "Ambulance 04 has departed with paramedics to Bairagarh Ch चौराहे near bus stand.",
      "info"
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    return selectedType === "All" || notif.type === selectedType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Notifications Log Hub</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Audit chronological logs of ER admissions, clinical thresholds, doctor leave actions, and system diagnostics.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTriggerDemoAlert}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-850 font-extrabold text-[10px] text-slate-750 dark:text-slate-300 rounded-xl transition"
            >
              Simulate Inbound Alert
            </button>
            <button
              onClick={handleMarkAllRead}
              className="flex items-center space-x-1.5 px-4 py-2 bg-teal-650 hover:bg-teal-500 font-bold text-white text-xs rounded-xl shadow-md transition"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          </div>
        </div>

        {/* CONTROLS FEED WITH TOGGLES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: SETTINGS SIDEBAR WIDGET */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 border border-slate-205 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Alert Hub Parameters</h3>
              
              {/* FILTER LEVEL */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Severity Filter</label>
                <div className="flex flex-col space-y-1.5">
                  {["All", "info", "success", "warning", "error"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                        selectedType === type
                          ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                          : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950"
                      }`}
                    >
                      <span className="capitalize">{type === "info" ? "Clinical Info" : type === "error" ? "Critical Trauma" : type}</span>
                      <span className="text-[10px] opacity-70">
                        {type === "All" ? notifications.length : notifications.filter(n => n.type === type).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SOUND NOTIFICATIONS */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                <div className="flex items-center space-x-2">
                  {enableSound ? <Volume2 className="h-4.5 w-4.5 text-teal-600" /> : <VolumeX className="h-4.5 w-4.5 text-slate-400" />}
                  <span>Sound Alarm Sirens</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableSound(!enableSound)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enableSound ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enableSound ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS BOX */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-105 dark:border-slate-800/80 rounded-2xl space-y-3.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
              <div className="flex justify-between font-bold text-slate-750 dark:text-slate-300">
                <span>ERP Diagnostics</span>
                <span className="text-emerald-600">Active</span>
              </div>
              <p>Chronological alarms are stored locally inside the browser's AppContext state container, supporting real-time reactive dispatches.</p>
              <button
                onClick={clearNotifications}
                className="w-full py-2 bg-red-600 hover:bg-red-500 font-extrabold text-white text-[10px] rounded-lg transition shadow-md shadow-red-500/10"
              >
                Clear Notifications Database
              </button>
            </div>
          </div>

          {/* RIGHT: CHRONOLOGICAL LOGS TABLE */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Dispatcher Alarms Vault</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{filteredNotifications.length} logs displayed</span>
              </div>

              {/* LIST DISPLAY */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex gap-4 items-start ${
                        notif.read 
                          ? "bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/80 opacity-60" 
                          : "bg-teal-500/[0.01] border-teal-100/50 dark:border-teal-900/30"
                      }`}
                    >
                      {/* TYPE COLOR ICON INDICATORS */}
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        notif.type === "error" ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
                        notif.type === "warning" ? "bg-amber-105 bg-amber-100 text-amber-600 dark:bg-amber-955/30 dark:text-amber-400" :
                        notif.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450" :
                        "bg-teal-100 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400"
                      }`}>
                        {notif.type === "error" ? <AlertTriangle className="h-4.5 w-4.5" /> :
                         notif.type === "warning" ? <AlertTriangle className="h-4.5 w-4.5" /> :
                         notif.type === "success" ? <CheckCircle className="h-4.5 w-4.5" /> :
                         <Info className="h-4.5 w-4.5" />}
                      </div>

                      {/* NARRATIVE */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className={`text-xs font-bold leading-tight ${
                            notif.read ? "text-slate-600 dark:text-slate-400" : "text-slate-800 dark:text-white"
                          }`}>
                            {notif.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 shrink-0 flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{notif.time}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {notif.message}
                        </p>
                      </div>

                      {/* UNREAD PILLET INDICATOR */}
                      {!notif.read && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                    <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p className="text-xs text-slate-400">Chronological logs database is completely clear.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
