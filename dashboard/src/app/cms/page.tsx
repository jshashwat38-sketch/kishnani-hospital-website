"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  LayoutTemplate,
  Save,
  Activity,
  ChevronRight,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  ListPlus,
  Globe,
  Monitor,
  Eye,
  Settings,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CMSEditorPage() {
  const { cmsData, updateCMS, addNotification } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "packages">("hero");

  // Local editor state loaded from AppContext
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCta1, setHeroCta1] = useState("");
  const [heroCta2, setHeroCta2] = useState("");

  const [aboutStory, setAboutStory] = useState("");
  const [aboutVision, setAboutVision] = useState("");
  const [aboutMission, setAboutMission] = useState("");

  const [packages, setPackages] = useState<typeof cmsData.packages>([]);

  useEffect(() => {
    setIsMounted(true);
    if (cmsData) {
      setHeroTitle(cmsData.hero.title);
      setHeroSubtitle(cmsData.hero.subtitle);
      setHeroCta1(cmsData.hero.cta1);
      setHeroCta2(cmsData.hero.cta2);

      setAboutStory(cmsData.about.story);
      setAboutVision(cmsData.about.vision);
      setAboutMission(cmsData.about.mission);

      setPackages([...cmsData.packages]);
    }
  }, [cmsData]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-spin text-teal-650" />
          <p className="text-sm font-semibold text-slate-500">Loading CMS Publisher Engine...</p>
        </div>
      </div>
    );
  }

  // Publish all changes to global store
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateCMS({
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        cta1: heroCta1,
        cta2: heroCta2
      },
      about: {
        story: aboutStory,
        vision: aboutVision,
        mission: aboutMission
      },
      packages: packages
    });

    addNotification("CMS Updates Published", "Website dynamic layout blocks updated successfully.", "success");
  };

  const handleUpdatePackage = (index: number, field: string, value: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
  };

  const handleAddFeature = (pkgIndex: number) => {
    const updated = [...packages];
    updated[pkgIndex].features.push("New Feature Benefit");
    setPackages(updated);
  };

  const handleRemoveFeature = (pkgIndex: number, featIndex: number) => {
    const updated = [...packages];
    updated[pkgIndex].features.splice(featIndex, 1);
    setPackages(updated);
  };

  const handleUpdateFeatureText = (pkgIndex: number, featIndex: number, text: string) => {
    const updated = [...packages];
    updated[pkgIndex].features[featIndex] = text;
    setPackages(updated);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-white">Website CMS Panel</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Directly edit titles, wellness packages, FAQs, and clinical mission text visible to users on the front-end hospital homepage.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePublish}
              className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 font-bold text-white rounded-xl shadow-md transition text-xs"
            >
              <Save className="h-4 w-4" />
              <span>Publish Live Updates</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE PREVIEW FRAME BANNER */}
        <div className="p-4 bg-gradient-to-r from-teal-600 to-blue-650 text-white rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Live Web Integration</h3>
              <p className="text-[10px] text-teal-100 mt-0.5">Website sync is in automated mock simulation mode.</p>
            </div>
          </div>
          <a
            href="../index.html"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md font-bold text-[10px] rounded-lg transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview Static Website</span>
          </a>
        </div>

        {/* EDITOR LAYOUT WITH TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* TAB SYSTEM */}
          <div className="lg:col-span-3 flex flex-col space-y-1.5 bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-3 mb-1">Editor Domains</span>
            <button
              onClick={() => setActiveTab("hero")}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "hero"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                  : "text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-950"
              }`}
            >
              <Monitor className="h-4.5 w-4.5" />
              <span>Hero Home Banner</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "about"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                  : "text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-950"
              }`}
            >
              <LayoutTemplate className="h-4.5 w-4.5" />
              <span>Hospital Story & Vision</span>
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                activeTab === "packages"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                  : "text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-950"
              }`}
            >
              <Tag className="h-4.5 w-4.5" />
              <span>Preventive Wellness</span>
            </button>
          </div>

          {/* EDITOR FORM BLOCK */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* TAB 1: HERO */}
              {activeTab === "hero" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Configure Hero Banner</h3>
                    <p className="text-xs text-slate-400">Update main catchphrase and action links for immediate visitor engagement.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Hero Headline Title</label>
                      <input
                        type="text"
                        required
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="mt-1.5 w-full text-sm p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Subtext Tagline Description</label>
                      <textarea
                        rows={3}
                        required
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-700 dark:text-slate-350 leading-relaxed font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">CTA Button 1 Text (Booking Wizard)</label>
                        <input
                          type="text"
                          required
                          value={heroCta1}
                          onChange={(e) => setHeroCta1(e.target.value)}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-300 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">CTA Button 2 Text (Ambulance Emergency)</label>
                        <input
                          type="text"
                          required
                          value={heroCta2}
                          onChange={(e) => setHeroCta2(e.target.value)}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-300 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ABOUT STORY */}
              {activeTab === "about" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Hospital Story, Vision & Mission</h3>
                    <p className="text-xs text-slate-400">Establish corporate credentials, foundational principles, and history lines.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Establishment Narrative Story</label>
                      <textarea
                        rows={4}
                        required
                        value={aboutStory}
                        onChange={(e) => setAboutStory(e.target.value)}
                        className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-700 dark:text-slate-350 leading-relaxed font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Clinical Vision Statement</label>
                        <textarea
                          rows={3}
                          required
                          value={aboutVision}
                          onChange={(e) => setAboutVision(e.target.value)}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-705 dark:text-slate-350 leading-relaxed font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Clinical Mission Focus</label>
                        <textarea
                          rows={3}
                          required
                          value={aboutMission}
                          onChange={(e) => setAboutMission(e.target.value)}
                          className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-705 dark:text-slate-350 leading-relaxed font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: PACKAGES */}
              {activeTab === "packages" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Empanelled Preventive Wellness Packages</h3>
                    <p className="text-xs text-slate-400">Directly adjust checkup card inclusions, titles, prices, and features.</p>
                  </div>

                  <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                    {packages.map((pkg, pkgIndex) => (
                      <div key={pkg.id} className={`pt-6 first:pt-0 space-y-4`}>
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 text-[10px] font-bold text-teal-650 dark:text-teal-400 uppercase">
                            {pkg.id} (Dynamic Card)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Package Name Title</label>
                            <input
                              type="text"
                              required
                              value={pkg.name}
                              onChange={(e) => handleUpdatePackage(pkgIndex, "name", e.target.value)}
                              className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-300 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Consultation Fee Price (INR)</label>
                            <input
                              type="text"
                              required
                              value={pkg.price}
                              onChange={(e) => handleUpdatePackage(pkgIndex, "price", e.target.value)}
                              className="mt-1.5 w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-650 focus:outline-none text-slate-800 dark:text-slate-305 font-bold"
                            />
                          </div>
                        </div>

                        {/* FEATURES INCLUDED LIST */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Inclusions & Diagnostic Benefits</label>
                            <button
                              type="button"
                              onClick={() => handleAddFeature(pkgIndex)}
                              className="flex items-center space-x-1 text-[9px] font-extrabold text-teal-650 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/20 px-2 py-0.5 rounded transition border border-teal-100/50 dark:border-teal-900/30"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Inclusion Row</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {pkg.features.map((feat, featIndex) => (
                              <div key={featIndex} className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-850">
                                <input
                                  type="text"
                                  required
                                  value={feat}
                                  onChange={(e) => handleUpdateFeatureText(pkgIndex, featIndex, e.target.value)}
                                  className="flex-1 text-[11px] bg-transparent focus:outline-none text-slate-700 dark:text-slate-300 font-semibold px-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFeature(pkgIndex, featIndex)}
                                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 rounded transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SAVE ACTION ROW */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2.5">
                <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1.5 mr-auto">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Config changes are staged for production publish.</span>
                </div>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 font-black text-white text-xs rounded-xl shadow-lg transition"
                >
                  <Save className="h-4.5 w-4.5" />
                  <span>Publish CMS Layout Live</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
