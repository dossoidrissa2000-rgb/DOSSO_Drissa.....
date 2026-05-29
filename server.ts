import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Job, Course, UserProfile, CVProfile, AdminTopic, HousingItem } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client (Lazy initialized when needed, or checked at startup)
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && apiKey) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini AI client successfully initialized server-side.");
    } catch (e) {
      console.error("Error initializing Gemini AI client:", e);
    }
  }
  return aiClient;
}

// Global In-Memory Database State (for authentications, applications, saved, custom CVs)
const jobsDatabase: Job[] = [
  {
    id: "job-1",
    title: "Recepcionista de Hotel Bilingüe",
    company: "Lopesan Costa Meloneras Resort",
    location: "Maspalomas, Gran Canaria",
    salary: "1.600€ - 1.900€ / mes",
    type: "Jornada Completa",
    description: "Buscamos un recepcionista dinámico y bilingüe (Español, Inglés y Alemán valorable) para unirse a nuestro resort de 5 estrellas en el sur de Gran Canaria. Te encargarás de la bienvenida, check-in, check-out y asistencia personalizada al huésped.",
    category: "Turismo y Hostelería",
    publishedAt: "Hace 1 día",
    requirements: [
      "Experiencia mínima de 1 año en recepción de hoteles.",
      "Nivel fluido de Inglés (C1) y Español (un tercer idioma como Alemán es altamente valorado).",
      "Habilidades excepcionales de comunicación y resolución de incidencias.",
      "Conocimiento de software hotelero (Sihot, Opera o similares)."
    ]
  },
  {
    id: "job-2",
    title: "Instalador de Paneles Solares Fotovoltaicos",
    company: "Canarias Renovables S.L.",
    location: "Telde, Gran Canaria",
    salary: "1.800€ - 2.200€ / mes",
    type: "Jornada Completa",
    description: "Únete a nuestro gran equipo de energías limpias. Con el auge de la energía solar en el archipiélago, estamos expandiendo nuestras cuadrillas para instalaciones residenciales e industriales en Gran Canaria.",
    category: "Energías Renovables",
    publishedAt: "Hace 2 días",
    requirements: [
      "Formación en electricidad o similar (FP básica o certificación).",
      "Imprescindible curso de PRL de trabajos en altura.",
      "Carnet de conducir B para traslado con furgoneta corporativa.",
      "Capacidad física para trabajos de montaje bajo el sol canario."
    ]
  },
  {
    id: "job-3",
    title: "Camarero / Barman de Terraza Moderna",
    company: "Oasis Sunset Boulevard",
    location: "Las Palmas de Gran Canaria",
    salary: "1.400€ - 1.650€ / mes + propinas",
    type: "Jornada Completa / Turno Rotativo",
    description: "Buscamos personal de sala y barra para nuestra terraza de moda frente a la playa de Las Canteras. Buscamos actitud positiva, simpatía y agilidad en el servicio.",
    category: "Turismo y Hostelería",
    publishedAt: "Hace 3 días",
    requirements: [
      "Conocimiento básico de cocktelería general.",
      "Idiomas: Español e Inglés conversacional fluido.",
      "Excelente trato de cara al público y dinamismo.",
      "Disponibilidad de incorporación inmediata."
    ]
  },
  {
    id: "job-4",
    title: "Personal de Limpieza de Apartamentos Vacacionales",
    company: "Smart rentals Gran Canaria",
    location: "Playa del Inglés, Gran Canaria",
    salary: "1.100€ - 1.300€ / mes",
    type: "Media Jornada / Jornada Flexible",
    description: "Establecimiento con más de 80 villas y apartamentos precisa personal responsable y detallista para realizar limpiezas de entrada y salida, asegurando el máximo estándar Canarias de hospitalidad.",
    category: "Limpieza",
    publishedAt: "Hace 4 días",
    requirements: [
      "Experiencia previa en limpieza hotelera o apartamentos turísticos.",
      "Vehículo propio para desplazarse entre complejos (se paga kilometraje).",
      "Seriedad, puntualidad y alta atención al detalle.",
      "Certificado de antecedentes penales en vigor."
    ]
  },
  {
    id: "job-5",
    title: "Oficial de Segunda / Albañilería de Reformas",
    company: "Construcciones y Reformas Tirajana",
    location: "Vecindario, Gran Canaria",
    salary: "1.700€ - 2.050€ / mes",
    type: "Jornada Completa",
    description: "Empresa con sólida trayectoria en reformas de viviendas de lujo en Gran Canaria busca oficial de albañilería para instalación de alicatados, tabiquería de pladur, yeso y enfoscados.",
    category: "Construcción",
    publishedAt: "Hace 5 días",
    requirements: [
      "Experiencia demostrable de al menos 3 años en albañilería general.",
      "Curso básico de PRL de la Construcción (20h).",
      "Seriedad y capacidad de trabajar bajo mínimas instrucciones.",
      "Se valorará positivamente poseer carnet B de conducir."
    ]
  },
  {
    id: "job-6",
    title: "Asistente Educativo de Lenguas",
    company: "English School Las Palmas",
    location: "Las Palmas de Gran Canaria",
    salary: "1.200€ - 1.450€ / mes",
    type: "Media Jornada",
    description: "Apoyo en clases extraescolares de inglés para niños de primaria y secundaria. Metodología basada en el juego y la inmersión activa.",
    category: "Idiomas y Educación",
    publishedAt: "Hace 1 semana",
    requirements: [
      "Nivel nativo o equivalente de Inglés.",
      "Deseable conocimientos de Español (A2 o Superior) para interactuar con padres de familia.",
      "Habilidades pedagógicas, dinamismo y empatía.",
      "Certificado negativo de delitos de naturaleza sexual exigido por ley."
    ]
  }
];

