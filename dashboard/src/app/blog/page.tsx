"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Activity,
  Globe,
  FileEdit,
  Eye,
  Calendar,
  User,
  Tags,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: "Wellness Tips" | "Medical News" | "Disease Alerts" | "Hospital Events";
  status: "Draft" | "Published" | "Scheduled";
  publishedDate: string;
  readTime: string;
  content: string;
  tags: string[];
}

export default function BlogPublisherPage() {
  const { doctors, addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  
  // Active editing state
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "PST-201",
      title: "Preventing Seasonal Bronchitis in Bhopal Monsoon",
      author: "Dr. Lal Kumar Kishnani",
      category: "Wellness Tips",
      status: "Published",
      publishedDate: "2026-05-18",
      readTime: "5 mins read",
      content: "Monsoon showers bring relief from heat but also trigger pediatric and senior pulmonary concerns. High relative humidity facilitates allergen suspensions. We recommend keeping living spaces well-ventilated, drinking hot fluids, and consulting our general medicine OPD at first sign of recurring wheeze.",
      tags: ["Monsoon", "Bronchitis", "Wellness", "B Bhopal"]
    },
    {
      id: "PST-202",
      title: "New Laparoscopic Surgical Theater Commissioned",
      author: "Dr. Rajesh Kishnani",
      category: "Hospital Events",
      status: "Published",
      publishedDate: "2026-05-20",
      readTime: "3 mins read",
      content: "We are pleased to announce the commissioning of our high-definition Karl Storz laparoscopy column. This surgical upgrade allows for 4K magnification during gallbladder removals and appendectomy protocols, reducing patient post-op inpatient stays to less than 24 hours.",
      tags: ["Surgery", "Hospital Tech", "Karl Storz", "Bairagarh"]
    },
    {
      id: "PST-203",
      title: "Understanding High Blood Pressure: The Silent Killer",
      author: "Dr. Sunita Patel",
      category: "Disease Alerts",
      status: "Scheduled",
      publishedDate: "2026-05-25",
      readTime: "6 mins read",
      content: "Hypertension often displays zero warning indicators. Regular blood pressure checkups at our cardiology clinic help intercept cardiovascular damages early. Focus on sodium restriction and a 30-minute brisk walk daily near lake fronts.",
      tags: ["Cardiology", "Hypertension", "Heart Health"]
    },
    {
      id: "PST-204",
      title: "Summer Heat Wave Survival Guide for Toddlers",
      author: "Dr. Amit Verma",
      category: "Wellness Tips",
      status: "Draft",
      publishedDate: "2026-05-22",
      readTime: "4 mins read",
      content: "With soaring mercury levels in Central India, keeping infants properly hydrated is paramount. Avoid outdoor sun exposures between 11 AM to 4 PM. Infuse ORS or coconut water if sweat losses look heavy.",
      tags: ["Pediatrics", "Summer Care", "Dehydration"]
    }
  ]);

  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Auto-select first post for editing
    if (posts.length > 0) {
      setActivePost({ ...posts[0] });
    }
  }, []);

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: `PST-${200 + posts.length + 1}`,
      title: "New Clinical Advisory Title",
      author: doctors[0]?.name || "Dr. Lal Kumar Kishnani",
      category: "Wellness Tips",
      status: "Draft",
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: "4 mins read",
      content: "Write your medical article details here...",
      tags: ["Health", "Kishnani"]
    };
    setPosts([newPost, ...posts]);
    setActivePost(newPost);
    addNotification("Blog Draft Started", "A fresh empty draft slot was generated.", "info");
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost) return;

    setPosts(prev => prev.map(p => p.id === activePost.id ? activePost : p));
    addNotification(
      "Article Staged Successfully",
      `Saved changes to: ${activePost.title} (${activePost.status})`,
      "success"
    );
  };

  const handleDeletePost = (id: string, title: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (activePost?.id === id) {
      setActivePost(posts.find(p => p.id !== id) || null);
    }
    addNotification("Article Removed", `Successfully deleted "${title}"`, "warning");
  };

  const handleUpdateTags = (tagStr: string) => {
    if (!activePost) return;
    const list = tagStr.split(",").map(t => t.trim()).filter(Boolean);
    setActivePost({ ...activePost, tags: list });
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Article Publisher Engine...</p>
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Medical Blog Publisher</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Publish wellness bulletins, disease notices, and regional vaccine/monsoon advisories for the public website.
            </p>
          </div>

          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 font-bold text-white rounded-xl shadow-md transition text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Article</span>
          </button>
        </div>

        {/* WORKSPACE DIVIDER */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: ARTICLE SELECTOR LIST */}
          <div className="xl:col-span-4 flex flex-col space-y-4">
            
            {/* INLINE LIST CONTROLS */}
            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Filter Status</span>
                <div className="flex space-x-1">
                  {["All", "Published", "Draft", "Scheduled"].map(st => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition ${
                        selectedStatus === st
                          ? "bg-teal-655 bg-teal-600 text-white"
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805"
                      }`}
                    >
                      {st === "Published" ? "Live" : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIST FEED */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredPosts.map((post) => {
                const isActive = activePost?.id === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => setActivePost({ ...post })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                      isActive
                        ? "bg-white dark:bg-slate-900 border-teal-500 ring-1 ring-teal-500/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                        {post.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        post.status === "Published" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" :
                        post.status === "Scheduled" ? "bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-400" :
                        "bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400"
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white text-xs mt-2 leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      By {post.author} • {post.publishedDate}
                    </p>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[9px] text-slate-400 font-medium">{post.readTime}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id, post.title);
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="text-center py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" />
                  <p className="text-[11px] text-slate-400">No matching articles found.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: SPLIT ARTICLE EDITOR & PREVIEW CARD */}
          <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {activePost ? (
              <form onSubmit={handleSavePost} className="space-y-6">
                
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <FileEdit className="h-5 w-5 text-teal-600" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Workspace: Editor Draft Suite</h3>
                      <span className="text-[9px] text-slate-400 font-bold">ID: {activePost.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* STATUS BUTTONS IN EDITOR */}
                    {["Draft", "Scheduled", "Published"].map(st => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setActivePost({ ...activePost, status: st as any })}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${
                          activePost.status === st
                            ? "bg-teal-600 text-white border-teal-650 font-black"
                            : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TWO-COLUMN EDIT/PREVIEW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* LEFT: EDIT WORKSPACE INPUTS */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Article Title</label>
                      <input
                        type="text"
                        required
                        value={activePost.title}
                        onChange={(e) => setActivePost({ ...activePost, title: e.target.value })}
                        className="mt-1.5 w-full text-xs p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-300 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Author Specialist</label>
                        <select
                          value={activePost.author}
                          onChange={(e) => setActivePost({ ...activePost, author: e.target.value })}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-350 font-bold"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Topic Category</label>
                        <select
                          value={activePost.category}
                          onChange={(e) => setActivePost({ ...activePost, category: e.target.value as any })}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-350 font-bold"
                        >
                          <option value="Wellness Tips">Wellness Tips</option>
                          <option value="Medical News">Medical News</option>
                          <option value="Disease Alerts">Disease Alerts</option>
                          <option value="Hospital Events">Hospital Events</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Read Time (Est)</label>
                      <input
                        type="text"
                        required
                        value={activePost.readTime}
                        onChange={(e) => setActivePost({ ...activePost, readTime: e.target.value })}
                        className="mt-1.5 w-full text-xs p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-350"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">SEO Meta Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Health, Heart, Vaccine"
                        value={activePost.tags.join(", ")}
                        onChange={(e) => handleUpdateTags(e.target.value)}
                        className="mt-1.5 w-full text-xs p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-350 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Article Narrative content</label>
                      <textarea
                        rows={6}
                        required
                        value={activePost.content}
                        onChange={(e) => setActivePost({ ...activePost, content: e.target.value })}
                        className="mt-1.5 w-full text-[11px] p-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
                      />
                    </div>
                  </div>

                  {/* RIGHT: LIVE CARD PREVIEW PREVIEW */}
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl self-stretch flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-3">
                        <Eye className="h-4 w-4 text-slate-400 animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Public Viewport Preview</span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-[8px] font-bold text-teal-650 dark:text-teal-400 uppercase">
                            {activePost.category}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">{activePost.readTime}</span>
                        </div>

                        <h2 className="text-sm font-extrabold text-slate-850 dark:text-white leading-tight">
                          {activePost.title}
                        </h2>

                        <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-relaxed font-medium line-clamp-4 h-16">
                          {activePost.content}
                        </p>

                        <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-500">
                          <div className="h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center font-bold text-teal-650 dark:text-teal-400">
                            {activePost.author.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-750 dark:text-slate-300 block">{activePost.author}</span>
                            <span className="block text-[8px] text-slate-400">{activePost.publishedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* TAGS PILLS SHOWCASE */}
                      <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                        <Tags className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
                        {activePost.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-900 text-[8px] text-slate-500 dark:text-slate-450 font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[9px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Globe className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Ready for push: {activePost.status === "Published" ? "Immediate Launch" : "Draft Staging"}</span>
                      </span>
                    </div>

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2.5">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 font-black text-white text-xs rounded-xl shadow-lg transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Publish & Commit Changes</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="text-center py-20">
                <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">Select or create an article to activate workspace.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
