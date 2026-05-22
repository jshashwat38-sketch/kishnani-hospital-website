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

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem("hospital_admin_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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

  // Mock Patients Database state
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "PAT-001",
      name: "Aarav Sharma",
      age: 45,
      gender: "Male",
      phone: "9876543210",
      bloodGroup: "O+",
      status: "Admitted",
      ward: "ICU Bed 3",
      admissionDate: "2026-05-20",
      history: ["Hypertension", "Type 2 Diabetes"],
      reports: [
        { name: "Biochemistry Profile", date: "2026-05-21" },
        { name: "Chest X-Ray", date: "2026-05-20" }
      ],
      prescriptions: [
        { medicine: "Metformin 500mg", dosage: "1 Tab", frequency: "1-0-1" },
        { medicine: "Amlodipine 5mg", dosage: "1 Tab", frequency: "0-0-1" }
      ]
    },
    {
      id: "PAT-002",
      name: "Priya Patel",
      age: 32,
      gender: "Female",
      phone: "9123456789",
      bloodGroup: "A-",
      status: "Discharged",
      ward: "General Ward 102",
      admissionDate: "2026-05-18",
      history: ["Acute Appendicitis", "Laparoscopic Surgery"],
      reports: [{ name: "CBC Blood Report", date: "2026-05-18" }],
      prescriptions: [{ medicine: "Amoxicillin 500mg", dosage: "1 Cap", frequency: "1-1-1" }]
    },
    {
      id: "PAT-003",
      name: "Meera Bai",
      age: 50,
      gender: "Female",
      phone: "9812739123",
      bloodGroup: "O-",
      status: "Admitted",
      ward: "ICU Bed 1",
      admissionDate: "2026-05-22",
      history: ["Trauma / Road Accident", "Multiple Fractures"],
      reports: [{ name: "Head CT Scan", date: "2026-05-22" }],
      prescriptions: [{ medicine: "Tramadol (IV)", dosage: "50mg", frequency: "Emergency Only" }]
    },
    {
      id: "PAT-004",
      name: "Harish Kishnani",
      age: 62,
      gender: "Male",
      phone: "9822334455",
      bloodGroup: "AB+",
      status: "Admitted",
      ward: "Deluxe Room 301",
      admissionDate: "2026-05-19",
      history: ["Post-Op Orthopedic Care", "Hip Replacement"],
      reports: [{ name: "Pelvis X-Ray", date: "2026-05-19" }],
      prescriptions: [{ medicine: "Calcium D3", dosage: "1 Tab", frequency: "1-0-0" }]
    },
    {
      id: "PAT-005",
      name: "Rohan Verma",
      age: 7,
      gender: "Male",
      phone: "9923887755",
      bloodGroup: "B+",
      status: "ER Queue",
      ward: "Emergency Triage",
      admissionDate: "2026-05-22",
      history: ["Seasonal Bronchitis", "Fever"],
      reports: [],
      prescriptions: [{ medicine: "Paracetamol Syrup", dosage: "5ml", frequency: "S.O.S" }]
    }
  ]);

  const addPatient = (patientData: Omit<Patient, "id">) => {
    const newPatient: Patient = {
      ...patientData,
      id: `PAT-00${patients.length + 1}`
    };
    setPatients((prev) => [newPatient, ...prev]);
    addNotification("Patient Registered", `Successfully registered patient: ${newPatient.name}`, "success");
  };

  const updatePatient = (id: string, updated: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((pat) => (pat.id === id ? { ...pat, ...updated } as Patient : pat))
    );
  };

  const dischargePatient = (id: string) => {
    setPatients((prev) =>
      prev.map((pat) =>
        pat.id === id ? { ...pat, status: "Discharged", ward: "None" } as Patient : pat
      )
    );
    const patName = patients.find(p => p.id === id)?.name || "Patient";
    addNotification("Patient Discharged", `${patName} has been discharged from active care.`, "info");
  };

  // Mock Doctors Database
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "DOC-001",
      name: "Dr. Lal Kumar Kishnani",
      specialty: "Chief Physician - General Medicine",
      dept: "General Medicine",
      availability: "Available",
      schedule: "09:00 AM - 02:00 PM",
      leaves: []
    },
    {
      id: "DOC-002",
      name: "Dr. Rajesh Kishnani",
      specialty: "Chief Surgeon - Laparoscopic Surgery",
      dept: "Surgery",
      availability: "In Surgery",
      schedule: "11:00 AM - 05:00 PM",
      leaves: []
    },
    {
      id: "DOC-003",
      name: "Dr. Anita Sharma",
      specialty: "Obstetrics & Gynecology Specialist",
      dept: "Gynecology",
      availability: "Available",
      schedule: "10:00 AM - 03:00 PM",
      leaves: []
    },
    {
      id: "DOC-004",
      name: "Dr. Mansi Kishnani",
      specialty: "Senior Consultant - Ophthalmology",
      dept: "Ophthalmology",
      availability: "On Leave",
      schedule: "09:00 AM - 01:00 PM",
      leaves: ["2026-05-22"]
    },
    {
      id: "DOC-005",
      name: "Dr. Sunita Patel",
      specialty: "Consultant Cardiologist",
      dept: "Cardiology",
      availability: "Available",
      schedule: "12:00 PM - 04:00 PM",
      leaves: []
    },
    {
      id: "DOC-006",
      name: "Dr. Amit Verma",
      specialty: "Consultant Pediatrician",
      dept: "Pediatrics",
      availability: "Available",
      schedule: "09:00 AM - 01:00 PM",
      leaves: []
    }
  ]);

  const addDoctor = (docData: Omit<Doctor, "id">) => {
    const newDoc: Doctor = {
      ...docData,
      id: `DOC-00${doctors.length + 1}`
    };
    setDoctors((prev) => [...prev, newDoc]);
    addNotification("Doctor Appointed", `${newDoc.name} added to empanelled directory.`, "success");
  };

  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updated } as Doctor : doc))
    );
  };

  // Mock Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-101",
      patientName: "Karan Johar",
      doctorName: "Dr. Lal Kumar Kishnani",
      date: "2026-05-22",
      time: "10:00 AM",
      dept: "General Medicine",
      status: "Approved",
      priority: "Routine"
    },
    {
      id: "APT-102",
      patientName: "Meera Bai",
      doctorName: "Dr. Rajesh Kishnani",
      date: "2026-05-22",
      time: "02:30 PM",
      dept: "Surgery",
      status: "Pending",
      priority: "Emergency"
    },
    {
      id: "APT-103",
      patientName: "Kabir Singh",
      doctorName: "Dr. Sunita Patel",
      date: "2026-05-23",
      time: "11:00 AM",
      dept: "Cardiology",
      status: "Approved",
      priority: "Routine"
    },
    {
      id: "APT-104",
      patientName: "Anjali Gupta",
      doctorName: "Dr. Anita Sharma",
      date: "2026-05-22",
      time: "11:30 AM",
      dept: "Gynecology",
      status: "Pending",
      priority: "Routine"
    }
  ]);

  const addAppointment = (aptData: Omit<Appointment, "id">) => {
    const newApt: Appointment = {
      ...aptData,
      id: `APT-${100 + appointments.length + 1}`
    };
    setAppointments((prev) => [newApt, ...prev]);
    addNotification(
      "New Appointment Booking",
      `Recieved a new ${newApt.priority.toLowerCase()} request from ${newApt.patientName}`,
      newApt.priority === "Emergency" ? "error" : "info"
    );
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    const patient = appointments.find(a => a.id === id)?.patientName || "Patient";
    addNotification("Appointment " + status, `Appointment ticket ${id} for ${patient} has been ${status.toLowerCase()}`, status === "Approved" ? "success" : status === "Rejected" ? "warning" : "info");
  };

  const assignDoctor = (id: string, doctorName: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, doctorName } : apt))
    );
  };

  // Mock Website CMS
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

  const updateCMS = (data: Partial<CMSData>) => {
    setCmsData((prev) => ({ ...prev, ...data }));
    addNotification("CMS Updates Published", "Website dynamic layout blocks updated successfully.", "success");
  };

  // Mock Leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-001",
      name: "Suresh Chandra",
      phone: "9823471623",
      type: "Contact Form",
      message: "Looking for corporate empanelment details regarding Ayushman Bharat policies.",
      date: "2026-05-22",
      status: "Unread"
    },
    {
      id: "LD-002",
      name: "Pawan Kalra",
      phone: "8827361523",
      type: "WhatsApp Inquiry",
      message: "Is Dr. Rajesh available for consult tomorrow at 11 AM?",
      date: "2026-05-22",
      status: "In Progress"
    },
    {
      id: "LD-003",
      name: "Emergency Dispatch",
      phone: "108 Hotline",
      type: "Emergency Alert",
      message: "Ambulance requested near Bairagarh Railway Crossing. Cardiac distress reported.",
      date: "2026-05-22",
      status: "Resolved"
    }
  ]);

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((ld) => (ld.id === id ? { ...ld, status } : ld))
    );
  };

  // Mock Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "NT-001",
      title: "ICU Bed Alert",
      message: "ICU Bed occupancy has reached 90%. Only 1 bed left.",
      time: "10 mins ago",
      type: "warning",
      read: false
    },
    {
      id: "NT-002",
      title: "Ambulance Dispatched",
      message: "Ambulance 02 sent to Bairagarh Railway Crossing.",
      time: "25 mins ago",
      type: "info",
      read: true
    },
    {
      id: "NT-003",
      title: "Emergency Consultation",
      message: "Patient Meera Bai registered under emergency priority.",
      time: "1 hour ago",
      type: "error",
      read: false
    }
  ]);

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

  // Dynamic Bed stats
  const bedStats = {
    total: 50,
    occupied: patients.filter(p => p.status === "Admitted" && !p.ward.includes("ICU")).length + 9, // admitted patients plus baseline occupied
    icuTotal: 10,
    icuOccupied: patients.filter(p => p.status === "Admitted" && p.ward.includes("ICU")).length + 6 // ICU admitted patients plus baseline ICU occupied
  };

  // Dynamic Ambulance stats
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
