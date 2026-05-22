import { neon } from '@neondatabase/serverless';

// Retrieve connection string from environment variables
const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL or POSTGRES_URL environment variables are not set! Connecting to empty fallback.");
}

const sql = neon(DATABASE_URL || 'postgres://dummy:dummy@localhost:5432/dummy');

// Interface structures matching AppContext.tsx EXACTLY for complete type safety
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

export interface BlogPost {
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

export interface Testimonial {
  id: string;
  patientName: string;
  name: string;
  treatment: string;
  rating: number;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  approved: boolean;
  review: string;
  comment: string;
  sentiment: "Positive" | "Neutral" | "Critical";
}

export interface DepartmentData {
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

export interface DatabaseSchema {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  leads: Lead[];
  notifications: SystemNotification[];
  cms: CMSData;
  blogs: BlogPost[];
  testimonials: Testimonial[];
  departments: DepartmentData[];
}

// Initial mockup data to seed the database if it doesn't exist in PostgreSQL
const INITIAL_DATA: DatabaseSchema = {
  patients: [
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
      ward: "None",
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
    }
  ],
  doctors: [
    { id: "DOC-001", name: "Dr. Lal Kumar Kishnani", specialty: "Chief Physician - General Medicine", dept: "General Medicine", availability: "Available", schedule: "09:00 AM - 02:00 PM", leaves: [] },
    { id: "DOC-002", name: "Dr. Rajesh Kishnani", specialty: "Chief Surgeon - Laparoscopic Surgery", dept: "Surgery", availability: "In Surgery", schedule: "11:00 AM - 05:00 PM", leaves: [] },
    { id: "DOC-003", name: "Dr. Anita Sharma", specialty: "Obstetrics & Gynecology Specialist", dept: "Gynecology", availability: "Available", schedule: "10:00 AM - 03:00 PM", leaves: [] },
    { id: "DOC-004", name: "Dr. Mansi Kishnani", specialty: "Senior Consultant - Ophthalmology", dept: "Ophthalmology", availability: "On Leave", schedule: "09:00 AM - 01:00 PM", leaves: ["2026-05-22"] },
    { id: "DOC-005", name: "Dr. Sunita Patel", specialty: "Consultant Cardiologist", dept: "Cardiology", availability: "Available", schedule: "12:00 PM - 04:00 PM", leaves: [] },
    { id: "DOC-006", name: "Dr. Amit Verma", specialty: "Consultant Pediatrician", dept: "Pediatrics", availability: "Available", schedule: "09:00 AM - 01:00 PM", leaves: [] }
  ],
  appointments: [
    { id: "APT-101", patientName: "Karan Johar", doctorName: "Dr. Lal Kumar Kishnani", date: "2026-05-22", time: "10:00 AM", dept: "General Medicine", status: "Approved", priority: "Routine" },
    { id: "APT-102", patientName: "Meera Bai", doctorName: "Dr. Rajesh Kishnani", date: "2026-05-22", time: "02:30 PM", dept: "Surgery", status: "Pending", priority: "Emergency" },
    { id: "APT-103", patientName: "Kabir Singh", doctorName: "Dr. Sunita Patel", date: "2026-05-23", time: "11:00 AM", dept: "Cardiology", status: "Approved", priority: "Routine" },
    { id: "APT-104", patientName: "Anjali Gupta", doctorName: "Dr. Anita Sharma", date: "2026-05-22", time: "11:30 AM", dept: "Gynecology", status: "Pending", priority: "Routine" }
  ],
  leads: [
    { id: "LD-001", name: "Suresh Chandra", phone: "9823471623", type: "Contact Form", message: "Looking for corporate empanelment details regarding Ayushman Bharat policies.", date: "2026-05-22", status: "Unread" },
    { id: "LD-002", name: "Pawan Kalra", phone: "8827361523", type: "WhatsApp Inquiry", message: "Is Dr. Rajesh available for consult tomorrow at 11 AM?", date: "2026-05-22", status: "In Progress" },
    { id: "LD-003", name: "Emergency Dispatch", phone: "108 Hotline", type: "Emergency Alert", message: "Ambulance requested near Bairagarh Railway Crossing. Cardiac distress reported.", date: "2026-05-22", status: "Resolved" }
  ],
  notifications: [
    { id: "NT-001", title: "ICU Bed Alert", message: "ICU Bed occupancy has reached 90%. Only 1 bed left.", time: "10 mins ago", type: "warning", read: false },
    { id: "NT-002", title: "Ambulance Dispatched", message: "Ambulance 02 sent to Bairagarh Railway Crossing.", time: "25 mins ago", type: "info", read: true },
    { id: "NT-003", title: "Emergency Consultation", message: "Patient Meera Bai registered under emergency priority.", time: "1 hour ago", type: "error", read: false }
  ],
  blogs: [
    {
      id: "PST-201",
      title: "Preventing Seasonal Bronchitis in Bhopal Monsoon",
      author: "Dr. Lal Kumar Kishnani",
      category: "Wellness Tips",
      status: "Published",
      publishedDate: "2026-05-18",
      readTime: "5 mins read",
      content: "Monsoon showers bring relief from heat but also trigger pediatric and senior pulmonary concerns. High relative humidity facilitates allergen suspensions. We recommend keeping living spaces well-ventilated, drinking hot fluids, and consulting our general medicine OPD at first sign of recurring wheeze.",
      tags: ["Monsoon", "Bronchitis", "Wellness", "Bhopal"]
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
  ],
  testimonials: [
    {
      id: "REV-001",
      patientName: "Kamlesh Mandloi",
      name: "Kamlesh Mandloi",
      treatment: "Laparoscopic Gallbladder Surgery",
      rating: 5,
      date: "2026-05-21",
      status: "Approved",
      approved: true,
      sentiment: "Positive",
      review: "Heartfelt gratitude to Dr. Rajesh Kishnani! The single-incision keyhole surgery was done within 40 minutes, and I was back on my feet walking around Bairagarh the very next evening. Very professional support team!",
      comment: "Heartfelt gratitude to Dr. Rajesh Kishnani! The single-incision keyhole surgery was done within 40 minutes, and I was back on my feet walking around Bairagarh the very next evening. Very professional support team!"
    },
    {
      id: "REV-002",
      patientName: "Sunita Advani",
      name: "Sunita Advani",
      treatment: "Cataract Surgery Setup",
      rating: 5,
      date: "2026-05-20",
      status: "Approved",
      approved: true,
      sentiment: "Positive",
      review: "Dr. Mansi Kishnani guided me so gently through my eye checkup and lens placement. My vision is fully crystal clear now. The clinic has excellent, clean sanitization systems.",
      comment: "Dr. Mansi Kishnani guided me so gently through my eye checkup and lens placement. My vision is fully crystal clear now. The clinic has excellent, clean sanitization systems."
    },
    {
      id: "REV-003",
      patientName: "Gurpreet Singh",
      name: "Gurpreet Singh",
      treatment: "Ayushman Card Admission",
      rating: 4,
      date: "2026-05-22",
      status: "Pending",
      approved: false,
      sentiment: "Positive",
      review: "Getting my father admitted under Ayushman Bharat scheme was quick. Receptionists handled the card scanning documents smoothly. Clean wards and timely OPD rounds.",
      comment: "Getting my father admitted under Ayushman Bharat scheme was quick. Receptionists handled the card scanning documents smoothly. Clean wards and timely OPD rounds."
    },
    {
      id: "REV-004",
      patientName: "Vikram Rathore",
      name: "Vikram Rathore",
      treatment: "Emergency Triage Services",
      rating: 3,
      date: "2026-05-18",
      status: "Approved",
      approved: true,
      sentiment: "Neutral",
      review: "Treatment quality is highly medical standard, but the ER waiting lounge got quite crowded during the evening heat wave peak. OPD queues took some extra minutes to resolve.",
      comment: "Treatment quality is highly medical standard, but the ER waiting lounge got quite crowded during the evening heat wave peak. OPD queues took some extra minutes to resolve."
    },
    {
      id: "REV-005",
      patientName: "Anjali Saxena",
      name: "Anjali Saxena",
      treatment: "Maternity Packages",
      rating: 5,
      date: "2026-05-22",
      status: "Pending",
      approved: false,
      sentiment: "Positive",
      review: "Dr. Anita Sharma is highly compassionate. Delivered my baby girl here, and the Deluxe nursing rooms made my stay very comforting. Thank you Kishnani Hospital team!",
      comment: "Dr. Anita Sharma is highly compassionate. Delivered my baby girl here, and the Deluxe nursing rooms made my stay very comforting. Thank you Kishnani Hospital team!"
    }
  ],
  cms: {
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
  },
  departments: [
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
  ]
};

class DatabaseWrapper {
  constructor() {
    // Background async initialization of the tables and seeds
    if (DATABASE_URL) {
      this.init().then(() => {
        console.log("PostgreSQL database tables verified and loaded successfully.");
      }).catch((err) => {
        console.error("PostgreSQL database initialization failed:", err);
      });
    }
  }