const coursesDatabase: Course[] = [
  {
    id: "course-1",
    title: "Iniciación Profesional a la Cocina Canaria e Internacional",
    provider: "Escuela de Hostelería de Las Palmas",
    hours: 120,
    level: "Principiante",
    category: "cocina",
    description: "Aprende los fundamentos de la cocina tradicional canaria (mojos, papas arrugadas, sancochos, gofio machacado) y técnicas de cocina clásica internacional para entrar rápidamente a trabajar en el sector hotelero.",
    modality: "Presencial"
  },
  {
    id: "course-2",
    title: "Técnico Solar: Instalador de Sistemas Fotovoltaicos",
    provider: "Instituto Canario de Energía Renovable",
    hours: 180,
    level: "Intermedio",
    category: "energia-solar",
    description: "Formación de alta empleabilidad en Canarias. Aprende a calcular, montar, conectar y certificar instalaciones de autoconsumo solar fotovoltaico para viviendas y naves industriales en Gran Canaria.",
    modality: "Híbrido (Teoría online + Prácticas en Telde)"
  },
  {
    id: "course-3",
    title: "Español Intensivo de Supervivencia e Integración (A1-A2)",
    provider: "CanariaConnect Academy",
    hours: 80,
    level: "Principiante",
    category: "espanol",
    description: "Diseñado especialmente para inmigrantes recién llegados. Aprende el vocabulario esencial para hacer trámites administrativos, buscar trabajo, ir al supermercado, alquilar viviendas y entablar tus primeras conversaciones locales.",
    modality: "Online & Presencial"
  },
  {
    id: "course-4",
    title: "Limpieza Profesional e Higienización del Sector Turístico",
    provider: "Formación Activa Canarias",
    hours: 45,
    level: "Principiante",
    category: "limpieza",
    description: "Curso oficial imprescindible para camareras de piso y operarios de limpieza en resorts hoteleros y viviendas vacacionales. Incluye manejo seguro de productos de desinfección y protocolos de calidad COVID-safe.",
    modality: "Presencial (Maspalomas)"
  },
  {
    id: "course-5",
    title: "Introducción Práctica a la Inteligencia Artificial en el Trabajo Diario",
    provider: "Fundación Canaria de Tecnología",
    hours: 30,
    level: "Principiante",
    category: "ia",
    description: "Aprende a usar herramientas populares de IA (Gemini, ChatGPT) para redactar correos profesionales, crear resúmenes, traducir documentos, preparar entrevistas de trabajo y optimizar tu productividad cotidiana.",
    modality: "Online de autoaprendizaje"
  },
  {
    id: "course-6",
    title: "Seguridad y PRL Básica en la Construcción",
    provider: "Federación Canaria de Empresarios de Construcción",
    hours: 20,
    level: "Principiante",
    category: "construccion",
    description: "Curso obligatorio homologado por el Convenio de la Construcción para poder ingresar a trabajar en obras y reformas en toda España. Formación teórica enfocada en la detección y prevención de riesgos en el tajo.",
    modality: "Presencial (Vecindario)"
  }
];

