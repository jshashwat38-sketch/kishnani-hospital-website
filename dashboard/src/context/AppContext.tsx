"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  status: "Admitted" | "Discharged" | "ER Queue";
  ward: string;
  admissionDate: string;
  history: string[];
  reports: { name: string; date: string; url?: string }[];
  prescriptions: { medicine: string; dosage: string; frequency: string }[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  dept: string;
  availability: "Available" | "In Surgery" | "On Leave" | "Busy";
  schedule: string;
  leaves: string[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  dept: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  priority: "Routine" | "Emergency";
}

export interface CMSData {
  hero: {
    title: string;
    subtitle: string;
    cta1: string;
    cta2: string;
  };
  about: {
    story: string;
    vision: string;
    mission: string;
  };
  packages: {
    id: string;
    name: string;
    price: string;
    features: string[];
  }[];
  emergencyNumbers: string[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: "Contact Form" | "WhatsApp Inquiry" | "Callback Request" | "Emergency Alert";
  message: string;
  date: string;
  status: "Unread" | "In Progress" | "Resolved";
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: { name: string; role: "Super Admin" | "Doctor" | "Staff" } | null;
  loginUser: (username: string, role: "Super Admin" | "Doctor" | "Staff") => void;
  logoutUser: () => void;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id">) => void;
  updatePatient: (id: string, updated: Partial<Patient>) => void;
  dischargePatient: (id: string) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, "id">) => void;
  updateDoctor: (id: string, updated: Partial<Doctor>) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  assignDoctor: (id: string, doctorName: string) => void;
  cmsData: CMSData;
  updateCMS: (data: Partial<CMSData>) => void;
  leads: Lead[];
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  notifications: SystemNotification[];
  addNotification: (title: string, message: string, type: SystemNotification["type"]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  bedStats: { total: number; occupied: number; icuTotal: number; icuOccupied: number };
  ambulanceStats: { total: number; active: number; dispatchLocation: string | null };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<AppContextType["user"]>(null);
  
  // State variables synchronized with local database APIs
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [cmsData, setCmsData] = useState<CMSData>({
    hero: {
      title: "Caring Hands, Advanced Healing",
      subtitle: "Kishnani Hospital: Delivering Excellence in Medical & Surgical Care since 2001.",
      cta1: "Book Appointment",
      cta2: "Emergency Callout"
    },
    about: {
      story: "Established in 2001 by Dr. Lal Kumar Kishnani, Kishnani Hospital has served the community of Bairagarh, Bhopal, with a dedication to accessible, top-quality healthcare.",
      vision: "To provide state-of-the-art medical services under one roof with utmost compassion and transparency.",
      mission: "To serve every stratum of society with high-end diagnostics, surgical excellence, and preventive wellness."
    },
    packages: [
      { id: "PKG-01", name: "Basic Wellness Checkup", price: "₹999", features: ["CBC Test", "Blood Sugar Fasting", "Urine Routine", "General consultation"] },
      { id: "PKG-02", name: "Executive Health Package", price: "₹2,499", features: ["Full Hemogram", "Kidney Function Tests", "Liver Function Tests", "ECG", "Physician Consultation"] },
      { id: "PKG-03", name: "Women's Health Shield", price: "₹2,999", features: ["Thyroid Profile", "Bone Mineral Dexa Profile", "Pelvic Ultrasound", "Gynecology Consult"] }
    ],
    emergencyNumbers: ["+91-755-2641234", "+91-98260-12345"]
  });

  // Load user from localStorage and fetch database records from local file API on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("hospital_admin_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load local database file values
    const loadDatabase = async () => {
      try {
        const fetchPatients = await fetch("/api/patients");
        if (fetchPatients.ok) setPatients(await fetchPatients.json());

        const fetchDoctors = await fetch("/api/doctors");
        if (fetchDoctors.ok) setDoctors(await fetchDoctors.json());

        const fetchAppointments = await fetch("/api/appointments");
        if (fetchAppointments.ok) setAppointments(await fetchAppointments.json());

        const fetchLeads = await fetch("/api/leads");
        if (fetchLeads.ok) setLeads(await fetchLeads.json());

        const fetchCms = await fetch("/api/cms");
        if (fetchCms.ok) setCmsData(await fetchCms.json());
      } catch (error) {
        console.error("Local database API fetch failed. Operating on fallback browser memory.", error);
      }
    };
    loadDatabase();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const loginUser = (username: string, role: "Super Admin" | "Doctor" | "Staff") => {
    const newUser = { name: username || "Administrator", role };
    setUser(newUser);
    localStorage.setItem("hospital_admin_user", JSON.stringify(newUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("hospital_admin_user");
  };

  // Patients Operations
  const addPatient = async (patientData: Omit<Patient, "id">) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData)
      });
      if (res.ok) {
        const result = await res.json();
        setPatients((prev) => [result.patient, ...prev]);
        addNotification("Patient Registered", `Successfully registered patient: ${result.patient.name}`, "success");
      }
    } catch (e) {
      // Memory fallback
      const fallback: Patient = { ...patientData, id: `PAT-${Date.now()}` };
      setPatients((prev) => [fallback, ...prev]);
    }
  };

  const updatePatient = async (id: string, updated: Partial<Patient>) => {
    try {
      const res = await fetch("/api/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated })
      });
      if (res.ok) {
        const result = await res.json();
        setPatients((prev) =>
          prev.map((pat) => (pat.id === id ? result.patient : pat))
        );
      }
    } catch (e) {
      setPatients((prev) =>
        prev.map((pat) => (pat.id === id ? { ...pat, ...updated } as Patient : pat))
      );
    }
  };

  const dischargePatient = async (id: string) => {
    await updatePatient(id, { status: "Discharged", ward: "None" });
    const patName = patients.find(p => p.id === id)?.name || "Patient";
    addNotification("Patient Discharged", `${patName} has been discharged from active care.`, "info");
  };

  // Doctors Operations
  const addDoctor = async (docData: Omit<Doctor, "id">) => {
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData)
      });
      if (res.ok) {
        const result = await res.json();
        setDoctors((prev) => [...prev, result.doctor]);
        addNotification("Doctor Appointed", `${result.doctor.name} added to empanelled directory.`, "success");
      }
    } catch (e) {
      const fallback: Doctor = { ...docData, id: `DOC-${Date.now()}` };
      setDoctors((prev) => [...prev, fallback]);
    }
  };

  const updateDoctor = async (id: string, updated: Partial<Doctor>) => {
    try {
      const res = await fetch("/api/doctors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated })
      });
      if (res.ok) {
        const result = await res.json();
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === id ? result.doctor : doc))
        );
      }
    } catch (e) {
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, ...updated } as Doctor : doc))
      );
    }
  };

  // Appointments Operations
  const addAppointment = async (aptData: Omit<Appointment, "id">) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aptData)
      });
      if (res.ok) {
        const result = await res.json();
        setAppointments((prev) => [result.appointment, ...prev]);
        addNotification(
          "New Appointment Booking",
          `Received a new ${result.appointment.priority.toLowerCase()} request from ${result.appointment.patientName}`,
          result.appointment.priority === "Emergency" ? "error" : "info"
        );
      }
    } catch (e) {
      const fallback: Appointment = { ...aptData, id: `APT-${Date.now()}` };
      setAppointments((prev) => [fallback, ...prev]);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        const result = await res.json();
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? result.appointment : apt))
        );
        const patient = appointments.find(a => a.id === id)?.patientName || "Patient";
        addNotification(
          "Appointment " + status,
          `Appointment ticket ${id} for ${patient} has been ${status.toLowerCase()}`,
          status === "Approved" ? "success" : status === "Rejected" ? "warning" : "info"
        );
      }
    } catch (e) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    }
  };

  const assignDoctor = async (id: string, doctorName: string) => {
    await updateAppointment(id, { doctorName });
  };

  const updateAppointment = async (id: string, updated: Partial<Appointment>) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated })
      });
      if (res.ok) {
        const result = await res.json();
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? result.appointment : apt))
        );
      }
    } catch (e) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, ...updated } as Appointment : apt))
      );
    }
  };

  // CMS dynamic edits
  const updateCMS = async (data: Partial<CMSData>) => {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "cms", data })
      });
      if (res.ok) {
        const result = await res.json();
        setCmsData(result.cms);
        addNotification("CMS Updates Published", "Website dynamic layout blocks updated successfully.", "success");
      }
    } catch (e) {
      setCmsData((prev) => ({ ...prev, ...data }));
    }
  };

  // Leads & Contact Forms Operations
  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        const result = await res.json();
        setLeads((prev) =>
          prev.map((ld) => (ld.id === id ? result.lead : ld))
        );
      }
    } catch (e) {
      setLeads((prev) =>
        prev.map((ld) => (ld.id === id ? { ...ld, status } : ld))
      );
    }
  };

  // Local notifications system log
  const addNotification = (title: string, message: string, type: SystemNotification["type"]) => {
    const newNotif: SystemNotification = {
      id: `NT-${Date.now()}`,
      title,
      message,
      time: "Just now",
      type,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Bed inventory calculator
  const bedStats = {
    total: 50,
    occupied: patients.filter(p => p.status === "Admitted" && !p.ward.includes("ICU")).length + 9,
    icuTotal: 10,
    icuOccupied: patients.filter(p => p.status === "Admitted" && p.ward.includes("ICU")).length + 6
  };

  // Emergency Ambulance dispatch status
  const ambulanceStats = {
    total: 4,
    active: 2,
    dispatchLocation: "Bairagarh Railway Crossing"
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        loginUser,
        logoutUser,
        patients,
        addPatient,
        updatePatient,
        dischargePatient,
        doctors,
        addDoctor,
        updateDoctor,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        assignDoctor,
        cmsData,
        updateCMS,
        leads,
        updateLeadStatus,
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        bedStats,
        ambulanceStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
