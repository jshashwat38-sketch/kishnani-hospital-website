"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  Image as ImageIcon,
  UploadCloud,
  Activity,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  Zap,
  Tag,
  Download,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  category: "Infrastructure" | "Clinicians" | "Diagnostics" | "Emergency";
  url: string; // fallback or absolute local
  fileSize: string;
  dimensions: string;
  uploadedDate: string;
}

export default function GalleryPage() {
  const { addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Upload Simulator State
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCategory, setUploadCategory] = useState<"Infrastructure" | "Clinicians" | "Diagnostics" | "Emergency">("Infrastructure");

  // Local state of mock gallery items (includes the 6 high-end PNG assets)
  const [gallery, setGallery] = useState<GalleryItem[]>([
    { id: "IMG-01", title: "Hospital Main Facade Exterior", category: "Infrastructure", url: "hero_banner_1779365092547.png", fileSize: "1.2 MB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" },
    { id: "IMG-02", title: "Chief Indian Specialists Team", category: "Clinicians", url: "doctors_team_1779365114807.png", fileSize: "940 KB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" },
    { id: "IMG-03", title: "ICU Intensive Cardiac Care Ward", category: "Infrastructure", url: "modern_icu_1779365134702.png", fileSize: "1.1 MB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" },
    { id: "IMG-04", title: "Modular Surgical Operation Theatre", category: "Infrastructure", url: "operation_theatre_1779365157655.png", fileSize: "820 KB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" },
    { id: "IMG-05", title: "Pathology Biochemistry Lab Setup", category: "Diagnostics", url: "diagnostic_lab_1779365179175.png", fileSize: "760 KB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" },
    { id: "IMG-06", title: "Premium Patient Reception Lounge", category: "Infrastructure", url: "hospital_reception_1779365197134.png", fileSize: "1.3 MB", dimensions: "1920 x 1080", uploadedDate: "2026-05-21" }
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Upload simulation handler
  const handleSimulatedUpload = (fileName: string) => {
    setUploadingFile(fileName);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newItem: GalleryItem = {
              id: `IMG-${100 + gallery.length + 1}`,
              title: fileName.replace(/\.[^/.]+$/, ""), // remove extension
              category: uploadCategory,
              url: "hospital_reception_1779365197134.png", // fallback placeholder thumbnail
              fileSize: "680 KB",
              dimensions: "1280 x 720",
              uploadedDate: new Date().toISOString().split("T")[0]
            };
            setGallery((prevGallery) => [newItem, ...prevGallery]);
            setUploadingFile(null);
            addNotification(
              "Media Asset Uploaded",
              `Successfully published "${newItem.title}" to public media gallery.`,
              "success"
            );
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleSimulatedUpload(file.name);
    }
  };

  const handleDeleteAsset = (id: string, title: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
    addNotification("Media Deleted", `Removed "${title}" from server records.`, "warning");
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading Gallery Server Assets...</p>
        </div>
      </div>
    );
  }

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Media Gallery Manager</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Manage clinical portraits, facility photography, and promotional banners with automated WebP optimizer stats.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400">
              Auto-WebP Compression Enabled (Saved ~48% bandwidth)
            </span>
          </div>
        </div>

        {/* CONTROLS & SEARCH */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: MEDIA UPLOADER SIMULATOR */}
          <div className="lg:w-1/3 flex flex-col space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-3">Upload Server Assets</h3>
              
              {/* SELECT CATEGORY */}
              <div className="mb-4">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Publish Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="mt-1.5 w-full text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-800 dark:text-slate-350 font-bold"
                >
                  <option value="Infrastructure">Infrastructure Wards</option>
                  <option value="Clinicians">Clinicians/Doctors</option>
                  <option value="Diagnostics">Diagnostics/Lab</option>
                  <option value="Emergency">Emergency/Ambulance</option>
                </select>
              </div>

              {/* UPLOAD BOX */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => handleSimulatedUpload("OT_Modular_Microscope_Lens.jpg")}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
                  dragActive 
                    ? "border-teal-500 bg-teal-50/20 dark:bg-teal-950/10" 
                    : "border-slate-200 dark:border-slate-800 hover:border-teal-500/50 bg-slate-50/50 dark:bg-slate-950/20"
                }`}
              >
                {uploadingFile ? (
                  <div className="w-full space-y-3">
                    <Activity className="h-8 w-8 animate-pulse text-teal-600 mx-auto" />
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[180px] mx-auto">
                      Uploading {uploadingFile}
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-teal-650 h-full rounded-full"
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <span className="text-[9px] text-teal-650 font-bold block">{uploadProgress}% Complete</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-9 w-9 text-slate-400 group-hover:text-teal-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-3">
                      Drag & Drop image here
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">
                      or click to upload demo file
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[8px] text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider mt-3">
                      JPG, PNG, WebP up to 5MB
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* STORAGE STATISTICS */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-xs space-y-3.5">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Disk Cloud Storage</span>
                <span>6.2 MB / 100 MB</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-650 h-full rounded-full w-[6.2%]" />
              </div>
              <div className="flex items-start space-x-2 text-[10px] text-slate-500 leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Next.js image components automatically compress and deliver WebP variants on the static frontend dynamically.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PHOTO ALBUMS GRID */}
          <div className="lg:w-2/3 flex flex-col space-y-4">
            
            {/* GRID CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-650 text-slate-700 dark:text-slate-350"
                />
              </div>

              <div className="flex items-center space-x-1 w-full md:w-auto overflow-x-auto scrollbar-none">
                <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
                {["All", "Infrastructure", "Clinicians", "Diagnostics", "Emergency"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 ${
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

            {/* IMAGES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition relative flex flex-col"
                  >
                    {/* IMAGE PREVIEW CARD */}
                    <div className="h-40 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-800" />
                      
                      {/* SIMULATED PICTURE THUMBNAIL BACKBOUND */}
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900/60 flex items-center justify-center font-bold text-[10px] text-slate-500 uppercase tracking-widest p-4 text-center">
                        {item.title}
                      </div>

                      {/* CATEGORY TAG */}
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 border border-white/10">
                        <Tag className="h-2.5 w-2.5" />
                        <span>{item.category}</span>
                      </span>

                      {/* HOVER OVERLAY CONTROL */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                        <button
                          onClick={() => addNotification("Viewing File", `Previewing absolute resolution: ${item.dimensions}`, "info")}
                          className="p-2 rounded-lg bg-white text-slate-850 hover:bg-slate-100 transition shadow"
                          title="View resolution"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(item.id, item.title)}
                          className="p-2 rounded-lg bg-red-655 text-white bg-red-600 hover:bg-red-500 transition shadow"
                          title="Delete File"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* METADATA PANEL */}
                    <div className="p-3.5 text-xs flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white truncate" title={item.title}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          ID: {item.id} • Dimension: {item.dimensions}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                        <span className="text-slate-400 font-bold uppercase">{item.fileSize}</span>
                        <span className="text-slate-400 font-medium">{item.uploadedDate}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredGallery.length === 0 && (
              <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-400">No media assets match search criteria.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
