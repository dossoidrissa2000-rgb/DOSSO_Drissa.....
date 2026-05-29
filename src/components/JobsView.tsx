import React, { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, Calendar, Star, CheckCircle, Tag, Eye, ArrowRight, LogIn } from "lucide-react";
import { Job, UserProfile } from "../types";

interface JobsViewProps {
  jobs: Job[];
  user: UserProfile | null;
  onApply: (jobId: string) => Promise<boolean>;
  onSaveToggle: (jobId: string) => Promise<boolean>;
  onNavigateToLogin: () => void;
  isLoading: boolean;
}

export default function JobsView({
  jobs,
  user,
  onApply,
  onSaveToggle,
  onNavigateToLogin,
  isLoading,
}: JobsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobsLocally, setAppliedJobsLocally] = useState<string[]>([]);
  const [successApply, setSuccessApply] = useState(false);

  // Derive categories from database
  const categories = ["Todos", "Turismo y Hostelería", "Energías Renovables", "Limpieza", "Construcción", "Idiomas y Educación"];

  // Filter jobs based on search term and category
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert("Por favor, inicia sesión para poder postularte a las ofertas de empleo.");
      onNavigateToLogin();
      return;
    }

    const res = await onApply(jobId);
    if (res) {
      setAppliedJobsLocally((prev) => [...prev, jobId]);
      setSuccessApply(true);
      setTimeout(() => setSuccessApply(false), 4000);
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      alert("Por favor, inicia sesión para guardar tus ofertas favoritas.");
      onNavigateToLogin();
      return;
    }
    await onSaveToggle(jobId);
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center">
            <Briefcase className="w-8 h-8 text-sky-600 mr-2" />
            Ofertas de Empleo en Gran Canaria
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Encuentra y postula a vacantes verificadas en turismo, renovables, hostelería y construcción.
          </p>
        </div>
        
        {/* Status indicator */}
        {!user && (
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50 flex items-center space-x-2 text-xs">
            <LogIn className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Inicia sesión para postularte con tu CV generado de IA.</span>
          </div>
        )}
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              id="job-search-input"
              type="text"
              placeholder="Buscar por cargo, empresa o palabra clave (ej. bilingüe, solar, playa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/45 focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Filtrar:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.replace(/\s+/g, "-")}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DYNAMIC ALERT POP-UP */}
      {successApply && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex items-center space-x-3 shadow-md animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-sm">
            <strong>¡Postulación enviada correctamente!</strong> El empleador revisará tu perfil de CanariaConnect y tu currículum generado. Puedes ver el estado de tu solicitud en tu <strong>Panel de Control</strong>.
          </div>
        </div>
      )}

      {/* JOBS GRID & DETAILS VIEW */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-slate-800 border rounded-2xl h-44 p-6 space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 w-1/3 rounded"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 w-2/3 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 border rounded-2xl p-8 space-y-3">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">No se encontraron ofertas de empleo</h3>
          <p className="text-sm text-slate-400">Intenta cambiar las palabras clave de búsqueda o selecciona otra categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main List */}
          <div className={`lg:col-span-7 space-y-4 ${selectedJob ? "hidden lg:block animate-fade-in" : ""}`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              Resultados disponibles: {filteredJobs.length} empleos
            </p>
            
            {filteredJobs.map((job) => {
              const isApplied = user?.appliedJobIds.some((app) => app.jobId === job.id) || appliedJobsLocally.includes(job.id);
              const isSaved = user?.savedJobIds.includes(job.id);
              
              return (
                <div
                  key={job.id}
                  id={`job-item-${job.id}`}
                  className={`group relative bg-white dark:bg-slate-800 p-5 rounded-2xl border transition-all duration-200 ${
                    selectedJob?.id === job.id
                      ? "border-sky-500 shadow-md ring-1 ring-sky-500/20"
                      : "border-sky-100/50 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700 shadow-sm hover:shadow"
                  }`}
                >
                  <div className="absolute right-4 top-4 flex items-center space-x-2">
                    <button
                      id={`job-save-btn-${job.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(job.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      <Star className={`w-5 h-5 ${isSaved ? "fill-amber-400 text-amber-500" : ""}`} />
                    </button>
                  </div>

                  <div 
                    onClick={() => setSelectedJob(job)}
                    className="cursor-pointer space-y-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                          {job.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">{job.company}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-light">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 pt-2 border-t border-slate-50 dark:border-slate-700 text-xs text-slate-400">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                        <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center ml-auto">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>{job.publishedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons for ease of action */}
                  <div className="flex items-center justify-end space-x-2 pt-3 mt-3 border-t border-slate-50 dark:border-slate-700/60">
                    <button
                      id={`job-view-det-${job.id}`}
                      onClick={() => setSelectedJob(job)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Detalles</span>
                    </button>

                    <button
                      id={`job-apply-btn-${job.id}`}
                      onClick={() => handleApply(job.id)}
                      disabled={isApplied}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer ${
                        isApplied
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 cursor-not-allowed"
                          : "bg-sky-600 hover:bg-sky-700 text-white"
                      }`}
                    >
                      {isApplied ? "✓ Postulado" : "Solicitar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jobs Detail Box Right Column */}
          <div className={`lg:col-span-5 ${!selectedJob ? "hidden lg:block bg-sky-50/20 dark:bg-slate-800/10 border-2 border-dashed border-sky-100 dark:border-slate-800 rounded-3xl" : "lg:col-span-5"}`}>
            {selectedJob ? (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-sky-100 dark:border-slate-700 shadow-sm sticky top-24 space-y-6">
                
                {/* Back button for responsive layout */}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="lg:hidden text-xs text-sky-600 font-bold mb-4 flex items-center space-x-1"
                >
                  <span>← Atrás a la lista</span>
                </button>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      {selectedJob.type}
                    </span>
                    <button
                      id="job-detail-save-btn"
                      onClick={() => handleSave(selectedJob.id)}
                      className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${user?.savedJobIds.includes(selectedJob.id) ? "fill-amber-400 text-amber-500" : ""}`} />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                      {selectedJob.title}
                    </h2>
                    <p className="text-base font-semibold text-sky-600 dark:text-sky-400">{selectedJob.company}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {selectedJob.location}
                      </span>
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {selectedJob.salary}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Descripción del Puesto</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Requisitos Clave</h4>
                    <ul className="space-y-1.5">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start">
                          <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mr-2 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-sky-50/50 dark:bg-slate-900/60 p-4 rounded-xl space-y-2 border border-sky-100 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300">¿Cómo postularse?</p>
                    <p className="text-slate-500 dark:text-slate-400 font-light">
                      Al presionar el botón "Enviar Solicitud rápida", el sistema adjuntará de forma automatizada tu última versión de <strong>CV Creado con IA</strong> disponible y notificará a {selectedJob.company}.
                    </p>
                  </div>

                  <button
                    id="job-detail-apply-btn"
                    onClick={() => handleApply(selectedJob.id)}
                    disabled={user?.appliedJobIds.some((app) => app.jobId === selectedJob.id) || appliedJobsLocally.includes(selectedJob.id)}
                    className={`w-full py-3 rounded-xl font-bold shadow transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      user?.appliedJobIds.some((app) => app.jobId === selectedJob.id) || appliedJobsLocally.includes(selectedJob.id)
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:brightness-110"
                    }`}
                  >
                    <span>
                      {user?.appliedJobIds.some((app) => app.jobId === selectedJob.id) || appliedJobsLocally.includes(selectedJob.id)
                        ? "✓ Ya postulado"
                        : "Enviar Solicitud rápida"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 h-full text-center space-y-3 py-20 text-slate-400">
                <Briefcase className="w-12 h-12 text-slate-300" />
                <p className="font-bold">Selecciona una oferta</p>
                <p className="text-xs">Pulsa sobre cualquier tarjeta de la lista para ver todos los requisitos detallados, salarios, horarios y solicitar el empleo.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
