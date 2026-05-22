"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Calendar,
  HeartPulse,
  Bed,
  Truck,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Plus
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
  Cell
} from "recharts";

export default function DashboardHome() {
  const {
    patients,
    appointments,
    doctors,
    leads,
    bedStats,
    ambulanceStats,
    updateAppointmentStatus,
    updatePatient,
    addNotification
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-600" />
          <p className="text-sm font-semibold text-slate-500">Loading Clinical ERP Environment...</p>
        </div>
      </div>
    );
  }

  // Count variables
  const admittedCount = patients.filter((p) => p.status === "Admitted").length;
  const emergencyCount = patients.filter((p) => p.status === "ER Queue" || p.ward.includes("ICU")).length;
  const pendingApts = appointments.filter((a) => a.status === "Pending").length;
  const activeDoctorsCount = doctors.filter((d) => d.availability === "Available" || d.availability === "In Surgery").length;

  // Recharts Chart Data
  const monthlyAdmissionsData = [
    { name: "Jan", Admissions: 145, Emergencies: 32, Revenue: 4.2 },
    { name: "Feb", Admissions: 180, Emergencies: 45, Revenue: 5.1 },
    { name: "Mar", Admissions: 210, Emergencies: 55, Revenue: 6.8 },
    { name: "Apr", Admissions: 190, Emergencies: 40, Revenue: 5.9 },
    { name: "May", Admissions: 245, Emergencies: 62, Revenue: 7.9 },
    { name: "Jun", Admissions: 290, Emergencies: 78, Revenue: 9.4 }
  ];

  const departmentData = [
    { name: "Medicine", Patients: 120 },
    { name: "Surgery", Patients: 85 },
    { name: "Gynecology", Patients: 72 },
    { name: "Cardiology", Patients: 45 },
    { name: "Pediatrics", Patients: 64 },
    { name: "Ophthalmology", Patients: 38 }
  ];

  const pieData = [
    { name: "ICU Bed Occupied", value: bedStats.icuOccupied },
    { name: "ICU Bed Available", value: bedStats.icuTotal - bedStats.icuOccupied },
    { name: "General Ward Occupied", value: bedStats.occupied },
    { name: "General Ward Available", value: bedStats.total - bedStats.occupied }
  ];

  const COLORS = ["#0d9488", "#2563eb", "#6366f1", "#cbd5e1"];

  // Quick Action Triage ER Admission
  const handleTriageApprove = (aptId: string) => {
    updateAppointmentStatus(aptId, "Approved");
  };

  const activeERQueue = patients.filter((p) => p.status === "ER Queue");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* STAT 1: Total Patients */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Admitted</span>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{admittedCount}</h3>
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12% this week</span>
              </div>
            </div>
          </motion.div>

          {/* STAT 2: Appointments Today */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Appointments</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{appointments.length}</h3>
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{pendingApts} Pending Approval</span>
              </div>
            </div>
          </motion.div>

          {/* STAT 3: Doctors On-Duty */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Doctors On-Duty</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <HeartPulse className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{activeDoctorsCount}/{doctors.length}</h3>
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Staff fully operational</span>
              </div>
            </div>
          </motion.div>

          {/* STAT 4: ICU Occupancy */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ICU Bed Occupancy</span>
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
                <Bed className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                {bedStats.icuOccupied}/{bedStats.icuTotal}
              </h3>
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>90% critical threshold</span>
              </div>
            </div>
          </motion.div>

          {/* STAT 5: Ambulance Status */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ambulance Fleet</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{ambulanceStats.total - ambulanceStats.active}/{ambulanceStats.total}</h3>
              <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 truncate">
                <span>{ambulanceStats.active} Dispatched Live</span>
              </div>
            </div>
          </motion.div>

          {/* STAT 6: Emergency Cases */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm bg-gradient-to-br from-red-500/5 to-transparent border-red-200/50 dark:border-red-950/50"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Trauma Cases</span>
              <div className="p-2 rounded-xl bg-red-500 text-white animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">{emergencyCount}</h3>
              <span className="text-[10px] text-red-500 dark:text-red-500 font-bold block mt-2">Requires immediate attention</span>
            </div>
          </motion.div>
        </div>

        {/* ANALYTICAL CHARTS GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CHART 1: Monthly admissions area chart */}
          <div className="lg:col-span-8 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Admissions & Emergencies Trends</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Monthly patient flows over the last 6 months</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" /> <span className="text-slate-500">Admissions</span></span>
                <span className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> <span className="text-slate-500">Emergencies</span></span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAdmissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEmergencies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "12px", color: "white", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="Admissions" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" />
                  <Area type="monotone" dataKey="Emergencies" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorEmergencies)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: Bed distribution donut chart */}
          <div className="lg:col-span-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Bed Allocation</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Active ICU and General ward statistics</p>
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{bedStats.icuOccupied + bedStats.occupied}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Beds Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" /> <span className="truncate">ICU Occupied ({bedStats.icuOccupied})</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> <span className="truncate">ICU Free ({bedStats.icuTotal - bedStats.icuOccupied})</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> <span className="truncate">General Wd Occupied</span></div>
              <div className="flex items-center space-x-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-350" /> <span className="truncate">General Wd Free</span></div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: PRIORITY ER QUEUE AND TODAY'S APPOINTMENTS */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* ER Triage Desk */}
          <div className="xl:col-span-7 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Emergency Triage Board</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Live ER admissions requiring doctor assignment</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/20 text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>Trauma Desk Active</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                    <th className="pb-3 pl-2">Patient ID</th>
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Age/Sex</th>
                    <th className="pb-3">Presenting History</th>
                    <th className="pb-3">Clinical Triage</th>
                    <th className="pb-3 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {activeERQueue.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 dark:text-slate-500 font-medium">
                        ER Priority Queue is currently empty. Excellent.
                      </td>
                    </tr>
                  ) : (
                    activeERQueue.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-teal-600 dark:text-teal-400">{pat.id}</td>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-white">{pat.name}</td>
                        <td className="py-3.5 text-slate-500">{pat.age} Yrs / {pat.gender}</td>
                        <td className="py-3.5 text-slate-650 dark:text-slate-300 font-medium truncate max-w-[150px]">{pat.history.join(", ")}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-[10px]">
                            CRITICAL RED
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => {
                              updatePatient(pat.id, { status: "Admitted", ward: "ICU Bed " + (bedStats.icuOccupied + 1) });
                              addNotification("ER Triage Admitted", `${pat.name} transfered to ICU Bed ${bedStats.icuOccupied + 1}`, "success");
                            }}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition text-[10px]"
                          >
                            Admit to ICU
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Appointments Action Card */}
          <div className="xl:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Booking Desk Inbox</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Approve or Reject patient requests</p>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {appointments.filter(a => a.status === "Pending").length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle className="h-8 w-8 text-teal-500 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-400">All appointments processed!</p>
                </div>
              ) : (
                appointments
                  .filter((a) => a.status === "Pending")
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-xs">{apt.patientName}</h4>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {apt.dept} • {apt.doctorName}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          apt.priority === "Emergency"
                            ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 animate-pulse"
                            : "bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        }`}>
                          {apt.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[10px]">
                        <span className="text-slate-400 font-medium">
                          {apt.date} at {apt.time}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "Rejected")}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition font-bold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleTriageApprove(apt.id)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-sm transition"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
