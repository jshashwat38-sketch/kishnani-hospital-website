"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp, Doctor } from "@/context/AppContext";
import {
  HeartPulse,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  UserCheck,
  Stethoscope,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorsPage() {
  const { doctors, addDoctor, updateDoctor } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // New Doctor form state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [dept, setDept] = useState("General Medicine");
  const [schedule, setSchedule] = useState("09:00 AM - 02:00 PM");
  const [image, setImage] = useState("");

  // Edit Doctor form state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");
  const [editDept, setEditDept] = useState("General Medicine");
  const [editSchedule, setEditSchedule] = useState("09:00 AM - 02:00 PM");
  const [editImage, setEditImage] = useState("");
  const [editAvailability, setEditAvailability] = useState<Doctor["availability"]>("Available");

  const handleOpenEditModal = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setEditName(doc.name);
    setEditSpecialty(doc.specialty);
    setEditDept(doc.dept);
    setEditSchedule(doc.schedule);
    setEditImage(doc.image || "");
    setEditAvailability(doc.availability);
    setEditModalOpen(true);
  };

  const handleUpdateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctorId || !editName || !editSpecialty) return;

    updateDoctor(editingDoctorId, {
      name: editName,
      specialty: editSpecialty,
      dept: editDept,
      schedule: editSchedule,
      image: editImage,
      availability: editAvailability
    });

    setEditModalOpen(false);
    setEditingDoctorId(null);
  };

  // Filter departments
  const departmentsList = ["All", "General Medicine", "Surgery", "Gynecology", "Ophthalmology", "Cardiology", "Pediatrics"];

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) return;

    addDoctor({
      name,
      specialty,
      dept,
      availability: "Available",
      schedule,
      leaves: [],
      image
    });

    // Reset
    setName("");
    setSpecialty("");
    setSchedule("09:00 AM - 02:00 PM");
    setImage("");
    setAddModalOpen(false);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === "All" ? true : doc.dept === deptFilter;

    return matchesSearch && matchesDept;
  });

  const getStatusIcon = (status: Doctor["availability"]) => {
    switch (status) {
      case "Available":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "In Surgery":
        return <ActivityIcon className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "Busy":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "On Leave":
        return <XCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: Doctor["availability"]) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/10";
      case "In Surgery":
        return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/10";
      case "Busy":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/10";
      case "On Leave":
        return "bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Empanelled Medical Directory</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Manage clinical specialists, timings, and on-duty availability stats</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Appoint Specialist</span>
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name or Specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
            />
          </div>

          {/* DEPT FILTERS */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
            {departmentsList.map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  deptFilter === d
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* DOCTORS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <motion.div
              layout
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
            >
              <div>
                {/* HEADER ROW */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {doc.image ? (
                      <img 
                        src={doc.image.startsWith('http') ? doc.image : `/${doc.image}`} 
                        alt={doc.name} 
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                          const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="h-12 w-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold"
                      style={{ display: doc.image ? 'none' : 'flex' }}
                    >
                      <Stethoscope className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{doc.name}</h4>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block">{doc.dept}</span>
                    </div>
                  </div>
                  <span className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(doc.availability)}`}>
                    {getStatusIcon(doc.availability)}
                    <span>{doc.availability}</span>
                  </span>
                </div>

                {/* SPECIALTY & SCHEDULE */}
                <div className="my-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-650 dark:text-slate-350">
                  <p className="font-semibold">{doc.specialty}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>TIMINGS: {doc.schedule}</span>
                  </div>
                </div>
              </div>

              {/* ACTION: INTERACTIVE TOGGLE AVAILABILITY & EDIT */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditModal(doc)}
                  className="px-2.5 py-1 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-950/30 rounded-lg transition font-bold text-[10px]"
                >
                  Edit Profile
                </button>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Status:</span>
                  <select
                    value={doc.availability}
                    onChange={(e) => updateDoctor(doc.id, { availability: e.target.value as Doctor["availability"] })}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-white rounded-lg focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL: ADD DOCTOR */}
        <AnimatePresence>
          {addModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAddModalOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Appoint Medical Specialist</h3>
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kishnani"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Medical Specialty Description
                    </label>
                    <input
                      type="text"
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Chief Surgeon - Laparoscopic Specialist"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Doctor Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="e.g. images/dr_lal_kishnani.png or https://example.com/doc.jpg"
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
                        {departmentsList.filter(d => d !== "All").map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        OPD Schedule Timings
                      </label>
                      <input
                        type="text"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        placeholder="e.g. 09:00 AM - 02:00 PM"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-98"
                  >
                    Empanel and Issue Duty Ticket
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT DOCTOR */}
        <AnimatePresence>
          {editModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setEditModalOpen(false); setEditingDoctorId(null); }}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Edit Specialist Profile</h3>
                  <button
                    onClick={() => { setEditModalOpen(false); setEditingDoctorId(null); }}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateDoctor} className="space-y-4">
                  {/* PREVIEW CONTAINER */}
                  <div className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center relative">
                      {editImage ? (
                        <img 
                          src={editImage.startsWith('http') ? editImage : `/${editImage}`} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="h-full w-full bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold"
                        style={{ display: editImage ? 'none' : 'flex' }}
                      >
                        <Stethoscope className="h-7 w-7" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">Profile Photo Preview</h4>
                      <p className="text-[10px] text-slate-400">Preview changes dynamically as you type the image path below</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kishnani"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Medical Specialty Description
                    </label>
                    <input
                      type="text"
                      required
                      value={editSpecialty}
                      onChange={(e) => setEditSpecialty(e.target.value)}
                      placeholder="e.g. Chief Surgeon - Laparoscopic Specialist"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Doctor Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="e.g. images/dr_lal_kishnani.png or https://example.com/doc.jpg"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        Clinical Department
                      </label>
                      <select
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      >
                        {departmentsList.filter(d => d !== "All").map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                        OPD Schedule Timings
                      </label>
                      <input
                        type="text"
                        value={editSchedule}
                        onChange={(e) => setEditSchedule(e.target.value)}
                        placeholder="e.g. 09:00 AM - 02:00 PM"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Availability Status
                    </label>
                    <select
                      value={editAvailability}
                      onChange={(e) => setEditAvailability(e.target.value as Doctor["availability"])}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    >
                      <option value="Available">Available</option>
                      <option value="In Surgery">In Surgery</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-98"
                  >
                    Save Changes & Update Profile
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

// Inline mini activity icon
function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
