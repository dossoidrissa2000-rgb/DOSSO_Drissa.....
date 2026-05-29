import React, { useState } from "react";
import { User, Briefcase, Star, FileText, CheckCircle, MapPin, Phone, Mail, Edit3, Settings, Calendar, Save, Trash, Heading, Sparkles } from "lucide-react";
import { UserProfile, Job, CVProfile } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  jobs: Job[];
  onUpdateProfile: (profileData: any) => Promise<boolean>;
  onSaveToggle: (jobId: string) => Promise<boolean>;
  setCurrentTab: (tab: string) => void;
}

export default function DashboardView({
  user,
  jobs,
  onUpdateProfile,
  onSaveToggle,
  setCurrentTab,
}: DashboardViewProps) {
  const [activeDashboardTab, setActiveDashboardTab] = useState<"perfil" | "solicitudes" | "guardados" | "cvs">("solicitudes");

  // Local Form state
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);
  const [preferredCategory, setPreferredCategory] = useState(user.preferredCategory);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setFullName(user.fullName);
    setPhone(user.phone);
    setLocation(user.location);
    setBio(user.bio);
    setPreferredCategory(user.preferredCategory);
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onUpdateProfile({
      fullName,
      phone,
      location,
      bio,
      preferredCategory
    });
    if (res) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Resolve applied jobs with details
  const appliedJobsDetailed = user.appliedJobIds.map((app) => {
    const jobDetail = jobs.find((j) => j.id === app.jobId);
    return {
      ...app,
      job: jobDetail
    };
  }).filter((app) => app.job !== undefined);

  // Resolve saved jobs
  const savedJobsDetailed = jobs.filter((j) => user.savedJobIds.includes(j.id));

  const stats = [
    { label: "Solicitudes", count: user.appliedJobIds.length, icon: Briefcase, color: "text-sky-600 bg-sky-55 dark:bg-sky-950/40" },
    { label: "CVs de IA", count: user.cvHistory ? user.cvHistory.length : 0, icon: FileText, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
    { label: "Favoritos", count: user.savedJobIds.length, icon: Star, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40" }
  ];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER SECTION WITH BASIC USER AVATAR AND HERO */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4 relative">
          <div className="h-16 w-16 rounded-2xl bg-amber-500 font-extrabold text-2xl flex items-center justify-center shadow-md select-none">
            {user.fullName ? user.fullName.charAt(0) : "U"}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{user.fullName}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sky-100/80">
              <span className="flex items-center">📧 {user.email}</span>
              {user.phone && <span className="flex items-center">📞 {user.phone}</span>}
              <span className="flex items-center">🗺️ {user.location}</span>
            </div>
          </div>
        </div>

        {/* Dashboard quick shortcuts inside hero */}
        <div className="flex items-center space-x-3 relative">
          <button
            onClick={() => setCurrentTab("cv-generator")}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl font-bold text-xs select-none cursor-pointer text-white flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Crear Nuevo CV de IA</span>
          </button>
        </div>
      </div>

      {/* THREE STATS TILES COUNTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-sky-100/50 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{st.label}</span>
                <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">{st.count}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${st.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* DASHBOARD INTERNAL SUB-NAVIGATION TABS */}
      <div className="border-b border-sky-100 dark:border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDashboardTab("solicitudes")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeDashboardTab === "solicitudes"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-50"
          }`}
        >
          Mis Solicitudes ({appliedJobsDetailed.length})
        </button>

        <button
          onClick={() => setActiveDashboardTab("guardados")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeDashboardTab === "guardados"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-50"
          }`}
        >
          Empleos Favoritos ({savedJobsDetailed.length})
        </button>

        <button
          onClick={() => setActiveDashboardTab("cvs")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeDashboardTab === "cvs"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-50"
          }`}
        >
          Mis CVs de IA ({user.cvHistory ? user.cvHistory.length : 0})
        </button>

        <button
          onClick={() => setActiveDashboardTab("perfil")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeDashboardTab === "perfil"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-50"
          }`}
        >
          Editar Perfil
        </button>
      </div>

      {/* ACTIVE DASHBOARD TAB BODY */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-sky-100 dark:border-slate-850 p-6 shadow-sm min-h-[300px]">
        
        {/* SUBTAB 1: SOLICITUDES LIST (APPLICATIONS TIMELINE) */}
        {activeDashboardTab === "solicitudes" && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Estado de solicitudes enviadas</h3>
            {appliedJobsDetailed.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">No has enviado ninguna postulación todavía</p>
                <button
                  onClick={() => setCurrentTab("empleos")}
                  className="bg-sky-600 text-white font-bold py-1.5 px-4 rounded-lg text-xs"
                >
                  Ver ofertas abiertas
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedJobsDetailed.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-sky-100/50 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                          {app.job?.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Postulado el {app.appliedAt}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-850 dark:text-white">{app.job?.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold">{app.job?.company} • <span className="font-light">{app.job?.location}</span></p>
                    </div>

                    {/* Timeline dynamic status badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-sky-100 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 animate-pulse">
                          {app.status}
                        </span>
                        <p className="text-[9px] text-slate-400 mt-1">Siguiente: Entrevista telefónica</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: SAVED FAVOURITE JOBS */}
        {activeDashboardTab === "guardados" && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Lista de Empleos Guardados</h3>
            {savedJobsDetailed.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Star className="w-10 h-10 text-slate-200 mx-auto" />
                <p className="text-sm font-semibold">No tienes ningún empleo guardado</p>
                <p className="text-xs">Usa la estrella en las tarjetas de empleo para guardarlos aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobsDetailed.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-sky-50 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{job.category}</span>
                        <button
                          onClick={() => onSaveToggle(job.id)}
                          className="text-rose-500 hover:text-slate-400"
                        >
                          <Star className="w-4 h-4 fill-rose-550" />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{job.title}</h4>
                      <p className="text-xs text-sky-600">{job.company} · {job.location}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentTab("empleos");
                      }}
                      className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded font-semibold text-xs mt-4"
                    >
                      Ver todos los detalles
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: USER GENERATED CVS HIGHLIGHT LIST */}
        {activeDashboardTab === "cvs" && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Tus currículums profesionales de IA</h3>
            {!user.cvHistory || user.cvHistory.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-500 text-sm">Aún no has generado tu currículum canario con Inteligencia Artificial</p>
                <button
                  onClick={() => setCurrentTab("cv-generator")}
                  className="bg-amber-500 text-slate-900 font-bold py-1.5 px-4 rounded-lg text-xs"
                >
                  Generar mi CV ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.cvHistory.map((cv, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentTab("cv-generator");
                    }}
                    className="p-4 rounded-xl border border-sky-100 bg-white dark:bg-slate-900 hover:border-sky-500 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full select-none">IA Generativa</span>
                      <span className="text-[10px] text-slate-450">{cv.dateGenerated}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{cv.fullName}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic font-light leading-relaxed">
                        "{cv.professionalSummary}"
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t text-[10px] text-slate-400 font-semibold uppercase">
                      <span>{cv.skills.length} habilidades</span>
                      <span>·</span>
                      <span>{cv.languages.length} idiomas</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: EDIT ACCOUNT SETTINGS PROFILE */}
        {activeDashboardTab === "perfil" && (
          <form onSubmit={handleUpdate} className="space-y-6 text-xs max-w-xl">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Actualizar tu Información de Integración</h3>
            
            {saveSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-100 font-bold">
                ✓ ¡Perfil actualizado correctamente con tu base de datos CanariaConnect!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Teléfono móvil o WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Residencia / Municipio canario</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Sector Preferido de Empleo</label>
                <input
                  type="text"
                  value={preferredCategory}
                  onChange={(e) => setPreferredCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Sobre ti / Presentación biográfica</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Perfil</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