const adminTopicsDatabase: AdminTopic[] = [
  {
    id: "topic-1",
    title: "Cómo Obtener el NIE (Número de Identificación de Extranjero)",
    category: "nie",
    icon: "FileText",
    summary: "El NIE es el identificador básico que te permite firmar contratos de trabajo, alquilar viviendas legalmente, abrir cuentas bancarias canarias y pagar impuestos en el archipiélago.",
    steps: [
      "Solicita cita previa online en la sede de la Delegación del Gobierno o Comisaría de Policía Nacional (elegir Gran Canaria en la lista de provincias).",
      "Prepara el Formulario Modelo EX-15 completado a ordenador de manera legible.",
      "Consigue una fotocopia completa del pasaporte o cédula nacional de identidad del país de origen.",
      "Justifica debidamente el motivo de la petición (por ejemplo, con una promesa/precontrato de trabajo, matrícula en escuela de idiomas oficial, o fianza para compraventa).",
      "Paga la tasa Modelo 790 Código 012 en cualquier banco local antes de acudir a la cita presencial (aproximadamente 9,84€)."
    ],
    usefulLinks: [
      { label: "Solicitud de Cita Previa Oficial", url: "https://icp.administracionelectronica.gob.es/icpplus/index.html" },
      { label: "Descargar Formulario EX-15", url: "https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/extranjeria/ciudadanos-extranjeros/numero-de-identidad-de-extranjero-nie/#modelosEX" }
    ]
  },
  {
    id: "topic-2",
    title: "Cómo Solicitar el Empadronamiento en Canarias",
    category: "residencia",
    icon: "Home",
    summary: "Registrar tu domicilio en un ayuntamiento canario (como Las Palmas de G.C. o San Bartolomé de Tirajana) te da acceso a la asistencia médica pública, escolarización de hijos y el Descuento de Residente Canario (75% en transporte aéreo/marítimo nacional).",
    steps: [
      "Reúne el contrato de alquiler firmado, o la última factura de luz/gas/agua a tu nombre, o la autorización escrita del arrendador principal autorizando tu registro en la vivienda.",
      "Descarga y cumplimenta la 'Hoja de Inscripción Padronal' del ayuntamiento canario correspondiente a tu residencia.",
      "Aporta original y copia de tu Pasaporte en vigor, NIE o DNI español.",
      "Solicita cita presencial de empadronamiento llamando al 010 (teléfono del ayuntamiento local) o a través de sus oficinas virtuales.",
      "Acude puntualmente y obtén al momento tu certificado histórico de empadronamiento."
    ],
    usefulLinks: [
      { label: "Empadronamiento - Ayuntamiento de Las Palmas", url: "https://www.laspalmasgc.es/" },
      { label: "Información Sobre el Descuento de Residente Canario", url: "https://www.gobiernodecanarias.org/transportes/" }
    ]
  },
  {
    id: "topic-3",
    title: "Comprensión del Contrato de Trabajo e Indefinido",
    category: "contrato",
    icon: "ShieldAlert",
    summary: "Con la reforma laboral en España, la mayoría de los contratos en la hostelería y construcción canaria ahora deben ser fijos discontinuos o indefinidos. Infórmate sobre tus derechos mínimos.",
    steps: [
      "El contrato debe indicar expresamente el convenio colectivo aplicado (ej. Convenio de Hostelería de Las Palmas o Convenio de Construcción).",
      "La jornada ordinaria ordinaria no puede exceder las 40 horas semanales calculadas en cómputo anual.",
      "Dispones por ley de un período mínimo de 30 días naturales de vacaciones pagadas anuales.",
      "La cotización a la Seguridad Social debe comenzar desde el primer minuto en que comiences tus funciones (incluyendo los periodos de prueba pactados)."
    ],
    usefulLinks: [
      { label: "Guía Laboral Oficial de España", url: "https://www.mites.gob.es/es/guia/texto/index.htm" },
      { label: "Consultorio del Sindicato de Trabajadores Canarios", url: "https://www.gobiernodecanarias.org/empleo/" }
    ]
  },
  {
    id: "topic-4",
    title: "Asistencia Social, Refugio e Integración Local",
    category: "asistencia",
    icon: "Users",
    summary: "Servicios municipales y organizaciones sin fines de lucro en la isla que ofrecen comida, clases de idiomas gratuitas, asesoramiento legal de asilo y ayudas económicas de emergencia.",
    steps: [
      "Visita las oficinas del Centro Municipal de Servicios Sociales más cercano a tu residencia habitual (se asigna por código postal).",
      "Solicita información sobre la PCI (Prestación Canaria de Inserción) o el Ingreso Mínimo Vital nacional.",
      "Contacta con Cruz Roja Las Palmas o con CEAR Canarias (Comisión Española de Ayuda al Refugiado) si te encuentras en situación de vulnerabilidad extrema o asilo.",
      "Participa en los cursos de acogida cultural y de idioma español de CEAR o Cáritas Diocesana de Canarias."
    ],
    usefulLinks: [
      { label: "Cruz Roja Española - Sede Las Palmas", url: "https://www.cruzroja.es" },
      { label: "CEAR - delegación Canarias", url: "https://www.cear.es" }
    ]
  }
];

