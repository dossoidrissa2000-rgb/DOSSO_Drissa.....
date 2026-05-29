import React, { useState } from "react";
import { GraduationCap, Hourglass, HelpCircle, MapPin, CheckSquare, BookOpen, ChefHat, Sun, Sparkles, Building2, Trash } from "lucide-react";
import { Course } from "../types";

interface EducationViewProps {
  courses: Course[];
  isLoading: boolean;
}

export default function EducationView({ courses, isLoading }: EducationViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrollmentInfo, setEnrollmentInfo] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Todos los Cursos", icon: BookOpen },
    { id: "cocina", label: "Hostelería y Cocina", icon: ChefHat },
    { id: "energia-solar", label: "Energía Solar", icon: Sun },
    { id: "limpieza", label: "Limpieza Turística", icon: HelpCircle },
    { id: "construccion", label: "Construcción / PRL", icon: Building2 },
    { id: "espanol", label: "Cursos de Español", icon: GraduationCap },
    { id: "ia", label: "Inteligencia Artificial", icon: Sparkles }
  ];

  const filteredCourses = courses.filter((course) => {
    if (selectedFilter === "all") return true;
    return course.category === selectedFilter;
  });

  const handleEnroll = (course: Course) => {
    if (enrolledCourseIds.includes(course.id)) return;
    
    setEnrolledCourseIds((prev) => [...prev, course.id]);
    setEnrollmentInfo(course.title);
    setTimeout(() => {
      setEnrollmentInfo(null);
    }, 5000);
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center">
          <GraduationCap className="w-8 h-8 text-sky-600 mr-2" />
          Programas de Formación y Capacitación
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Encuentra cursos de alta empleabilidad en Canarias oficiales y capacitaciones subvencionadas para facilitar tu estabilidad laboral.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-sky-100 dark:border-slate-800">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUCCESS POPUP */}
      {enrollmentInfo && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md animate-fade-in">
          <div>
            <p className="text-sm font-bold">🎉 ¡Te has pre-matriculado correctamente!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hemos remitido tu solicitud al centro <strong>{enrollmentInfo}</strong>. El orientador se pondrá en contacto contigo en un plazo de 48 horas mediante correo o teléfono.
            </p>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded inline-block self-start sm:self-center">
            Pase Reservado
          </span>
        </div>
      )}

      {/* COURSES CATALOGUE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse bg-white dark:bg-slate-800 border rounded-2xl h-64 p-6 space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/2 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 w-3/4 rounded"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 w-full rounded mt-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 border rounded-2xl p-8 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Muy pronto disponible</h3>
          <p className="text-xs text-slate-400">Estamos concertando plazas con centros de Gran Canaria para esta categoría. Regresa en unos días para ver el catálogo ampliado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-100/50 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Category badging */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-800">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Nivel {course.level}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white group-hover:text-sky-600 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-semibold">{course.provider}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed line-clamp-4">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 border-t border-slate-50 dark:border-slate-700/60 text-xs text-slate-400">
                    <div className="flex items-center">
                      <Hourglass className="w-3.5 h-3.5 mr-1" />
                      <span>{course.hours} horas</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span>{course.modality}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-50 dark:border-slate-800">
                  <button
                    id={`course-enroll-btn-${course.id}`}
                    onClick={() => handleEnroll(course)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isEnrolled
                        ? "bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed text-center"
                        : "bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                    }`}
                  >
                    {isEnrolled ? "✓ Matriculado en espera" : "Pre-inscribirme Gratis"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADDITIONAL NOTICE BOARD */}
      <section className="bg-sky-50/30 dark:bg-slate-900/30 p-6 rounded-2xl border border-sky-100/50 dark:border-slate-800/80 space-y-4">
        <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center">
          <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
          ¿Eres recién llegado y buscas cursos oficiales de la SCE?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          El <strong>Servicio Canario de Empleo (SCE)</strong> ofrece decenas de certificados de profesionalidad gratuitos para desempleados y empadronados. El primer paso obligatorio es registrarte como demandante de empleo (dar darde) en su oficina y solicitar cita con un orientador. Apóyate en nuestras guías de la sección <strong>Asistencia</strong> para realizar este trámite rápidamente.
        </p>
      </section>

    </div>
  );
}
