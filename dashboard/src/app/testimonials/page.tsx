"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Star,
  Activity,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Heart,
  Smile,
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  review: string;
  sentiment: "Positive" | "Neutral" | "Critical";
}

export default function TestimonialsPage() {
  const { addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Dynamic reviews listings simulator state
  const [reviews, setReviews] = useState<Testimonial[]>([
    {
      id: "REV-001",
      patientName: "Kamlesh Mandloi",
      treatment: "Laparoscopic Gallbladder Surgery",
      rating: 5,
      date: "2026-05-21",
      status: "Approved",
      sentiment: "Positive",
      review: "Heartfelt gratitude to Dr. Rajesh Kishnani! The single-incision keyhole surgery was done within 40 minutes, and I was back on my feet walking around Bairagarh the very next evening. Very professional support team!"
    },
    {
      id: "REV-002",
      patientName: "Sunita Advani",
      treatment: "Cataract Surgery Setup",
      rating: 5,
      date: "2026-05-20",
      status: "Approved",
      sentiment: "Positive",
      review: "Dr. Mansi Kishnani guided me so gently through my eye checkup and lens placement. My vision is fully crystal clear now. The clinic has excellent, clean sanitization systems."
    },
    {
      id: "REV-003",
      patientName: "Gurpreet Singh",
      treatment: "Ayushman Card Admission",
      rating: 4,
      date: "2026-05-22",
      status: "Pending",
      sentiment: "Positive",
      review: "Getting my father admitted under Ayushman Bharat scheme was quick. Receptionists handled the card scanning documents smoothly. Clean wards and timely OPD rounds."
    },
    {
      id: "REV-004",
      patientName: "Vikram Rathore",
      treatment: "Emergency Triage Services",
      rating: 3,
      date: "2026-05-18",
      status: "Approved",
      sentiment: "Neutral",
      review: "Treatment quality is highly medical standard, but the ER waiting lounge got quite crowded during the evening heat wave peak. OPD queues took some extra minutes to resolve."
    },
    {
      id: "REV-005",
      patientName: "Anjali Saxena",
      treatment: "Maternity Packages",
      rating: 5,
      date: "2026-05-22",
      status: "Pending",
      sentiment: "Positive",
      review: "Dr. Anita Sharma is highly compassionate. Delivered my baby girl here, and the Deluxe nursing rooms made my stay very comforting. Thank you Kishnani Hospital team!"
    }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleStatus = (id: string, newStatus: Testimonial["status"]) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === id) {
          addNotification(
            "Review " + newStatus,
            `Review by ${r.patientName} is now ${newStatus.toLowerCase()}`,
            newStatus === "Approved" ? "success" : newStatus === "Rejected" ? "warning" : "info"
          );
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  const handleDeleteReview = (id: string, name: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    addNotification("Review Deleted", `Removed testimonial entry from ${name}`, "warning");
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-655 text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Testimonials Moderator...</p>
        </div>
      </div>
    );
  }

  // Count aggregates
  const pendingCount = reviews.filter(r => r.status === "Pending").length;
  const approvedCount = reviews.filter(r => r.status === "Approved").length;
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Testimonials Moderator</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Approve or filter patient-submitted feedback ratings to drive transparency on the public static website.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-955/20 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
              {pendingCount} Pending Moderation
            </span>
            <span className="px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/20 text-[10px] font-bold text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 flex items-center space-x-1">
              <Star className="h-3 w-3 fill-teal-600 stroke-none" />
              <span>{averageRating} Average Rating</span>
            </span>
          </div>
        </div>

        {/* STATS HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Positive Reviews</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">94% Sentiment</h3>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Approved Feedbacks</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">{approvedCount} Published</h3>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Inbound Feed Inbox</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">{reviews.length} Submissions</h3>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-355"
            />
          </div>

          <div className="flex items-center space-x-1 w-full md:w-auto overflow-x-auto scrollbar-none">
            <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  selectedStatus === st
                    ? "bg-teal-655 bg-teal-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* FEEDBACK CARDS LIST */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 justify-between items-start md:items-center relative overflow-hidden transition-all ${
                  rev.status === "Approved" ? "border-slate-200 dark:border-slate-800" :
                  rev.status === "Rejected" ? "border-red-200 dark:border-red-950 bg-red-500/[0.01]" :
                  "border-amber-250 dark:border-amber-900/50 bg-amber-500/[0.01]"
                }`}
              >
                {/* BRAND STORY METADATA */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-[9px] font-bold text-slate-500 dark:text-slate-450 uppercase">
                      {rev.id} • {rev.treatment}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                      rev.sentiment === "Positive" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" :
                      rev.sentiment === "Neutral" ? "bg-blue-50 dark:bg-blue-955/20 text-blue-650 dark:text-blue-450" :
                      "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400"
                    }`}>
                      {rev.sentiment} Sentiment
                    </span>
                    
                    {/* STARS */}
                    <div className="flex space-x-0.5 ml-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3.5 w-3.5 ${
                            idx < rev.rating 
                              ? "fill-amber-400 stroke-none" 
                              : "text-slate-200 dark:text-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-850 dark:text-white text-sm">
                    {rev.patientName} <span className="text-[10px] text-slate-400 font-normal">on {rev.date}</span>
                  </h3>

                  <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium">
                    "{rev.review}"
                  </p>
                </div>

                {/* MODERATION BUTTON GATES */}
                <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase md:mb-1.5 leading-none">
                    Status: <span className={
                      rev.status === "Approved" ? "text-emerald-650" :
                      rev.status === "Rejected" ? "text-red-500" : "text-amber-500"
                    }>{rev.status}</span>
                  </div>

                  <div className="flex space-x-1.5 ml-auto md:ml-0">
                    <button
                      onClick={() => handleToggleStatus(rev.id, "Rejected")}
                      className={`p-1.5 rounded-lg border transition ${
                        rev.status === "Rejected"
                          ? "bg-red-600 text-white border-red-600 shadow"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/10 hover:text-red-500"
                      }`}
                      title="Reject Testimonial"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(rev.id, "Approved")}
                      className={`p-1.5 rounded-lg border transition ${
                        rev.status === "Approved"
                          ? "bg-teal-600 text-white border-teal-600 shadow"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 hover:text-emerald-600"
                      }`}
                      title="Approve & Publish"
                    >
                      <CheckCircle className="h-4.5 w-4.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteReview(rev.id, rev.patientName)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition"
                      title="Trash Asset"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <span className="text-[8px] text-slate-400 font-medium hidden md:block">
                    *Approved logs publish instantly.
                  </span>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReviews.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Star className="h-10 w-10 text-slate-300 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">No review tickets match the active moderator filter.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
