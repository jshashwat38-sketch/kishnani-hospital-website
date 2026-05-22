"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Patient } from "@/context/AppContext";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  FileText,
  History,
  Activity,
  X,
  UserPlus,
  Download,
  Calendar,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientsPage() {
  const { patients, addPatient, dischargePatient, updatePatient } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Admitted" | "Discharged" | "ER Queue">("All");

  // Selection state for profile drawer
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New patient modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("Male");
  const [newPhone, setNewPhone] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("O+");
  const [newWard, setNewWard] = useState("General Ward 101");
  const [newHistory, setNewHistory] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge || !newPhone) return;

    addPatient({
      name: newName,
      age: parseInt(newAge),
      gender: newGender,
      phone: newPhone,
      bloodGroup: newBloodGroup,
      status: "Admitted",
      ward: newWard,
      admissionDate: new Date().toISOString().split("T")[0],
      history: newHistory ? newHistory.split(",").map(h => h.trim()) : [],
      reports: [],
      prescriptions: []
    });

    // Reset
    setNewName("");
    setNewAge("");
    setNewPhone("");
    setNewHistory("");
    setRegisterModalOpen(false);
  };

  const filteredPatients = patients.filter((pat) => {
    const matchesSearch =
      pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "All" ? true : pat.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Clinical Patient Directory</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Search patient logs, medical histories, and discharge sheets</p>
          </div>
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 active:scale-95 transition"
          >
            <UserPlus className="h-4.5 w-4.5" />
            <span>Empanel New Patient</span>
          </button>
        </div>

        {/* CONTROLS (SEARCH & FILTERS) */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Name or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          {/* STATUS FILTERS */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
            {(["All", "Admitted", "Discharged", "ER Queue"] as const).map((status) => (
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

        {/* PATIENTS TABLE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-4 pl-6">ID</th>
                  <th className="py-4">Patient Name</th>
                  <th className="py-4">Age / Gender</th>
                  <th className="py-4">Phone Number</th>
                  <th className="py-4">Admission Date</th>
                  <th className="py-4">Ward Location</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No matching patient logs found in the system.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((pat) => (
                    <tr
                      key={pat.id}
                      onClick={() => setSelectedPatient(pat)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 pl-6 font-bold text-teal-600 dark:text-teal-400">{pat.id}</td>
                      <td className="py-4 font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {pat.name}
                      </td>
                      <td className="py-4 text-slate-600 dark:text-slate-350">{pat.age} Yrs / {pat.gender}</td>
                      <td className="py-4 text-slate-500 dark:text-slate-400 font-medium">{pat.phone}</td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">{pat.admissionDate}</td>
                      <td className="py-4 text-slate-700 dark:text-slate-300 font-semibold">{pat.ward}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          pat.status === "Admitted"
                            ? "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
                            : pat.status === "Discharged"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                        }`}>
                          {pat.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="px-2.5 py-1 text-teal-600 hover:text-white hover:bg-teal-600 rounded-lg transition font-bold text-[10px]"
                          >
                            View Charts
                          </button>
                          {pat.status === "Admitted" && (
                            <button
                              onClick={() => dischargePatient(pat.id)}
                              className="px-2.5 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition font-bold text-[10px]"
                            >
                              Discharge
                            </button>
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

        {/* DRAWER: PATIENT MEDICAL RECORD CHARTS */}
        <AnimatePresence>
          {selectedPatient && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPatient(null)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />

              {/* DRAWER PANEL */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto"
              >
                {/* DRAWER HEADER */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase tracking-widest">{selectedPatient.id}</span>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-400">{selectedPatient.age} Yrs • {selectedPatient.gender} • Blood Group {selectedPatient.bloodGroup}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* CURRENT CLINICAL STATUS */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Admission Status</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          selectedPatient.status === "Admitted"
                            ? "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400"
                            : selectedPatient.status === "Discharged"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 animate-pulse"
                        }`}>
                          {selectedPatient.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Assigned Ward Location</span>
                        <span className="font-bold text-slate-800 dark:text-white">{selectedPatient.ward || "None"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Contact Number</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{selectedPatient.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Empanelled Date</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{selectedPatient.admissionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* CLINICAL HISTORY */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <History className="h-4.5 w-4.5 text-teal-500" />
                      <h4 className="font-extrabold text-slate-850 dark:text-white text-sm">Presenting Medical History</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.history.length === 0 ? (
                        <span className="text-xs text-slate-400">No reported medical history logs.</span>
                      ) : (
                        selectedPatient.history.map((hist, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 text-xs font-semibold"
                          >
                            {hist}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* LAB REPORTS MODULE */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="h-4.5 w-4.5 text-teal-500" />
                      <h4 className="font-extrabold text-slate-850 dark:text-white text-sm">Diagnostic Lab Profiles</h4>
                    </div>
                    <div className="space-y-2.5">
                      {selectedPatient.reports.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">No diagnostic lab reports uploaded.</p>
                      ) : (
                        selectedPatient.reports.map((rep, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-850 dark:text-white">{rep.name}</p>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Uploaded {rep.date}</span>
                            </div>
                            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400 transition">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* ACTIVE PRESCRIPTIONS */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="h-4.5 w-4.5 text-teal-500" />
                      <h4 className="font-extrabold text-slate-850 dark:text-white text-sm">Active Medical Prescriptions</h4>
                    </div>
                    <div className="space-y-2.5">
                      {selectedPatient.prescriptions.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">No active prescriptions issued.</p>
                      ) : (
                        selectedPatient.prescriptions.map((pres, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 text-xs"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-slate-800 dark:text-white">{pres.medicine}</h5>
                              <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 font-bold text-[10px]">
                                {pres.frequency}
                              </span>
                            </div>
                            <p className="text-slate-550 dark:text-slate-450">Dosage: {pres.dosage}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* DISCHARGE ACTION BUTTON */}
                  {selectedPatient.status === "Admitted" && (
                    <button
                      onClick={() => {
                        dischargePatient(selectedPatient.id);
                        setSelectedPatient(null);
                      }}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl shadow-md transition active:scale-98"
                    >
                      Authorize Clinical Discharge
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL: REGISTER NEW PATIENT */}
        <AnimatePresence>
          {registerModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRegisterModalOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Empanel Patient Ticket</h3>
                  <button
                    onClick={() => setRegisterModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Full Patient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        required
                        value={newAge}
                        onChange={(e) => setNewAge(e.target.value)}
                        placeholder="e.g. 45"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Patient Gender
                      </label>
                      <select
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Blood Group
                      </label>
                      <select
                        value={newBloodGroup}
                        onChange={(e) => setNewBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Assigned Ward Location
                      </label>
                      <input
                        type="text"
                        value={newWard}
                        onChange={(e) => setNewWard(e.target.value)}
                        placeholder="e.g. ICU Bed 4"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Presenting Symptoms & History
                    </label>
                    <textarea
                      value={newHistory}
                      onChange={(e) => setNewHistory(e.target.value)}
                      placeholder="e.g. Chronic Asthma, Fever, Chest Pain (separate with commas)"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 h-20 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-98"
                  >
                    Generate Empanelment Ticket & Admit
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
