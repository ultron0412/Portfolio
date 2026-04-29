import mongoose from "mongoose";

const personalSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Ayush Jung Kunwar", trim: true },
    title: {
      type: String,
      default: "AI / ML Engineer · Full-Stack Developer · System Engineer",
      trim: true,
    },
    email: {
      type: String,
      default: "ayushjung.kunwar369@gmail.com",
      trim: true,
      lowercase: true,
    },
    phone: { type: String, default: "+977 9868491112", trim: true },
    location: { type: String, default: "Sanepa, Lalitpur, Nepal", trim: true },
    linkedin: { type: String, default: "linkedin.com/in/ayush-jung-kunwar-169733276", trim: true },
    github: { type: String, default: "github.com/ultron0412", trim: true },
    resumeUrl: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    responsibilities: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    technologies: [{ type: String, trim: true }],
    year: { type: String, required: true, trim: true },
    github: { type: String, trim: true, default: "" },
    demo: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    credentialUrl: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const portfolioSchema = new mongoose.Schema(
  {
    personal: { type: personalSchema, default: () => ({}) },
    summary: {
      type: String,
      default:
        "AI/ML enthusiast and Full-Stack Developer with professional experience in enterprise data systems and AI-powered applications.",
      trim: true,
    },
    experience: [experienceSchema],
    projects: [projectSchema],
    skills: { type: Map, of: [String], default: {} },
    education: [educationSchema],
    certifications: [certificationSchema],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