const housingDatabase: HousingItem[] = [
  {
    id: "house-1",
    title: "Habitación Luminosa en Piso Compartido",
    price: 320,
    type: "Habitación",
    location: "Las Palmas (Zoco / Mesa y López), Gran Canaria",
    bedrooms: 4,
    bathrooms: 2,
    description: "Se alquila habitación exterior completamente amueblada en un piso espacioso y luminoso de 4 dormitorios. Convivencia muy tranquila de estudiantes e hispanohablantes. Gastos incluidos de Agua, Luz e Internet rápido.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    contactEmail: "mesaylopezflat@canariaconnect.locals",
    contactPhone: "+34 654 223 111"
  },
  {
    id: "house-2",
    title: "Estudio Económico Cerca de la Playa",
    price: 650,
    type: "Estudio",
    location: "Las Canteras, Las Palmas de Gran Canaria",
    bedrooms: 1,
    bathrooms: 1,
    description: "Estudio acogedor e independiente a 100 metros de la magnífica playa de Las Canteras. Equipado con cocina americana, cama de matrimonio y un pequeño balcón exterior. Perfecto para parejas o trabajadores remotos recién llegados.",
    imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    contactEmail: "canterasestudios@canariaconnect.locals",
    contactPhone: "+34 670 998 001"
  },
  {
    id: "house-3",
    title: "Piso de 2 Dormitorios para Familias",
    price: 750,
    type: "Piso completo",
    location: "Vecindario / San Pedro, Gran Canaria",
    bedrooms: 2,
    bathrooms: 1,
    description: "Estupendo piso de 2 dormitorios en planta baja, sin amueblar ideal para larga estancia familiar. Zona muy bien comunicada con paradas de Global (bus), supermercados Mercadona/Hiperdino a la vuelta y colegios públicos.",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    contactEmail: "constanzaviv@canariaconnect.locals",
    contactPhone: "+34 611 234 567"
  }
];

