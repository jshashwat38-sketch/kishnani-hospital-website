"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Appointment } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle,
  XCircle,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppointmentsPage() {
  const {
    appointments,
    doctors,
    addAppointment,
    updateAppointmentStatus,
    assignDoctor
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected" | "Completed">("All");

  // New Appointment Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState(doctors[0]?.name || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [dept, setDept] = useState("General Medicine");
  const [priority, setPriority] = useState<"Routine" | "Emergency">("Routine");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !date) return;

    addAppointment({
      patientName,
      doctorName,
      date,
      time,
      dept,
      status: "Pending",
      priority
    });

    // Reset
    setPatientName("");
    setDoctorName(doctors[0]?.name || "");
    setDate("");
    setTime("10:00 AM");
    setDept("General Medicine");
    setPriority("Routine");
    setModalOpen(false);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" ? true : apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (p: Appointment["priority"]) => {
    if (p === "Emergency") {
      return "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold border border-red-200/50 dark:border-red-900/10 animate-pulse";
    }
    return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/10";
  };

  const getStatusBadge = (s: Appointment["status"]) => {
    switch (s) {
      case "Pending":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/10";
      case "Approved":
        return "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/10";
      case "Rejected":
        return "bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-200/10";
      case "Completed":
        return "bg-slate-100 dark:bg-slate-800 text-slate-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Appointment Scheduler ERP</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Manage patient consult requests, clinical scheduling slots, and trauma triage</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Schedule Consult Ticket</span>
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Patient Name or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          {/* STATUS FILTERS */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
            {(["All", "Pending", "Approved", "Rejected", "Completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === status
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* APPOINTMENTS GRID LIST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-4 pl-6">Ticket ID</th>
                  <th className="py-4">Patient Name</th>
                  <th className="py-4">Assigned Doctor</th>
                  <th className="py-4">Department</th>
                  <th className="py-4">Date / Timings</th>
                  <th className="py-4">Triage Priority</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No matching consult tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors group"
                    >
                      <td className="py-4 pl-6 font-bold text-teal-600 dark:text-teal-400">{apt.id}</td>
                      <td className="py-4 font-bold text-slate-800 dark:text-white">{apt.patientName}</td>
                      <td className="py-4 font-semibold text-slate-700 dark:text-slate-350">
                        <div className="flex items-center space-x-2">
                          <span>{apt.doctorName}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">{apt.dept}</td>
                      <td className="py-4 text-slate-650 dark:text-slate-300 font-medium">
                        <div className="flex flex-col">
                          <span>{apt.date}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{apt.time}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityBadge(apt.priority)}`}>
                          {apt.priority}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {apt.status === "Pending" && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "Rejected")}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/15 rounded-lg transition"
                                title="Reject Appointment"
                              >
                                <XCircle className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "Approved")}
                                className="p-1 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/15 rounded-lg transition"
                                title="Approve Appointment"
                              >
                                <CheckCircle className="h-4.5 w-4.5" />
                              </button>
                            </>
                          )}
                          {apt.status === "Approved" && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                              className="px-2.5 py-1 text-teal-600 hover:text-white hover:bg-teal-600 rounded-lg transition font-bold text-[10px]"
                            >
                              Mark Completed
                            </button>
                          )}
                          {apt.status === "Completed" && (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Processed</span>
                          )}
                          {apt.status === "Rejected" && (
                            <span className="text-[10px] text-red-400 font-semibold italic">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: CREATE APPOINTMENT */}
        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Schedule Consult Ticket</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Karan Johar"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Clinical Department
                      </label>
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      >
                        {["General Medicine", "Surgery", "Gynecology", "Ophthalmology", "Cardiology", "Pediatrics"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Consultant Doctor
                      </label>
                      <select
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      >
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.name}>{doc.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Preferred Time Slot
                      </label>
                      <input
                        type="text"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Triage priority flag
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 text-xs font-semibold text-slate-750 dark:text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          checked={priority === "Routine"}
                          onChange={() => setPriority("Routine")}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Standard Routine</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs font-semibold text-slate-750 dark:text-slate-350 cursor-pointer text-red-500">
                        <input
                          type="radio"
                          name="priority"
                          checked={priority === "Emergency"}
                          onChange={() => setPriority("Emergency")}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>Urgent Emergency</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-98"
                  >
                    Schedule Consult Slot & Notify
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
