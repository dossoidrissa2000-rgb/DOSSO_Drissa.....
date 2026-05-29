import React, { useState } from "react";
import { Briefcase, FileCode, GraduationCap, CheckSquare, Home as HomeIcon, MapPin, Users, HeartHandshake, ShieldCheck, ChevronRight, UserCheck } from "lucide-react";

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  user: any;
}

export default function HomeView({ setCurrentTab, user }: HomeViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const regionsData = [
    {
      id: "las-palmas",
      name: "Las Palmas de Gran Canaria",
      description: "La capital de la isla. Mayor núcleo urbano, abundantes oportunidades en comercio, hostelería, administración, puertos y enseñanza de idiomas.",
      tips: "Zona idónea para alquilar habitaciones compartidas y movilizarse en ‘Guaguas Municipales’ sin coche.",
      coords: { x: "78%", y: "15%" },
      jobsCount: 18,
      coursesCount: 5
    },
    {
      id: "telde",
      name: "Telde",
      description: "Importante nodo industrial, comercial y de energías limpias de la isla. Gran concentración de pymes e instalaciones solares fotovoltaicas.",
      tips: "Muy buena conectividad de autobuses directos (Global) hacia el Sur y la capital.",
      coords: { x: "82%", y: "35%" },
      jobsCount: 12,
      coursesCount: 3
    },
    {
      id: "vecindario",
      name: "Vecindario / Santa Lucía",
      description: "Región residencial y comercial vibrante con excelente costo de vida y alquileres muy competitivos para familias.",
      tips: "Centro estratégico para el comercio local y servicios de construcción/reformas de viviendas.",
      coords: { x: "70%", y: "55%" },
      jobsCount: 8,
      coursesCount: 4
    },
    {
      id: "sur",
      name: "Maspalomas / Sur de la Isla",
      description: "El epicentro turístico mundial. Demanda masiva y continua de recepcionistas bilingües, camareros, barman, socorristas y camareras de piso.",
      tips: "Imprescindible dominar Inglés y Alemán. Los salarios suelen incluir incentivos adicionales por idiomas.",
      coords: { x: "48%", y: "82%" },
      jobsCount: 24,
      coursesCount: 6
    }
  ];

  const coreServices = [
    {
      title: "Ofertas de Empleo Locales",
      desc: "Accede a ofertas de empleo depuradas en sectores clave como turismo, hostelería, renovables y construcción en toda Gran Canaria.",
      icon: Briefcase,
      tab: "empleos",
      color: "from-sky-500 to-sky-600"
    },
    {
      title: "Generador de CV con IA",
      desc: "Completa un formulario sencillo y nuestra tecnología de Inteligencia Artificial (Gemini) creará un CV profesional optimizado para la región.",
      icon: FileCode,
      tab: "cv-generator",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Planes de Formación",
      desc: "Encuentra cursos profesionales de cocina canaria, instalador solar, seguridad en construcción e idiomas (español de supervivencia).",
      icon: GraduationCap,
      tab: "formacion",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Asistencia Administrativa",
      desc: "Guías paso a paso detalladas para tramitar tu NIE, padrón municipal canario, contratos, salud pública y apoyo social voluntario.",
      icon: CheckSquare,
      tab: "ayuda-admin",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Buscador de Alojamiento",
      desc: "Encuentra habitaciones compartidas a precios razonables o estudios amueblados para asentarte cómodamente sin intermediarios abusivos.",
      icon: HomeIcon,
      tab: "alojamiento",
      color: "from-rose-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: "Mamadou Sow",
      origin: "Senegal",
      currentJob: "Instalador de Paneles Solares en Vecindario",
      text: "Llegué a la isla hace un año sin hablar casi español. Gracias a los cursos de CanariaConnect y al creador de currículums con IA pude postular a un puesto de auxiliar solar. ¡Hoy tengo un contrato indefinido!",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Elena Petrova",
      origin: "Ucrania",
      currentJob: "Recepcionista en Lopesan Resort",
      text: "No entendía cómo tramitar el NIE ni por dónde empezar a buscar alojamiento. Las guías administrativas de CanariaConnect me dieron el mapa exacto del proceso. Su plataforma de búsqueda de empleo es muy clara.",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Juan Carlos Mendoza",
      origin: "Venezuela",
      currentJob: "Camarero Profesional en Las Canteras",
      text: "El sistema de generación de CV redactó mis experiencias en Venezuela adaptándolas perfectamente a los términos que buscan las terrazas de Las Palmas de Gran Canaria. Me llamaron a los 2 días de enviar el CV.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const activeRegion = selectedRegion === "all" ? null : regionsData.find(r => r.id === selectedRegion);

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-sky-800 to-amber-950 text-white shadow-2xl px-6 py-12 sm:px-12 sm:py-20 lg:py-24">
        {/* Background decorative ocean wave circles */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-sky-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm text-sky-200">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Tu puerta de acceso e integración en Gran Canaria</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Construye tu Futuro en <br />
            <span className="bg-gradient-to-r from-sky-300 via-amber-300 to-amber-400 bg-clip-text text-transparent">
              Gran Canaria
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-sky-100/90 max-w-2xl mx-auto font-light">
            Impulsa tu integración social y profesional. Encuentra ofertas de empleo locales, viviendas compartidas de confianza, formación gratuita y redacta tu currículum optimizado mediante Inteligencia Artificial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-search-jobs"
              onClick={() => setCurrentTab("empleos")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/15 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Briefcase className="w-5 h-5" />
              <span>Buscar Empleo Local</span>
            </button>
            <button
              id="hero-create-cv"
              onClick={() => setCurrentTab("cv-generator")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <FileCode className="w-5 h-5 text-amber-400" />
              <span>Crear mi Currículum con IA</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Herramientas Todo en Uno para tu Éxito
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            CanariaConnect te apoya en cada pilar básico para acelerar tu acogida, dándote herramientas digitales prácticas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                id={`service-card-${index}`}
                onClick={() => setCurrentTab(service.tab)}
                className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-sky-50/50 dark:border-slate-800 hover:border-sky-100 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${service.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4 inline-flex items-center group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {service.title}
                  <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-light">
                  {service.desc}
                </p>
                <div className="absolute right-3 bottom-3 opacity-10 group-hover:opacity-25 transition-opacity">
                  <Icon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TACTILE INTERACTIVE MAP OF GRAN CANARIA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-sky-50/40 dark:bg-slate-800/20 p-6 sm:p-8 rounded-3xl border border-sky-100/50 dark:border-slate-800/40">
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="inline-flex bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
            Mapa Interactivo de Gran Canaria
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Explora las Regiones Clave de Empleo e Integración
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            La isla de Gran Canaria cuenta con distintos centros socioeconómicos. Pulsa sobre el mapa o los botones laterales para descubrir las mejores oportunidades de empleo habituales y consejos de vida.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRegion("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRegion === "all"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Ver Todo Gran Canaria
            </button>
            {regionsData.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedRegion === r.id
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {r.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Region details detail panel */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-sky-100 dark:border-slate-700 shadow-sm min-h-[170px] flex flex-col justify-center transition-all duration-300">
            {activeRegion ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center">
                    <MapPin className="w-5 h-5 text-amber-500 mr-1.5" />
                    {activeRegion.name}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-sky-700 dark:text-sky-400">
                    {activeRegion.jobsCount} ofertas
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {activeRegion.description}
                </p>
                <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-950 text-xs text-amber-800 dark:text-amber-300">
                  <strong>💡 Consejo de acogida:</strong> {activeRegion.tips}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">Selecciona una comarca en el mapa o lista</p>
                <p className="text-xs">Para ver el desglose económico de ofertas, accesos, transporte e idiomas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Graphic Mockup of Gran Canaria Map */}
        <div className="lg:col-span-12 xl:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[480px] aspect-square rounded-2xl bg-slate-900 overflow-hidden shadow-xl border-4 border-slate-800">
            {/* Abstract representation of the island ocean and contours */}
            <div className="absolute inset-0 bg-sky-950/60 flex items-center justify-center opacity-80 pointer-events-none">
              {/* Radial gradient representing a stylized outline map of Gran Canaria is roundish in shape */}
              <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-br from-emerald-800/40 via-amber-800/30 to-slate-800/40 border-8 border-slate-700/30 filter blur-[2px]"></div>
            </div>

            {/* In-map Labels and grids */}
            <div className="absolute top-4 left-4 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
              Océano Atlántico · Canarias
            </div>
            
            <div className="absolute right-4 bottom-4 flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/80 px-2 py-1.5 rounded border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Gran Canaria</span>
            </div>

            {/* Map point markers */}
            {regionsData.map((reg) => {
              const isActive = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  style={{ top: reg.coords.y, left: reg.coords.x }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 p-2 group focus:outline-none cursor-pointer`}
                >
                  <span className="relative flex h-4 w-4">
                    {isActive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white shadow shadow-black ${isActive ? "bg-amber-500 scale-125 shadow-amber-400" : "bg-sky-600 hover:bg-sky-500"}`}></span>
                  </span>
                  
                  {/* Floating tooltip label */}
                  <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap bg-slate-950 border border-slate-700 text-white pointer-events-none transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {reg.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. REASSURING PILLARS (TRUST & SOCIAL RESPONSIBILITY) */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-slate-800/30 dark:to-slate-900/30 p-8 rounded-3xl border border-amber-100/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto sm:mx-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Inclusión Directa</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
              Nuestra plataforma está traducida a un lenguaje claro y sencillo para apoyar a personas de todos los orígenes en sus primeros pasos en Gran Canaria.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Garantía Exclusiva</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
              Filtramos de forma proactiva contratos basura o fraudes de alojamiento para asegurar que cada recurso que utilices sea de extrema confianza local.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center mx-auto sm:mx-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Alianzas Sociales</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
              Colaboramos activamente con sindicatos locales, fundaciones, la Delegación del Gobierno y redes voluntarias canarias para un acompañamiento veraz.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES (TESTIMONIALS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Historias Reales de CanariaConnect
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Conoce a algunos de nuestros miembros que han logrado integrarse con éxito en la vida laboral canaria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-sky-50 dark:border-slate-800 shadow-sm hover:shadow relative flex flex-col justify-between"
            >
              <p className="text-sm text-slate-600 dark:text-slate-300 italic font-light leading-relaxed">
                "{test.text}"
              </p>
              <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <img
                  src={test.img}
                  alt={test.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{test.name}</h4>
                  <p className="text-[11px] text-slate-400">Orig. de {test.origin} • <span className="text-emerald-500 font-medium">{test.currentJob}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR SIGNUP */}
      {!user && (
        <section className="bg-gradient-to-r from-sky-600 to-sky-700 text-white text-center p-8 sm:p-12 rounded-3xl space-y-4 shadow-lg shadow-sky-600/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">¿Listo para comenzar tu integración canaria?</h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl mx-auto font-light">
            Crea una cuenta gratuita para guardar ofertas de empleo que más te interesen, postularte directamente y guardar tu historial de currículums de Inteligencia Artificial de forma ilimitada.
          </p>
          <button
            id="home-register-cta"
            onClick={() => setCurrentTab("login")}
            className="inline-flex bg-amber-500 text-slate-900 font-extrabold px-6 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-md cursor-pointer text-sm"
          >
            Registrarme Gratis / Iniciar Sesión
          </button>
        </section>
      )}

    </div>
  );
}