  private async init() {
    // 1. Create SQL tables if they do not exist
    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER,
        gender VARCHAR(20),
        phone VARCHAR(50) NOT NULL,
        bloodGroup VARCHAR(10),
        status VARCHAR(50),
        ward VARCHAR(100),
        admissionDate VARCHAR(50),
        history JSONB,
        reports JSONB,
        prescriptions JSONB
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialty VARCHAR(150),
        dept VARCHAR(100),
        availability VARCHAR(50),
        schedule VARCHAR(100),
        leaves JSONB
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        patientName VARCHAR(100) NOT NULL,
        doctorName VARCHAR(100),
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        dept VARCHAR(100),
        status VARCHAR(50),
        priority VARCHAR(50)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        type VARCHAR(100),
        message TEXT,
        date VARCHAR(50),
        status VARCHAR(50)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        message TEXT,
        time VARCHAR(100),
        type VARCHAR(50),
        read BOOLEAN DEFAULT FALSE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100),
        category VARCHAR(100),
        status VARCHAR(50),
        publishedDate VARCHAR(50),
        readTime VARCHAR(50),
        content TEXT,
        tags JSONB
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(50) PRIMARY KEY,
        patientName VARCHAR(100),
        name VARCHAR(100),
        treatment VARCHAR(150),
        rating INTEGER,
        date VARCHAR(50),
        comment TEXT,
        review TEXT,
        sentiment VARCHAR(50),
        status VARCHAR(50),
        approved BOOLEAN DEFAULT FALSE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cms (
        section VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        head VARCHAR(100),
        category VARCHAR(100),
        doctorsCount INTEGER,
        patientsCount INTEGER,
        opdLimit INTEGER,
        active BOOLEAN DEFAULT TRUE,
        description TEXT
      );
    `;

    // 2. Run seeders if tables are empty
    await this.seed();
  }

  private async seed() {
    // Seed patients
    const patientCountRes = await sql`SELECT COUNT(*) as count FROM patients`;
    const patientsCount = parseInt(patientCountRes[0].count, 10);
    if (patientsCount === 0) {
      for (const p of INITIAL_DATA.patients) {
        await sql`
          INSERT INTO patients (id, name, age, gender, phone, bloodGroup, status, ward, admissionDate, history, reports, prescriptions)
          VALUES (${p.id}, ${p.name}, ${p.age}, ${p.gender}, ${p.phone}, ${p.bloodGroup}, ${p.status}, ${p.ward}, ${p.admissionDate}, ${JSON.stringify(p.history)}, ${JSON.stringify(p.reports)}, ${JSON.stringify(p.prescriptions)})
        `;
      }
    }

    // Seed doctors
    const doctorCountRes = await sql`SELECT COUNT(*) as count FROM doctors`;
    const doctorsCount = parseInt(doctorCountRes[0].count, 10);
    if (doctorsCount === 0) {
      for (const d of INITIAL_DATA.doctors) {
        await sql`
          INSERT INTO doctors (id, name, specialty, dept, availability, schedule, leaves)
          VALUES (${d.id}, ${d.name}, ${d.specialty}, ${d.dept}, ${d.availability}, ${d.schedule}, ${JSON.stringify(d.leaves)})
        `;
      }
    }

    // Seed appointments
    const apptCountRes = await sql`SELECT COUNT(*) as count FROM appointments`;
    const apptsCount = parseInt(apptCountRes[0].count, 10);
    if (apptsCount === 0) {
      for (const a of INITIAL_DATA.appointments) {
        await sql`
          INSERT INTO appointments (id, patientName, doctorName, date, time, dept, status, priority)
          VALUES (${a.id}, ${a.patientName}, ${a.doctorName}, ${a.date}, ${a.time}, ${a.dept}, ${a.status}, ${a.priority})
        `;
      }
    }

    // Seed leads
    const leadCountRes = await sql`SELECT COUNT(*) as count FROM leads`;
    const leadsCount = parseInt(leadCountRes[0].count, 10);
    if (leadsCount === 0) {
      for (const l of INITIAL_DATA.leads) {
        await sql`
          INSERT INTO leads (id, name, phone, type, message, date, status)
          VALUES (${l.id}, ${l.name}, ${l.phone}, ${l.type}, ${l.message}, ${l.date}, ${l.status})
        `;
      }
    }

    // Seed notifications
    const notifCountRes = await sql`SELECT COUNT(*) as count FROM notifications`;
    const notificationsCount = parseInt(notifCountRes[0].count, 10);
    if (notificationsCount === 0) {
      for (const n of INITIAL_DATA.notifications) {
        await sql`
          INSERT INTO notifications (id, title, message, time, type, read)
          VALUES (${n.id}, ${n.title}, ${n.message}, ${n.time}, ${n.type}, ${n.read})
        `;
      }
    }

    // Seed blogs
    const blogCountRes = await sql`SELECT COUNT(*) as count FROM blogs`;
    const blogsCount = parseInt(blogCountRes[0].count, 10);
    if (blogsCount === 0) {
      for (const b of INITIAL_DATA.blogs) {
        await sql`
          INSERT INTO blogs (id, title, author, category, status, publishedDate, readTime, content, tags)
          VALUES (${b.id}, ${b.title}, ${b.author}, ${b.category}, ${b.status}, ${b.publishedDate}, ${b.readTime}, ${b.content}, ${JSON.stringify(b.tags)})
        `;
      }
    }

    // Seed testimonials
    const testCountRes = await sql`SELECT COUNT(*) as count FROM testimonials`;
    const testimonialsCount = parseInt(testCountRes[0].count, 10);
    if (testimonialsCount === 0) {
      for (const t of INITIAL_DATA.testimonials) {
        await sql`
          INSERT INTO testimonials (id, patientName, name, treatment, rating, date, comment, review, sentiment, status, approved)
          VALUES (${t.id}, ${t.patientName}, ${t.name}, ${t.treatment}, ${t.rating}, ${t.date}, ${t.comment}, ${t.review}, ${t.sentiment}, ${t.status}, ${t.approved})
        `;
      }
    }

    // Seed CMS data
    const cmsCountRes = await sql`SELECT COUNT(*) as count FROM cms`;
    const cmsCount = parseInt(cmsCountRes[0].count, 10);
    if (cmsCount === 0) {
      await sql`INSERT INTO cms (section, data) VALUES ('hero', ${JSON.stringify(INITIAL_DATA.cms.hero)})`;
      await sql`INSERT INTO cms (section, data) VALUES ('about', ${JSON.stringify(INITIAL_DATA.cms.about)})`;
      await sql`INSERT INTO cms (section, data) VALUES ('packages', ${JSON.stringify(INITIAL_DATA.cms.packages)})`;
      await sql`INSERT INTO cms (section, data) VALUES ('emergencyNumbers', ${JSON.stringify(INITIAL_DATA.cms.emergencyNumbers)})`;
    }

    // Seed departments
    const deptCountRes = await sql`SELECT COUNT(*) as count FROM departments`;
    const deptsCount = parseInt(deptCountRes[0].count, 10);
    if (deptsCount === 0) {
      for (const d of INITIAL_DATA.departments) {
        await sql`
          INSERT INTO departments (id, name, head, category, doctorsCount, patientsCount, opdLimit, active, description)
          VALUES (${d.id}, ${d.name}, ${d.head}, ${d.category}, ${d.doctorsCount}, ${d.patientsCount}, ${d.opdLimit}, ${d.active}, ${d.description})
        `;
      }
    }
  }

  public async get<K extends keyof DatabaseSchema>(table: K): Promise<DatabaseSchema[K]> {
    if (table === 'cms') {
      const rows = await sql`SELECT * FROM cms`;
      const cmsData: any = { hero: {}, about: {}, packages: [], emergencyNumbers: [] };
      rows.forEach((row: any) => {
        cmsData[row.section] = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      });
      return cmsData;
    }

    const rows = await (sql as any)(`SELECT * FROM ${table}`);
    
    // Explicit type casts for boolean and arrays from JSONB columns for downstream files
    if (table === 'patients') {
      return rows.map((r: any) => ({
        ...r,
        history: typeof r.history === 'string' ? JSON.parse(r.history || '[]') : (r.history || []),
        reports: typeof r.reports === 'string' ? JSON.parse(r.reports || '[]') : (r.reports || []),
        prescriptions: typeof r.prescriptions === 'string' ? JSON.parse(r.prescriptions || '[]') : (r.prescriptions || [])
      })) as any;
    }

    if (table === 'doctors') {
      return rows.map((r: any) => ({
        ...r,
        leaves: typeof r.leaves === 'string' ? JSON.parse(r.leaves || '[]') : (r.leaves || [])
      })) as any;
    }

    if (table === 'blogs') {
      return rows.map((r: any) => ({
        ...r,
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (r.tags || [])
      })) as any;
    }

    if (table === 'testimonials') {
      return rows.map((r: any) => ({
        ...r,
        rating: Number(r.rating || 5),
        approved: Boolean(r.approved)
      })) as any;
    }

    if (table === 'notifications') {
      return rows.map((r: any) => ({
        ...r,
        read: Boolean(r.read)
      })) as any;
    }

    if (table === 'departments') {
      return rows.map((r: any) => ({
        ...r,
        doctorsCount: Number(r.doctorsCount || 0),
        patientsCount: Number(r.patientsCount || 0),
        opdLimit: Number(r.opdLimit || 0),
        active: Boolean(r.active)
      })) as any;
    }

    return rows as any;
  }

  public async insert<K extends keyof DatabaseSchema>(table: K, record: any): Promise<any> {
    const id = record.id || `${table.substring(0, 3).toUpperCase()}-${Date.now()}`;
    const data = { ...record, id };

    if (table === 'patients') {
      await sql`
        INSERT INTO patients (id, name, age, gender, phone, bloodGroup, status, ward, admissionDate, history, reports, prescriptions)
        VALUES (${data.id}, ${data.name}, ${data.age || 30}, ${data.gender || 'Male'}, ${data.phone}, ${data.bloodGroup || 'O+'}, ${data.status || 'ER Queue'}, ${data.ward || 'Emergency Triage'}, ${data.admissionDate || new Date().toISOString().split('T')[0]}, ${JSON.stringify(data.history || [])}, ${JSON.stringify(data.reports || [])}, ${JSON.stringify(data.prescriptions || [])})
      `;
    } else if (table === 'doctors') {
      await sql`
        INSERT INTO doctors (id, name, specialty, dept, availability, schedule, leaves)
        VALUES (${data.id}, ${data.name}, ${data.specialty}, ${data.dept}, ${data.availability || 'Available'}, ${data.schedule}, ${JSON.stringify(data.leaves || [])})
      `;
    } else if (table === 'appointments') {
      await sql`
        INSERT INTO appointments (id, patientName, doctorName, date, time, dept, status, priority)
        VALUES (${data.id}, ${data.patientName}, ${data.doctorName || 'Dr. Lal Kumar Kishnani'}, ${data.date}, ${data.time}, ${data.dept || 'General Medicine'}, ${data.status || 'Pending'}, ${data.priority || 'Routine'})
      `;
    } else if (table === 'leads') {
      await sql`
        INSERT INTO leads (id, name, phone, type, message, date, status)
        VALUES (${data.id}, ${data.name}, ${data.phone}, ${data.type || 'Contact Form'}, ${data.message}, ${data.date || new Date().toISOString().split('T')[0]}, ${data.status || 'Unread'})
      `;
    } else if (table === 'notifications') {
      await sql`
        INSERT INTO notifications (id, title, message, time, type, read)
        VALUES (${data.id}, ${data.title}, ${data.message}, ${data.time || 'Just now'}, ${data.type || 'info'}, ${data.read || false})
      `;
    } else if (table === 'blogs') {
      await sql`
        INSERT INTO blogs (id, title, author, category, status, publishedDate, readTime, content, tags)
        VALUES (${data.id}, ${data.title}, ${data.author}, ${data.category || 'Wellness Tips'}, ${data.status || 'Draft'}, ${data.publishedDate || new Date().toISOString().split('T')[0]}, ${data.readTime || '5 mins read'}, ${data.content}, ${JSON.stringify(data.tags || [])})
      `;
    } else if (table === 'testimonials') {
      await sql`
        INSERT INTO testimonials (id, patientName, name, treatment, rating, date, comment, review, sentiment, status, approved)
        VALUES (${data.id}, ${data.patientName || data.name}, ${data.name || data.patientName}, ${data.treatment || 'General Consultation'}, ${data.rating || 5}, ${data.date || new Date().toISOString().split('T')[0]}, ${data.comment || data.review}, ${data.review || data.comment}, ${data.sentiment || 'Positive'}, ${data.status || (data.approved ? 'Approved' : 'Pending')}, ${data.approved || false})
      `;
    } else if (table === 'departments') {
      await sql`
        INSERT INTO departments (id, name, head, category, doctorsCount, patientsCount, opdLimit, active, description)
        VALUES (${data.id}, ${data.name}, ${data.head}, ${data.category || 'Clinical'}, ${data.doctorsCount || 0}, ${data.patientsCount || 0}, ${data.opdLimit || 50}, ${data.active || false}, ${data.description})
      `;
    }

    return data;
  }

  public async update<K extends keyof DatabaseSchema>(table: K, id: string, updates: any): Promise<any> {
    const rows = await (sql as any)(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    const row = rows[0];
    if (!row) return null;

    const merged = { ...row, ...updates };

    if (table === 'patients') {
      const history = typeof updates.history !== 'undefined' ? updates.history : (typeof row.history === 'string' ? JSON.parse(row.history || '[]') : row.history);
      const reports = typeof updates.reports !== 'undefined' ? updates.reports : (typeof row.reports === 'string' ? JSON.parse(row.reports || '[]') : row.reports);
      const prescriptions = typeof updates.prescriptions !== 'undefined' ? updates.prescriptions : (typeof row.prescriptions === 'string' ? JSON.parse(row.prescriptions || '[]') : row.prescriptions);

      await sql`
        UPDATE patients
        SET name = ${merged.name}, age = ${merged.age}, gender = ${merged.gender}, phone = ${merged.phone}, bloodGroup = ${merged.bloodGroup}, status = ${merged.status}, ward = ${merged.ward}, admissionDate = ${merged.admissionDate}, history = ${JSON.stringify(history)}, reports = ${JSON.stringify(reports)}, prescriptions = ${JSON.stringify(prescriptions)}
        WHERE id = ${id}
      `;
      return { ...merged, history, reports, prescriptions };
    } else if (table === 'doctors') {
      const leaves = typeof updates.leaves !== 'undefined' ? updates.leaves : (typeof row.leaves === 'string' ? JSON.parse(row.leaves || '[]') : row.leaves);
      await sql`
        UPDATE doctors
        SET name = ${merged.name}, specialty = ${merged.specialty}, dept = ${merged.dept}, availability = ${merged.availability}, schedule = ${merged.schedule}, leaves = ${JSON.stringify(leaves)}
        WHERE id = ${id}
      `;
      return { ...merged, leaves };
    } else if (table === 'appointments') {
      await sql`
        UPDATE appointments
        SET patientName = ${merged.patientName}, doctorName = ${merged.doctorName}, date = ${merged.date}, time = ${merged.time}, dept = ${merged.dept}, status = ${merged.status}, priority = ${merged.priority}
        WHERE id = ${id}
      `;
      return merged;
    } else if (table === 'leads') {
      await sql`
        UPDATE leads
        SET name = ${merged.name}, phone = ${merged.phone}, type = ${merged.type}, message = ${merged.message}, date = ${merged.date}, status = ${merged.status}
        WHERE id = ${id}
      `;
      return merged;
    } else if (table === 'notifications') {
      await sql`
        UPDATE notifications
        SET title = ${merged.title}, message = ${merged.message}, time = ${merged.time}, type = ${merged.type}, read = ${merged.read || false}
        WHERE id = ${id}
      `;
      return merged;
    } else if (table === 'blogs') {
      const tags = typeof updates.tags !== 'undefined' ? updates.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : row.tags);
      await sql`
        UPDATE blogs
        SET title = ${merged.title}, author = ${merged.author}, category = ${merged.category}, status = ${merged.status}, publishedDate = ${merged.publishedDate}, readTime = ${merged.readTime}, content = ${merged.content}, tags = ${JSON.stringify(tags)}
        WHERE id = ${id}
      `;
      return { ...merged, tags };
    } else if (table === 'testimonials') {
      const approvedVal = typeof updates.approved !== 'undefined' ? updates.approved : row.approved;
      const statusVal = typeof updates.status !== 'undefined' ? updates.status : row.status;
      await sql`
        UPDATE testimonials
        SET patientName = ${merged.patientName || merged.name}, name = ${merged.name || merged.patientName}, treatment = ${merged.treatment}, rating = ${merged.rating}, date = ${merged.date}, comment = ${merged.comment || merged.review}, review = ${merged.review || merged.comment}, sentiment = ${merged.sentiment}, status = ${statusVal}, approved = ${approvedVal}
        WHERE id = ${id}
      `;
      return { ...merged, approved: approvedVal };
    } else if (table === 'departments') {
      const activeVal = typeof updates.active !== 'undefined' ? updates.active : row.active;
      await sql`
        UPDATE departments
        SET name = ${merged.name}, head = ${merged.head}, category = ${merged.category}, doctorsCount = ${merged.doctorsCount}, patientsCount = ${merged.patientsCount}, opdLimit = ${merged.opdLimit}, active = ${activeVal}, description = ${merged.description}
        WHERE id = ${id}
      `;
      return { ...merged, active: activeVal };
    }

    return null;
  }

  public async delete<K extends keyof DatabaseSchema>(table: K, id: string): Promise<boolean> {
    await (sql as any)(`DELETE FROM ${table} WHERE id = $1`, [id]);
    return true;
  }

  public async updateCMS(sectionOrUpdates: string | Partial<CMSData>, optionalUpdates?: any): Promise<CMSData> {
    let updates: Partial<CMSData> = {};
    if (typeof sectionOrUpdates === 'string') {
      const section = sectionOrUpdates;
      if (section === 'cms') {
        updates = optionalUpdates;
      } else {
        updates = { [section]: optionalUpdates };
      }
    } else {
      updates = sectionOrUpdates;
    }

    const current = await this.get('cms') as CMSData;
    const merged = { ...current };

    if (updates.hero) merged.hero = { ...merged.hero, ...updates.hero };
    if (updates.about) merged.about = { ...merged.about, ...updates.about };
    if (updates.packages) merged.packages = updates.packages;
    if (updates.emergencyNumbers) merged.emergencyNumbers = updates.emergencyNumbers;

    const saveStmt = async (section: string, data: any) => {
      await sql`
        INSERT INTO cms (section, data)
        VALUES (${section}, ${JSON.stringify(data)})
        ON CONFLICT(section) DO UPDATE SET data = EXCLUDED.data
      `;
    };

    await saveStmt('hero', merged.hero);
    await saveStmt('about', merged.about);
    await saveStmt('packages', merged.packages);
    await saveStmt('emergencyNumbers', merged.emergencyNumbers);

    return merged;
  }
}

export const db = new DatabaseWrapper();
