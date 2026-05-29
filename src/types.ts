/**
 * TypeScript Type Definitions for CanariaConnect
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string; // Full-time, Part-time, Híbrido, etc.
  description: string;
  category: string;
  publishedAt: string;
  requirements: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  hours: number;
  level: string;
  category: 'cocina' | 'energia-solar' | 'limpieza' | 'construccion' | 'espanol' | 'ia';
  description: string;
  modality: string; // Presencial, Online, Híbrido
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  location: string;
  bio: string;
  preferredCategory: string;
  savedJobIds: string[];
  appliedJobIds: { jobId: string; appliedAt: string; status: 'Enviada' | 'En revisión' | 'Aceptada' | 'Rechazada' }[];
  cvHistory: CVProfile[];
}

export interface CVProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  professionalSummary: string;
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: string[];
  languages: string[];
  dateGenerated: string;
}

export interface AdminTopic {
  id: string;
  title: string;
  category: 'residencia' | 'contrato' | 'nie' | 'asistencia';
  icon: string;
  summary: string;
  steps: string[];
  usefulLinks: { label: string; url: string }[];
}

export interface HousingItem {
  id: string;
  title: string;
  price: number;
  type: 'Piso completo' | 'Habitación' | 'Estudio';
  location: string; // Las Palmas, San Fernando, Vecindario, etc.
  bedrooms: number;
  bathrooms: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  contactEmail: string;
  contactPhone: string;
}