// Seeded user profiles database (Acts as a Supabase backend emulation for active state)
let currentUserSession: UserProfile | null = {
  id: "user-default-1",
  email: "migrante.canario@gmail.com",
  fullName: "Idrissa Dosso",
  phone: "+34 600 123 456",
  location: "Las Palmas, Gran Canaria",
  bio: "Soy recién llegado de Senegal. Deseo capacitarme profesionalmente en energías renovables y aprender español de nivel intermedio para trabajar integrándome al tejido de la isla.",
  preferredCategory: "Energías Renovables",
  savedJobIds: ["job-2"],
  appliedJobIds: [
    { jobId: "job-1", appliedAt: "2026-05-25", status: "En revisión" }
  ],
  cvHistory: [
    {
      id: "cv-old-1",
      fullName: "Idrissa Dosso",
      email: "migrante.canario@gmail.com",
      phone: "+34 600 123 456",
      address: "Calle Dr. Juan de Padilla, 12, Las Palmas de Gran Canaria",
      professionalSummary: "Trabajador con experiencia motivado por el sector de la hostelería y los paneles fotovoltaicos.",
      experience: [
        { position: "Logística y Almacén", company: "Puerto de Dakar", duration: "2022 - 2024", description: "Carga, descarga e inventario de material pesado." }
      ],
      education: [
        { degree: "Bachillerato Técnico", institution: "Lycée de Dakar", year: "2021" }
      ],
      skills: ["Trabajo en Equipo", "Gestión de Inventario", "Esfuerzo Físico y Alturas"],
      languages: ["Francés (Nativo)", "Wólof (Nativo)", "Español (Básico)"],
      dateGenerated: "2026-05-27"
    }
  ]
};

// --- AUTH & PROFILE API ENDPOINTS ---
app.get("/api/auth/session", (req, res) => {
  res.json({ user: currentUserSession });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email) {
    return res.status(400).json({ error: "El email es requerido" });
  }
  
  // Set user session dynamics
  currentUserSession = {
    id: `user-${Date.now()}`,
    email: email,
    fullName: fullName || email.split("@")[0],
    phone: "+34 600 000 000",
    location: "Gran Canaria",
    bio: "¡Hola! Estoy muy emocionado de empezar mi aventura en Gran Canaria.",
    preferredCategory: "General",
    savedJobIds: [],
    appliedJobIds: [],
    cvHistory: []
  };
  
  res.json({ user: currentUserSession, success: true });
});

app.post("/api/auth/signup", (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Email y Nombre Completo son obligatorios" });
  }

  currentUserSession = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    phone: "",
    location: "Gran Canaria",
    bio: "Residente canario buscando integrarse al mercado laboral local.",
    preferredCategory: "General",
    savedJobIds: [],
    appliedJobIds: [],
    cvHistory: []
  };

  res.json({ user: currentUserSession, success: true });
});

app.post("/api/auth/logout", (req, res) => {
  currentUserSession = null;
  res.json({ success: true });
});

app.post("/api/profile/update", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "No autorizado" });
  }
  
  const { fullName, phone, location, bio, preferredCategory } = req.body;
  
  currentUserSession = {
    ...currentUserSession,
    fullName: fullName || currentUserSession.fullName,
    phone: phone || currentUserSession.phone,
    location: location || currentUserSession.location,
    bio: bio || currentUserSession.bio,
    preferredCategory: preferredCategory || currentUserSession.preferredCategory
  };
  
  res.json({ user: currentUserSession, success: true });
});


// --- DATA DIRECTORY API ENDPOINTS ---
app.get("/api/jobs", (req, res) => {
  res.json(jobsDatabase);
});

app.post("/api/jobs/apply", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "Debes iniciar sesión para postularte a un empleo" });
  }
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: "ID del empleo es obligatorio" });
  }
  
  // Check if already applied
  const alreadyApplied = currentUserSession.appliedJobIds.some(app => app.jobId === jobId);
  if (!alreadyApplied) {
    currentUserSession.appliedJobIds.push({
      jobId,
      appliedAt: new Date().toISOString().split("T")[0],
      status: "Enviada"
    });
  }
  
  res.json({ user: currentUserSession, success: true });
});

