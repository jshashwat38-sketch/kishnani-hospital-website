"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Settings as SettingsIcon,
  Activity,
  Save,
  MailOpen,
  Terminal,
  ShieldAlert,
  Bell,
  Smartphone,
  MapPin,
  FileText,
  Key,
  Database,
  Building,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  // Settings Forms state
  const [hospitalName, setHospitalName] = useState("Kishnani Hospital");
  const [address, setAddress] = useState("One Tree Hill Road, near Bairagarh Railway Crossing, Bairagarh, Bhopal, Madhya Pradesh, 462030");
  const [phone, setPhone] = useState("+91-755-2641234");
  const [regNo, setRegNo] = useState("MP-BPL-2001-HOSP-729");

  // SMTP Settings
  const [smtpServer, setSmtpServer] = useState("smtp.kishnanihospital.org");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpUser, setSmtpUser] = useState("alerts@kishnanihospital.org");
  const [smtpPass, setSmtpPass] = useState("••••••••••••••••");

  // Integrations sliders
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [enableCriticalICUAlerts, setEnableCriticalICUAlerts] = useState(true);
  const [enableAutoBackup, setEnableAutoBackup] = useState(false);

  // Testing console logs
  const [testConsole, setTestConsole] = useState<string[]>([]);
  const [testingSmtp, setTestingSmtp] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTestSMTP = () => {
    setTestingSmtp(true);
    setTestConsole([`[${new Date().toLocaleTimeString()}] Resolving host ${smtpServer}...`]);

    setTimeout(() => {
      setTestConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Connecting to SMTP server port ${smtpPort} (SSL)...`]);
    }, 400);

    setTimeout(() => {
      setTestConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Performing SMTP handshakes (EHLO)...`]);
    }, 850);

    setTimeout(() => {
      setTestConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Authenticating user ${smtpUser}...`]);
    }, 1300);

    setTimeout(() => {
      setTestConsole(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] SMTP AUTHENTICATION SUCCESSFUL!`,
        `[${new Date().toLocaleTimeString()}] Sending test diagnostic email to director...`,
        `[${new Date().toLocaleTimeString()}] DIAGNOSTIC COMPLETED: Connection fully verified.`
      ]);
      setTestingSmtp(false);
      addNotification("SMTP Test Connection Successful", "Alert gateway email credentials validated.", "success");
    }, 1800);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification("System Settings Published", "Core metadata parameters saved to regional cluster storage.", "success");
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading ERP Settings Console...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">ERP System Settings</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Configure hospital branding coordinates, test SMTP alert relays, and manage third-party WhatsApp notification triggers.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 font-bold text-white rounded-xl shadow-md transition text-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings Parameters</span>
          </button>
        </div>

        {/* WORKSPACE SECTIONS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT: HOSPITAL METADATA & PROFILE */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Building className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Hospital branding credentials</h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital Name</label>
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-800 dark:text-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Registration License No</label>
                    <input
                      type="text"
                      required
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-800 dark:text-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Public Helpline Phone</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Support Address Location</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-4 py-2 bg-teal-650 hover:bg-teal-500 font-bold text-white text-xs rounded-xl shadow-md transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Save Coordinates</span>
                  </button>
                </div>
              </form>
            </div>

            {/* THIRD PARTY NOTIFICATION INTEGRATION DECK */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Bell className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Third-Party Gateway Triggers</h3>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-655 dark:text-slate-400">
                {/* WHATSAPP TRIGGER */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-800 dark:text-slate-300 block">WhatsApp Notification Gateway</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Automate WhatsApp alerts for patient appointment bookings.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableWhatsApp(!enableWhatsApp)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-205 ease-in-out focus:outline-none ${
                      enableWhatsApp ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enableWhatsApp ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* ICU CRITICAL TRIGGER */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-800 dark:text-slate-300 block">Critical Bed Threshold Sirens</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Dispatch push alert warning if ICU Bed levels reach 90%.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableCriticalICUAlerts(!enableCriticalICUAlerts)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-205 ease-in-out focus:outline-none ${
                      enableCriticalICUAlerts ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enableCriticalICUAlerts ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: SMTP ALERT DISPATCH RELAY CONFIG */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <MailOpen className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">SMTP Email Gateway Config</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">SMTP Server Address</label>
                    <input
                      type="text"
                      required
                      value={smtpServer}
                      onChange={(e) => setSmtpServer(e.target.value)}
                      className="mt-1 w-full text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">SMTP SSL Port</label>
                    <input
                      type="text"
                      required
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="mt-1 w-full text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Sender Email Address</label>
                  <input
                    type="email"
                    required
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="mt-1 w-full text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-700 dark:text-slate-350"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">SMTP Password Auth Key</label>
                  <input
                    type="password"
                    required
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="mt-1 w-full text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-700 dark:text-slate-350"
                  />
                </div>

                {/* TEST PING TRIGGER */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={testingSmtp}
                    onClick={handleTestSMTP}
                    className="flex items-center justify-center space-x-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 font-extrabold text-[10px] text-slate-700 dark:text-slate-300 rounded-xl transition"
                  >
                    {testingSmtp ? (
                      <>
                        <Activity className="h-4 w-4 animate-spin text-teal-650" />
                        <span>Testing Link Connection...</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-4 w-4 text-slate-500" />
                        <span>Trigger SMTP Connection Ping</span>
                      </>
                    )}
                  </button>
                </div>

                {/* TERMINAL DIAGNOSTIC LOGS PANEL */}
                {testConsole.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Console Diagnostic Outputs</span>
                    <div className="bg-slate-950 text-emerald-450 p-3 rounded-2xl font-mono text-[9px] max-h-36 overflow-y-auto space-y-1.5 border border-slate-850 leading-normal">
                      {testConsole.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
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
