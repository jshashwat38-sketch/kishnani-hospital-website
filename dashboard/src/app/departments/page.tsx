"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Building,
  Users,
  Search,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Clock,
  UserCheck,
  TrendingUp,
  Stethoscope,
  HeartPulse,
  Filter,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DepartmentData {
  id: string;
  name: string;
  head: string;
  category: "Clinical" | "Diagnostic" | "Support";
  doctorsCount: number;
  patientsCount: number;
  opdLimit: number;
  active: boolean;
  description: string;
}

export default function DepartmentsPage() {
  const { doctors, patients, addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingDept, setEditingDept] = useState<DepartmentData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic Departments database simulation
  const [depts, setDepts] = useState<DepartmentData[]>([
    { id: "DEP-01", name: "General Medicine", head: "Dr. Lal Kumar Kishnani", category: "Clinical", doctorsCount: 3, patientsCount: 145, opdLimit: 50, active: true, description: "Primary diagnostic and non-surgical therapeutic medical care for adult illnesses." },
    { id: "DEP-02", name: "General & Laparoscopic Surgery", head: "Dr. Rajesh Kishnani", category: "Clinical", doctorsCount: 2, patientsCount: 88, opdLimit: 30, active: true, description: "State-of-the-art keyhole surgeries, emergency trauma care, and abdominal procedures." },
    { id: "DEP-03", name: "Obstetrics & Gynecology", head: "Dr. Anita Sharma", category: "Clinical", doctorsCount: 2, patientsCount: 120, opdLimit: 40, active: true, description: "Comprehensive maternity packages, fetal monitoring, prenatal care, and female health." },
    { id: "DEP-04", name: "Cardiology", head: "Dr. Sunita Patel", category: "Clinical", doctorsCount: 1, patientsCount: 52, opdLimit: 25, active: true, description: "Advanced heart-care diagnostic setups, ECG trackers, hypertension clinics, and post-stroke recovery." },
    { id: "DEP-05", name: "Pediatrics", head: "Dr. Amit Verma", category: "Clinical", doctorsCount: 2, patientsCount: 79, opdLimit: 45, active: true, description: "Immunization, growth tracking, neonatal care, and seasonal pediatric infections triage." },
    { id: "DEP-06", name: "Ophthalmology", head: "Dr. Mansi Kishnani", category: "Clinical", doctorsCount: 1, patientsCount: 42, opdLimit: 30, active: true, description: "Computerized eye checkups, cataract clinics, glaucoma screenings, and corrective surgeries." },
    { id: "DEP-07", name: "Orthopedics & Spine", head: "Dr. Devendra Kushwaha", category: "Clinical", doctorsCount: 2, patientsCount: 95, opdLimit: 35, active: true, description: "Hip & joint replacements, fracture management, spinal decompression, and physiotherapy." },
    { id: "DEP-08", name: "ICU & Critical Care", head: "Dr. Rajesh Kishnani", category: "Clinical", doctorsCount: 3, patientsCount: 18, opdLimit: 10, active: true, description: "24x7 intensive care unit with advanced ventilator support and patient vital monitoring." },
    { id: "DEP-09", name: "Digital Diagnostics", head: "Dr. Sandeep Malviya", category: "Diagnostic", doctorsCount: 1, patientsCount: 210, opdLimit: 100, active: true, description: "High-resolution digital X-Rays, ultrasounds, and computerized imaging diagnostics." },
    { id: "DEP-10", name: "Pathology Laboratory", head: "Dr. Sandeep Malviya", category: "Diagnostic", doctorsCount: 1, patientsCount: 310, opdLimit: 150, active: true, description: "Biochemistry profiles, clinical hematology, urine analysis, and hormonal assays." },
    { id: "DEP-11", name: "ENT Care", head: "Dr. Lal Kumar Kishnani", category: "Clinical", doctorsCount: 1, patientsCount: 30, opdLimit: 20, active: false, description: "Diagnosis and therapy for ear, nose, and throat dysfunctions, including audiological screens." },
    { id: "DEP-12", name: "Emergency Services", head: "Dr. Vikas Choudhary", category: "Support", doctorsCount: 3, patientsCount: 65, opdLimit: 50, active: true, description: "24x7 ambulance fleet dispatch, trauma triage, and rapid stabilization facility." }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Departments Database...</p>
        </div>
      </div>
    );
  }

  // Filter departments based on search and category
  const filteredDepts = depts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clinicalCount = depts.filter(d => d.category === "Clinical" && d.active).length;
  const diagnosticCount = depts.filter(d => d.category === "Diagnostic" && d.active).length;
  const inactiveCount = depts.filter(d => !d.active).length;

  const handleEditClick = (dept: DepartmentData) => {
    setEditingDept({ ...dept });
    setIsDrawerOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    setDepts(prev => prev.map(d => d.id === editingDept.id ? editingDept : d));
    setIsDrawerOpen(false);
    addNotification(
      "Department Configured",
      `Successfully updated ${editingDept.name} limits & HOD details.`,
      "success"
    );
    setEditingDept(null);
  };

  const toggleDeptStatus = (id: string) => {
    const updated = depts.map(d => {
      if (d.id === id) {
        const nextState = !d.active;
        addNotification(
          "Department Status Changed",
          `${d.name} is now ${nextState ? "Active/Operational" : "Deactivated/On Leave"}`,
          nextState ? "success" : "warning"
        );
        return { ...d, active: nextState };
      }
      return d;
    });
    setDepts(updated);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Department ERP Panel</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Manage clinical disciplines, empanelled heads (HODs), operational quotas, and daily limits.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-[10px] font-bold text-teal-650 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30">
              {clinicalCount} Clinical Active
            </span>
            <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[10px] font-bold text-blue-650 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20">
              {diagnosticCount} Diagnostic Active
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by dept name, HOD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
            />
          </div>

          {/* FILTERS */}
          <div className="flex items-center space-x-1 w-full md:w-auto overflow-x-auto scrollbar-none">
            <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
            {["All", "Clinical", "Diagnostic", "Support"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* DEPARTMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDepts.map((dept) => (
              <motion.div
                key={dept.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl relative overflow-hidden transition-all shadow-sm ${
                  dept.active 
                    ? "border-slate-205 dark:border-slate-800 hover:border-teal-500/50" 
                    : "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50"
                }`}
              >
                {/* GLOW OVERLAYS */}
                {dept.active && (
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-teal-500/5 blur-2xl pointer-events-none" />
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                      {dept.id} • {dept.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-850 dark:text-white mt-1">
                      {dept.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleDeptStatus(dept.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      dept.active
                        ? "border-emerald-100 dark:border-emerald-950/20 bg-emerald-50 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/70"
                        : "border-red-100 dark:border-red-950/20 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 hover:bg-red-100/70"
                    }`}
                    title={dept.active ? "Click to Deactivate" : "Click to Activate"}
                  >
                    {dept.active ? <CheckCircle className="h-4.5 w-4.5" /> : <XCircle className="h-4.5 w-4.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-2 h-8">
                  {dept.description}
                </p>

                {/* HOD DETAILS */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center space-x-2.5">
                  <div className="h-7 w-7 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                    {dept.head.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase leading-none">Head of Department</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block mt-0.5">{dept.head}</span>
                  </div>
                </div>

                {/* OPERATIONAL METRICS */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Doctors</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block mt-0.5">{dept.doctorsCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Patients</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block mt-0.5">{dept.patientsCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">OPD Limit</span>
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400 block mt-0.5">{dept.opdLimit}</span>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="mt-4 pt-3 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-[10px] font-bold ${
                    dept.active ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {dept.active ? "● Operational" : "○ Closed"}
                  </span>
                  
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold text-teal-650 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/20 rounded-md transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Quota</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* DRAWERS PANEL */}
        <AnimatePresence>
          {isDrawerOpen && editingDept && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950 z-40"
              />

              {/* SLIDE OUT DRAWER */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-50 overflow-y-auto scrollbar-thin transition-colors"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 dark:text-white">Configure Department</h2>
                    <span className="text-xs text-slate-400 font-medium">Department ID: {editingDept.id}</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Building className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveDept} className="mt-6 space-y-4">
                  {/* DEPT NAME */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Department Name</label>
                    <input
                      type="text"
                      required
                      value={editingDept.name}
                      onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                      className="mt-1.5 w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-305 font-bold"
                    />
                  </div>

                  {/* DEPT HEAD (HOD) */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Head of Department (HOD)</label>
                    <select
                      value={editingDept.head}
                      onChange={(e) => setEditingDept({ ...editingDept, head: e.target.value })}
                      className="mt-1.5 w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-850 dark:text-slate-300 font-bold"
                    >
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialty.split(" ")[0]})</option>
                      ))}
                      <option value="Dr. Sandeep Malviya">Dr. Sandeep Malviya (Diagnostics)</option>
                      <option value="Dr. Vikas Choudhary">Dr. Vikas Choudhary (Emergency)</option>
                    </select>
                  </div>

                  {/* CATEGORY & OPD LIMIT */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                      <select
                        value={editingDept.category}
                        onChange={(e) => setEditingDept({ ...editingDept, category: e.target.value as any })}
                        className="mt-1.5 w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-850 dark:text-slate-300 font-bold"
                      >
                        <option value="Clinical">Clinical</option>
                        <option value="Diagnostic">Diagnostic</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Daily OPD Limit</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        required
                        value={editingDept.opdLimit}
                        onChange={(e) => setEditingDept({ ...editingDept, opdLimit: parseInt(e.target.value) || 0 })}
                        className="mt-1.5 w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-305 font-bold"
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingDept.description}
                      onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                      className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
                    />
                  </div>

                  {/* ACTIVE STATUS TOGGLE */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Department Operational Status</span>
                      <span className="text-[10px] text-slate-400 leading-none block mt-0.5">Toggle clinical OPD hours active or closed.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDept({ ...editingDept, active: !editingDept.active })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        editingDept.active ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          editingDept.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* BUTTONS */}
                  <div className="pt-4 flex space-x-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition shadow-md shadow-teal-500/10"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
