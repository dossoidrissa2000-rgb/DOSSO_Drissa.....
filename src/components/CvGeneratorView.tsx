import React, { useState } from "react";
import { FileCode, Loader2, RefreshCw, Send, CheckCircle, Download, FileText, UserPlus, ArrowLeft, History, Eye, Trash } from "lucide-react";
import { CVProfile, UserProfile } from "../types";

interface CvGeneratorViewProps {
  user: UserProfile | null;
  onGenerateCV: (cvData: any) => Promise<CVProfile | null>;
  onNavigateToLogin: () => void;
  cvHistory: CVProfile[];
  onDeleteCV: (cvId: string) => Promise<boolean>;
}

export default function CvGeneratorView({
  user,
  onGenerateCV,
  onNavigateToLogin,
  cvHistory,
  onDeleteCV,
}: CvGeneratorViewProps) {
  // Input fields state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.location || "Las Palmas de Gran Canaria, España");
  const [currentProfession, setCurrentProfession] = useState(user?.preferredCategory || "Hostelería / Auxiliar General");
  const [experienceInfo, setExperienceInfo] = useState("");
  const [educationInfo, setEducationInfo] = useState("");
  const [skillsList, setSkillsList] = useState("");
  const [languages, setLanguages] = useState("Español (Inicial), Inglés (Intermedio)");

  // Active view states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMilestone, setLoadingMilestone] = useState("");
  const [generatedCV, setGeneratedCV] = useState<CVProfile | null>(null);
  const [cvCollection, setCvCollection] = useState<CVProfile[]>(cvHistory);
  const [selectedCVFromHistory, setSelectedCVFromHistory] = useState<CVProfile | null>(null);

  // Sync state if historical CV changes
  React.useEffect(() => {
    setCvCollection(cvHistory);
    if (cvHistory.length > 0 && !generatedCV && !selectedCVFromHistory) {
      setSelectedCVFromHistory(cvHistory[0]);
    }
  }, [cvHistory]);

  const milestones = [
    "Leyendo tus datos brutos...",
    "Reescribiendo experiencias con verbos de acción oficiales...",
    "Adaptando habilidades al vocabulario empresarial de Gran Canaria...",
    "Estructurando secciones estandarizadas de la Unión Europea...",
    "Terminando de maquetar el diseño moderno del CV..."
  ];

  const triggerMilestoneSequence = () => {
    let index = 0;
    setLoadingMilestone(milestones[0]);
    const interval = setInterval(() => {
      index++;
      if (index < milestones.length) {
        setLoadingMilestone(milestones[index]);
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Por favor completa el Nombre completo y Correo Electrónico.");
      return;
    }

    setIsGenerating(true);
    const interval = triggerMilestoneSequence();

    const cvData = {
      fullName,
      email,
      phone,
      address,
      currentProfession,
      experienceInfo,
      educationInfo,
      skillsList,
      languages,
    };

    try {
      const cv = await onGenerateCV(cvData);
      clearInterval(interval);
      if (cv) {
        setGeneratedCV(cv);
        setSelectedCVFromHistory(cv);
      }
    } catch (err) {
      clearInterval(interval);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (e: React.MouseEvent, cvId: string) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de que deseas eliminar este currículum de tu historial?")) {
      const res = await onDeleteCV(cvId);
      if (res) {
        if (selectedCVFromHistory?.id === cvId) {
          setSelectedCVFromHistory(cvHistory.filter(c => c.id !== cvId)[0] || null);
        }
        if (generatedCV?.id === cvId) {
          setGeneratedCV(null);
        }
      }
    }
  };

  const activeCV = selectedCVFromHistory || generatedCV;

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER COLOFON */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center">
            <FileCode className="w-8 h-8 text-sky-600 mr-2" />
            Creador de Currículum con IA
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Redacta en minutos un CV profesional y optimizado para el mercado de Canaria con Inteligencia Artificial.
          </p>
        </div>
      </div>

      {/* IS GENERATING LOADER OR FULL CV BUILDER LAYOUT */}
      {isGenerating ? (
        <div className="bg-white dark:bg-slate-800 border rounded-2xl p-10 text-center space-y-6 max-w-lg mx-auto shadow-lg py-16 animate-pulse">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Generando Currículum con IA</h3>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-mono tracking-widest uppercase">{loadingMilestone}</p>
          </div>
          <p className="text-xs text-slate-400">
            Analizamos tu perfil enfocándonos en las habilidades de alta rotación más buscadas actualmente en el archipiélago. No cierres esta ventana.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: QUESTIONNAIRE FORM OR CV COLLECTION LIST */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Logged user tip */}
            {!user && (
              <div className="bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-3">
                <p><strong>💡 ¿Sabías qué?</strong> Si inicias sesión primero, podrás recuperar, previsualizar e imprimir tus CVs generados en cualquier momento desde tu historial personal.</p>
                <button
                  onClick={onNavigateToLogin}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-[11px]"
                >
                  Registrarse / Iniciar Sesión
                </button>
              </div>
            )}

            {/* CURRICULUM PROFILE COLLECTION LIST (IF USER LOGGED IN) */}
            {user && cvCollection.length > 0 && (
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <History className="w-4 h-4 text-sky-600 mr-1.5" />
                  Tu Historial de Currículums ({cvCollection.length})
                </h3>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {cvCollection.map((cv) => (
                    <div
                      key={cv.id}
                      onClick={() => setSelectedCVFromHistory(cv)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        activeCV?.id === cv.id
                          ? "bg-sky-50 dark:bg-slate-900 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-slate-700 font-bold"
                          : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent"
                      }`}
                    >
                      <span className="truncate">{cv.fullName} - {cv.professionalSummary.substring(0, 24)}...</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => handleDelete(e, cv.id)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                          title="Eliminar CV"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI CV CREATOR FORM */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Formulario de Currículum</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Idrissa Dosso"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. mi.email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teléfono móvil</label>
                    <input
                      type="text"
                      placeholder="Ej. +34 600 123 456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dirección en Gran Canaria</label>
                  <input
                    type="text"
                    placeholder="Ej. Calle Doctor Chil, Las Palmas de Gran Canaria"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Profesión deseada o Sector</label>
                  <input
                    type="text"
                    placeholder="Ej. Instalador Solar, Limpieza Hotelera, Camarero"
                    value={currentProfession}
                    onChange={(e) => setCurrentProfession(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tus experiencias anteriores (en bruto)</label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Trabajé 2 años descargando barcos en el puerto de Dakar. También ayudé informalmente pintando casas en Telde..."
                    value={experienceInfo}
                    onChange={(e) => setExperienceInfo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white resize-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Idiomas que hablas</label>
                  <input
                    type="text"
                    placeholder="Ej. Francés nativo, Español básico, Inglés conversacional"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estudios / Cursos (bruto)</label>
                    <input
                      type="text"
                      placeholder="Ej. Bachiller en Dakar, Curso PRL 20h"
                      value={educationInfo}
                      onChange={(e) => setEducationInfo(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Habilidades clave</label>
                    <input
                      type="text"
                      placeholder="Ej. puntual, trabajo en equipo, alturas"
                      value={skillsList}
                      onChange={(e) => setSkillsList(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-900 text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  id="cv-generate-submit-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 text-sm mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Generar Currículum Con IA</span>
                </button>
              </form>
            </div>
            
          </div>

          {/* COLUMN 2: PREMIUM HIGH FIDELITY PRINTABLE CV DISPLAY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {activeCV ? "Previsualización Profesional del Currículum" : "Previsualización"}
              </p>
              
              {activeCV && (
                <button
                  id="cv-print-btn"
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-slate-700 hover:bg-sky-100 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              )}
            </div>

            {activeCV ? (
              <div 
                id="printable-cv-container"
                className="bg-white text-slate-800 p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-150 relative space-y-6 overflow-hidden max-w-[700px] mx-auto select-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {/* Visual abstract header accent */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500"></div>

                {/* CV Main Title info */}
                <div className="border-b-2 border-sky-100 pb-5">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeCV.fullName}</h2>
                  <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mt-1">{currentProfession || "Auxiliar Profesional"}</p>
                  
                  {/* Contact details row */}
                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-500 mt-3">
                    <span className="flex items-center">🗺️ {activeCV.address}</span>
                    <span className="flex items-center">📧 {activeCV.email}</span>
                    <span className="flex items-center">📞 {activeCV.phone}</span>
                  </div>
                </div>

                {/* CV Professional Summary block */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-700 border-b border-sky-50 pb-1">Perfil Profesional</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
                    {activeCV.professionalSummary}
                  </p>
                </div>

                {/* CV Professional Experience card */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-700 border-b border-sky-50 pb-1">Experiencia de Trabajo</h3>
                  <div className="space-y-4">
                    {activeCV.experience && activeCV.experience.map((exp, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                          <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-semibold text-sky-600">{exp.company}</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CV Education Card block */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-700 border-b border-sky-50 pb-1">Educación y Formación</h3>
                  <div className="space-y-3">
                    {activeCV.education && activeCV.education.map((edu, index) => (
                      <div key={index} className="space-y-0.5 text-xs">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                          <span className="text-[10px] text-slate-400">{edu.year}</span>
                        </div>
                        <p className="text-slate-500 font-light">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CV Skills block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-700 border-b border-sky-50 pb-1">Habilidades y Destrezas</h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCV.skills && activeCV.skills.map((skill, index) => (
                        <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-medium border border-slate-150">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-700 border-b border-sky-50 pb-1">Idiomas</h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCV.languages && activeCV.languages.map((lang, index) => (
                        <span key={index} className="bg-amber-50 text-amber-900 border border-amber-200/50 px-2 py-1 rounded text-[10px] font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PDF generation footer metadata */}
                <div className="border-t border-slate-100 pt-5 text-[9px] text-slate-400 text-center flex items-center justify-between select-none">
                  <span>Documento verificado por la IA de CanariaConnect</span>
                  <span>Fecha: {activeCV.dateGenerated}</span>
                </div>

              </div>
            ) : (
              <div className="bg-sky-50/20 dark:bg-slate-900/40 border-2 border-dashed border-sky-100 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 py-36 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold">Ningún CV Generado</h4>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">
                  Completa tu cuestionario a la izquierda y presiona en "Generar Currículum Con IA" para ver de forma instantánea tu CV maquetado profesionalmente.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