app.post("/api/jobs/save", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "Debes iniciar sesión para guardar empleos" });
  }
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: "ID del empleo es obligatorio" });
  }
  
  const savedIdx = currentUserSession.savedJobIds.indexOf(jobId);
  if (savedIdx > -1) {
    currentUserSession.savedJobIds.splice(savedIdx, 1); // Unsqueezed
  } else {
    currentUserSession.savedJobIds.push(jobId);
  }
  
  res.json({ user: currentUserSession, success: true, saved: savedIdx === -1 });
});

app.get("/api/courses", (req, res) => {
  res.json(coursesDatabase);
});

app.get("/api/admin-topics", (req, res) => {
  res.json(adminTopicsDatabase);
});

app.get("/api/housing", (req, res) => {
  res.json(housingDatabase);
});


// --- AI POWERED AUTOMATIC CV GENERATION API (GEMINI SDK ROOT INTEGRATION) ---
app.post("/api/cv/generate", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    address,
    currentProfession,
    experienceInfo,
    educationInfo,
    skillsList,
    languages,
  } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: "El nombre y el correo electrónico son campos básicos requeridos." });
  }

  // Create prompt to build a beautiful structured CV
  const systemPrompt = `Eres un seleccionador y especialista en empleabilidad en las Islas Canarias (España).
Tu tarea es tomar los detalles brutos que te proporciona un residente o migrante en Gran Canaria, y construir un currículum vitae (CV) sumamente profesional, optimizado y con un lenguaje adecuado para empresas locales.
Debes devolver obligatoriamente un formato JSON válido que siga exactamente el siguiente esquema. No agregues formatos de markdown como \`\`\`json ni texto introductorio, solo devuelve puro JSON estructurado.

Esquema JSON a devolver:
{
  "fullName": "Nombre completo formateado",
  "email": "correo@ejemplo.com",
  "phone": "+34...",
  "address": "Dirección en Gran Canaria",
  "professionalSummary": "Un breve párrafo de 3-4 líneas emocionante, redactado en primera o tercera persona profesional. Debe resaltar sus fortalezas y motivación de integrarse formalmente al mercado canario.",
  "experience": [
    {
      "position": "Cargo profesional mejorado y formalizado",
      "company": "Nombre de la empresa u organización descriptiva",
      "duration": "Años o meses de duración",
      "description": "Una o dos oraciones profesionales redactando los logros y tareas principales de forma concisa empleando verbos de acción en español."
    }
  ],
  "education": [
    {
      "degree": "Título del grado estudiado o curso homologado formal",
      "institution": "Centro de formación",
      "year": "Año o periodo"
    }
  ],
  "skills": ["Habilidad 1", "Habilidad 2", "Habilidad 3", "Habilidad 4"],
  "languages": ["Idioma 1 (Nivel)", "Idioma 2 (Nivel)"]
}`;

  const userQuery = `Aquí tienes los datos del usuario:
Nombre: ${fullName}
Email: ${email}
Teléfono: ${phone || 'No especificado'}
Dirección: ${address || 'Gran Canaria, España'}
Profesión o perfil inicial: ${currentProfession || 'No especificado'}
Experiencias de trabajo previas (bruto): ${experienceInfo || 'Sin experiencia formal previa, buscando primera oportunidad.'}
Educación o estudios completados (bruto): ${educationInfo || 'Educación básica / autodidacta.'}
Habilidades y destrezas (bruto): ${skillsList || 'Trabajo duro, puntualidad, aprendizaje rápido.'}
Idiomas que habla: ${languages || 'Español básico'}`;

  const client = getGeminiClient();

  if (client) {
    try {
      console.log("Calling server-side Gemini 3.5-flash for CV Generation...");
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${systemPrompt}\n\n${userQuery}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8
        }
      });

      const text = response.text || "{}";
      const cleanedText = text.trim();
      let parseResult;
      
      try {
        parseResult = JSON.parse(cleanedText);
      } catch (e) {
        // Safe regex extraction as fallback
        const match = cleanedText.match(/\{[\s\S]*\}/);
        if (match) {
          parseResult = JSON.parse(match[0]);
        } else {
          throw new Error("Invalid output format from Gemini");
        }
      }

      // Prepend id and dates
      const finalizedCv: CVProfile = {
        id: `cv-${Date.now()}`,
        ...parseResult,
        dateGenerated: new Date().toISOString().split("T")[0]
      };

      // Store in current user session if logged in
      if (currentUserSession) {
        currentUserSession.cvHistory = currentUserSession.cvHistory || [];
        currentUserSession.cvHistory.unshift(finalizedCv);
      }

      return res.json({ cv: finalizedCv, success: true });

    } catch (e: any) {
      console.error("Gemini failed, applying high-fidelity heuristic generator: ", e);
      // Heuristic fallback so it operates nicely and looks beautiful even if API is out or missing key!
      const fallbackCV = makeHeuristicCV(req.body);
      
      if (currentUserSession) {
        currentUserSession.cvHistory = currentUserSession.cvHistory || [];
        currentUserSession.cvHistory.unshift(fallbackCV);
      }
      return res.json({ cv: fallbackCV, success: true, fallback: true });
    }
  } else {
    // No Gemini API Key defined, generate high-quality structural CV
    console.log("No Gemini API key supplied, producing high-fidelity heuristic fallback CV.");
    const fallbackCV = makeHeuristicCV(req.body);
    
    if (currentUserSession) {
      currentUserSession.cvHistory = currentUserSession.cvHistory || [];
      currentUserSession.cvHistory.unshift(fallbackCV);
    }
    return res.json({ cv: fallbackCV, success: true, fallback: true });
  }
});

