"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Stethoscope, Lock, Mail, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Super Admin" | "Doctor" | "Staff">("Super Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email or username");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate network authentication delay
    setTimeout(() => {
      let displayName = "Administrator";
      if (role === "Doctor") displayName = "Dr. Lal Kishnani";
      if (role === "Staff") displayName = "Reception Team";

      loginUser(displayName, role);
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  const handleQuickLogin = (selectedRole: "Super Admin" | "Doctor" | "Staff") => {
    setRole(selectedRole);
    if (selectedRole === "Super Admin") {
      setEmail("director@kishnanihospital.com");
      setPassword("director2026");
    } else if (selectedRole === "Doctor") {
      setEmail("lalkishnani@kishnanihospital.com");
      setPassword("doctor2026");
    } else {
      setEmail("reception@kishnanihospital.com");
      setPassword("reception2026");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 overflow-hidden relative px-4">
      {/* CINEMATIC CLINICAL GLOW BACKGROUNDS */}
      <div className="absolute top-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-blue-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md bg-slate-950/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative"
      >
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-xl shadow-teal-500/10 mb-4">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white leading-tight text-center">Kishnani Hospital ERP</h2>
          <span className="text-xs text-teal-400 font-semibold tracking-widest uppercase mt-1">Enterprise Admin Panel</span>
        </div>

        {/* ERROR BOX */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3.5 rounded-xl border border-red-900/30 bg-red-950/15 flex items-start space-x-2 text-xs text-red-400"
          >
            <ShieldAlert className="h-4.5 w-4.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* ROLE TABS */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
            Access Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-850">
            {(["Super Admin", "Doctor", "Staff"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  role === r
                    ? "bg-teal-600 text-white shadow-md shadow-teal-500/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r === "Super Admin" ? "Director" : r}
              </button>
            ))}
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kishnanihospital.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 w-full mt-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-[0.98] transition duration-200"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Verifying credentials...</span>
              </span>
            ) : (
              <>
                <span>Secure Authorization</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* QUICK SIMULATOR LOGINS */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 mb-3">
            <UserCheck className="h-4 w-4 text-teal-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Demo Credentials Simulators
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickLogin("Super Admin")}
              className="py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-slate-900 border border-slate-850 hover:bg-slate-850 transition"
            >
              Director
            </button>
            <button
              onClick={() => handleQuickLogin("Doctor")}
              className="py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-slate-900 border border-slate-850 hover:bg-slate-850 transition"
            >
              Doctor
            </button>
            <button
              onClick={() => handleQuickLogin("Staff")}
              className="py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 bg-slate-900 border border-slate-850 hover:bg-slate-850 transition"
            >
              Staff
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
