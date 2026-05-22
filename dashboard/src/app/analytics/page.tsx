"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Percent,
  Calendar,
  Users,
  Target,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Clinical Analytics Suite...</p>
        </div>
      </div>
    );
  }

  // Mock analytics aggregates
  const trafficData = [
    { name: "01 May", Visits: 240, Bookings: 12 },
    { name: "05 May", Visits: 320, Bookings: 18 },
    { name: "10 May", Visits: 290, Bookings: 15 },
    { name: "15 May", Visits: 410, Bookings: 28 },
    { name: "20 May", Visits: 480, Bookings: 35 },
    { name: "22 May", Visits: 540, Bookings: 42 }
  ];

  const funnelData = [
    { name: "1. Website Visits", Value: 4200, percentage: "100%" },
    { name: "2. Packages Clicked", Value: 1850, percentage: "44%" },
    { name: "3. Booking Triggered", Value: 920, percentage: "22%" },
    { name: "4. Ticket Completed", Value: 245, percentage: "5.8%" }
  ];

  const acquisitionData = [
    { name: "Google Search", value: 55 },
    { name: "Direct Visits", value: 20 },
    { name: "WhatsApp Campaign", value: 15 },
    { name: "Referrals/Ayushman", value: 10 }
  ];

  const departmentPerformance = [
    { name: "Medicine", Appointments: 85, OPDQuota: 95 },
    { name: "Surgery", Appointments: 52, OPDQuota: 65 },
    { name: "Gynecology", Appointments: 68, OPDQuota: 80 },
    { name: "Cardiology", Appointments: 32, OPDQuota: 45 },
    { name: "Pediatrics", Appointments: 48, OPDQuota: 60 }
  ];

  const COLORS = ["#0d9488", "#2563eb", "#6366f1", "#f59e0b"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Visitor & Funnel Analytics</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Analyze clinic patient acquisition channels, package funnel conversions, and seasonal OPD volumes.
            </p>
          </div>

          {/* RANGE SELECTOR */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 p-1 border border-slate-205 dark:border-slate-800 rounded-xl">
            {["7", "30", "90"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                  timeRange === range
                    ? "bg-teal-650 text-white"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
              >
                Last {range} Days
              </button>
            ))}
          </div>
        </div>

        {/* OVERALL PERFORMANCE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Conversion Rate</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">5.8%</h3>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +0.4%
              </span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Site Sessions</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">4,200</h3>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +12%
              </span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Session Duration</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">3m 42s</h3>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +8s
              </span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Package Registrations</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">245</h3>
              <span className="text-[9px] text-teal-650 font-bold">Ayushman Dominant</span>
            </div>
          </div>
        </div>

        {/* PRIMARY CHARTS GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* TRAFFIC SOURCE AREA CURVE */}
          <div className="lg:col-span-8 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Traffic Conversion Curve</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Compare incoming sessions against finalized hospital checkup bookings</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-bold">
                <span className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-teal-600" /> <span className="text-slate-500">Visits</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> <span className="text-slate-500">Bookings (x10 scale)</span></span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "12px", color: "white", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="Visits" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" dataKey="Bookings" stroke="#2563eb" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACQUISITION CHANNELS PIE */}
          <div className="lg:col-span-4 p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Acquisition Channels</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Patient source demographics</p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={acquisitionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {acquisitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-800 dark:text-white">Google</span>
                <span className="text-[8px] text-slate-450 font-bold uppercase tracking-wider">55% Dominance</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-[9px] font-bold text-slate-650 dark:text-slate-450 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-teal-650" /> <span>Google Search (55%)</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> <span>Direct Link (20%)</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-indigo-650" /> <span>WhatsApp App (15%)</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> <span>TPA Referrals (10%)</span></div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: CONVERSION FUNNEL BAR AND DEPT BAR CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CONVERSION FUNNEL */}
          <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Digital Conversion Funnel</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Track conversion leaks from raw front-end visits down to clinic checkups.</p>

            <div className="space-y-3.5">
              {funnelData.map((step, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                    <span>{step.name}</span>
                    <span>{step.Value} Users ({step.percentage})</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-lg overflow-hidden border border-slate-200/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step.percentage }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full rounded-lg ${
                        index === 0 ? "bg-teal-600" :
                        index === 1 ? "bg-teal-500/80" :
                        index === 2 ? "bg-blue-650/80" :
                        "bg-indigo-600"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEPARTMENT PERFORMANCE CAPACITY BAR CHART */}
          <div className="lg:col-span-6 p-5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Department Capacity vs OPD Appointments</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Compare allocated doctor capacities against actual patient slots.</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                  <Bar dataKey="Appointments" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="OPDQuota" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