function makeHeuristicCV(data: any): CVProfile {
  const { fullName, email, phone, address, currentProfession, experienceInfo, educationInfo, skillsList, languages } = data;

  const skillsArr = skillsList ? skillsList.split(",").map((s: string) => s.trim()) : ["Atención al Cliente", "Trabajo en Equipo", "Adaptabilidad Física", "Puntualidad e Integridad"];
  const langArr = languages ? languages.split(",").map((l: string) => l.trim()) : ["Español (A2 - Inicial)", "Francés (Nativo/B2)"];

  return {
    id: `cv-${Date.now()}`,
    fullName: fullName || "Invitado CanariaConnect",
    email: email || "usuario@canariaconnect.com",
    phone: phone || "+34 600 000 000",
    address: address || "Gran Canaria, España",
    professionalSummary: `Profesional comprometido y motivado, centrado en insertarse en el sector laboral canario de la categoría ${currentProfession || "Servicios Generales"}. Destaca por su alta adaptabilidad, actitud respetuosa, puntualidad extrema y motivación para cursar formaciones adicionales. Listo para integrarse de inmediato en su región en constante desarrollo.`,
    experience: [
      {
        position: currentProfession || "Auxiliar de Servicios Especializados",
        company: "Sector Servicios (Experiencia Previa)",
        duration: "2023 - Presente",
        description: experienceInfo || "Desempeñando diversas tareas operativas con alta atención al cliente y rigurosidad. Llevando a cabo la gestión del tiempo y cooperación excelente en cuadrillas de trabajo."
      }
    ],
    education: [
      {
        degree: "Estudios Básicos y Formación para el Empleo",
        institution: educationInfo || "Centro de Acogida y Capacitación Canaria",
        year: "2025"
      }
    ],
    skills: skillsArr.slice(0, 5),
    languages: langArr,
    dateGenerated: new Date().toISOString().split("T")[0]
  };
}


// --- SPA ROUTING & DEVELOPMENT BINDING SERVICES ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
  } else {
    // In production, serve absolute path files from /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CanariaConnect Full Stack App is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
