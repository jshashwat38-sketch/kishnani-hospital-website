"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Mail,
  Search,
  Filter,
  MessageSquare,
  Activity,
  Trash2,
  CheckCircle,
  Clock,
  PhoneCall,
  Send,
  AlertOctagon,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactLeadsPage() {
  const { leads, updateLeadStatus, addPatient, addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  
  // Lead drawer details
  const [activeLead, setActiveLead] = useState<typeof leads[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [callbackNotes, setCallbackNotes] = useState("");
  const [whatsappLogs, setWhatsappLogs] = useState<string[]>([]);
  const [whatsappMessage, setWhatsappMessage] = useState("Hello! This is the booking desk at Kishnani Hospital. Regarding your request...");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Leads Communication Inbox...</p>
        </div>
      </div>
    );
  }

  const handleLeadClick = (lead: typeof leads[0]) => {
    setActiveLead(lead);
    setCallbackNotes("");
    setWhatsappLogs([]);
    setIsDrawerOpen(true);
  };

  // WhatsApp simulation API
  const handleSendSimulatedWhatsApp = () => {
    if (!activeLead) return;
    const nextLog = `[${new Date().toLocaleTimeString()}] Sent to ${activeLead.phone}: "${whatsappMessage}"`;
    setWhatsappLogs(prev => [...prev, nextLog]);
    addNotification("WhatsApp Alert Dispatched", `Notification logs recorded for ${activeLead.name}`, "success");
    updateLeadStatus(activeLead.id, "In Progress");
  };

  // Elevate to Trauma desk
  const handleElevateToTrauma = () => {
    if (!activeLead) return;

    addPatient({
      name: activeLead.name,
      age: 45,
      gender: "Male",
      phone: activeLead.phone,
      bloodGroup: "O+",
      status: "ER Queue",
      ward: "Emergency Triage",
      admissionDate: new Date().toISOString().split("T")[0],
      history: ["Inbound Trauma Alert", activeLead.message],
      reports: [],
      prescriptions: []
    });

    updateLeadStatus(activeLead.id, "Resolved");
    setIsDrawerOpen(false);
    addNotification("TRAUMA ELEVATED", `${activeLead.name} instantly added to ER priority triage desk!`, "error");
  };

  const handleResolveLead = () => {
    if (!activeLead) return;
    updateLeadStatus(activeLead.id, "Resolved");
    setIsDrawerOpen(false);
    addNotification("Lead Resolved", `Inquiry ticket ${activeLead.id} resolved successfully.`, "success");
  };

  // Filter leads
  const filteredLeads = leads.filter((ld) => {
    const matchesSearch = ld.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ld.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ld.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "All" || ld.status === selectedStatus;
    const matchesType = selectedType === "All" || ld.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const unreadLeadsCount = leads.filter(l => l.status === "Unread").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Leads & Enquiries Inbox</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Process incoming contact forms, schedule callbacks, simulate WhatsApp campaigns, or elevate trauma requests.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-955/20 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{unreadLeadsCount} Unread Forms</span>
            </span>
          </div>
        </div>

        {/* INTEGRATED FEED LAYOUT */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* SEARCH & FILTERS BOX */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads name, message, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-355"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* STATUS FILTER */}
              <div className="flex space-x-1 items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase px-2">Status</span>
                {["All", "Unread", "In Progress", "Resolved"].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      selectedStatus === st ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* TYPE FILTER */}
              <div className="flex space-x-1 items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase px-2">Type</span>
                {["All", "Contact Form", "WhatsApp Inquiry", "Callback Request", "Emergency Alert"].map(ty => (
                  <button
                    key={ty}
                    onClick={() => setSelectedType(ty)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      selectedType === ty ? "bg-teal-605 bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805"
                    }`}
                  >
                    {ty.replace(" Inquiry", "").replace(" Request", "").replace(" Alert", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LEADS LIST DIRECTORY TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                    <th className="py-3.5 pl-4">Lead ID</th>
                    <th className="py-3.5">Sender</th>
                    <th className="py-3.5">Form Channel</th>
                    <th className="py-3.5">Message / Inquiry Details</th>
                    <th className="py-3.5">Submitted</th>
                    <th className="py-3.5">Status</th>
                    <th className="py-3.5 text-right pr-4">Workspace Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  <AnimatePresence mode="popLayout">
                    {filteredLeads.map((ld) => (
                      <motion.tr
                        key={ld.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition ${
                          ld.status === "Unread" ? "bg-teal-500/[0.01] font-bold" : ""
                        }`}
                        onClick={() => handleLeadClick(ld)}
                      >
                        <td className="py-4 pl-4 font-bold text-teal-600 dark:text-teal-400">{ld.id}</td>
                        <td className="py-4">
                          <span className="font-extrabold text-slate-850 dark:text-white block">{ld.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{ld.phone}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            ld.type === "Emergency Alert" ? "bg-red-100 dark:bg-red-955/30 text-red-600 dark:text-red-400 animate-pulse" :
                            ld.type === "WhatsApp Inquiry" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450" :
                            ld.type === "Callback Request" ? "bg-blue-50 dark:bg-blue-955/20 text-blue-650 dark:text-blue-450" :
                            "bg-slate-100 dark:bg-slate-950 text-slate-500"
                          }`}>
                            {ld.type}
                          </span>
                        </td>
                        <td className="py-4 max-w-[240px] truncate text-slate-500 dark:text-slate-400">
                          {ld.message}
                        </td>
                        <td className="py-4 text-slate-400 font-normal">{ld.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            ld.status === "Unread" ? "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400" :
                            ld.status === "In Progress" ? "bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400" :
                            "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                          }`}>
                            {ld.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleLeadClick(ld)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 font-bold rounded-lg transition text-[10px]"
                          >
                            <span>Interact</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <Inbox className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <span>Leads queue is completely cleared! Excellent.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ACTIVE LEADS CONSOLE DRAWER */}
        <AnimatePresence>
          {isDrawerOpen && activeLead && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950 z-40"
              />

              {/* DRAWER PANELS */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-205 dark:border-slate-800 p-6 shadow-2xl z-50 overflow-y-auto scrollbar-thin transition-colors"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] text-teal-650 dark:text-teal-400 font-bold uppercase tracking-wider">
                      {activeLead.id} • {activeLead.type}
                    </span>
                    <h2 className="text-base font-black text-slate-800 dark:text-white mt-1">Lead Communication Deck</h2>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-md text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Mail className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {/* SENDER META */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Identity</span>
                      <h4 className="text-sm font-black text-slate-850 dark:text-white mt-1">{activeLead.name}</h4>
                      <span className="text-xs text-slate-500 font-semibold block mt-0.5">{activeLead.phone}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Received On</span>
                      <span className="text-xs text-slate-655 dark:text-slate-350 block mt-1 font-bold">{activeLead.date}</span>
                    </div>
                  </div>

                  {/* FORM TEXT INQUIRY */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">User Inquiry Message</label>
                    <div className="mt-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed border border-slate-100 dark:border-slate-850">
                      "{activeLead.message}"
                    </div>
                  </div>

                  {/* DYNAMIC ACTION GATEWAYS */}
                  
                  {/* TRIGGER EMERGENCY DESK ELEVATION */}
                  {activeLead.type === "Emergency Alert" && (
                    <div className="p-4 rounded-2xl bg-red-500/[0.02] border border-red-200/50 dark:border-red-950 space-y-3">
                      <div className="flex items-start space-x-3">
                        <AlertOctagon className="h-5 w-5 text-red-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-red-600 dark:text-red-400 leading-tight">Elevate to Trauma Triage Desk</h4>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                            Immediately admit this emergency callback user into the active ER queue of the Overview Dashboard.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleElevateToTrauma}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 font-black text-white text-xs rounded-xl shadow-md transition"
                      >
                        Elevate & Dispatch Triage
                      </button>
                    </div>
                  )}

                  {/* WHATSAPP API CHASSIS */}
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                      <span className="text-xs font-black text-slate-800 dark:text-white">Simulate WhatsApp Response API</span>
                    </div>

                    <textarea
                      rows={3}
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      className="w-full text-[11px] p-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
                    />

                    <button
                      onClick={handleSendSimulatedWhatsApp}
                      className="flex items-center justify-center space-x-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-emerald-500/10"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Simulated SMS Alert</span>
                    </button>

                    {/* WHATSAPP OUTGOING LOGS */}
                    {whatsappLogs.length > 0 && (
                      <div className="space-y-1 mt-3">
                        <span className="text-[8px] text-slate-400 font-bold uppercase block">Transmission Logs</span>
                        <div className="bg-slate-950 text-emerald-450 p-2.5 rounded-lg font-mono text-[9px] max-h-24 overflow-y-auto space-y-1 leading-normal border border-slate-800">
                          {whatsappLogs.map((log, i) => (
                            <div key={i} className="truncate">{log}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CLOSE RESOLUTION ROW */}
                  <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex space-x-3">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805 rounded-xl border border-slate-200 dark:border-slate-800 transition"
                    >
                      Close Panel
                    </button>
                    <button
                      onClick={handleResolveLead}
                      className="flex-1 py-2.5 text-xs font-black text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition shadow-md shadow-teal-500/10 flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark Inquiry Resolved</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
