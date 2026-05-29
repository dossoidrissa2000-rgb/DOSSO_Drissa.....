import React, { useState } from "react";
import { CheckSquare, FileText, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Download, Eye, ShieldCheck, HeartHandshake, Info } from "lucide-react";
import { AdminTopic } from "../types";

interface AyudaAdminViewProps {
  topics: AdminTopic[];
}

export default function AyudaAdminView({ topics }: AyudaAdminViewProps) {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>("topic-1");
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({});

  const toggleExpand = (id: string) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  const handleToggleStep = (topicId: string, stepIndex: number) => {
    const stepId = `${topicId}-${stepIndex}`;
    setCompletedSteps((prev) => {
      const current = prev[topicId] || [];
      if (current.includes(stepId)) {
        return { ...prev, [topicId]: current.filter((s) => s !== stepId) };
      } else {
        return { ...prev, [topicId]: [...current, stepId] };
      }
    });
  };

  const templatesDocs = [
    { title: "Formulario EX-15 (Solicitud de NIE)", format: "PDF", size: "244 KB", url: "https://extranjeros.inclusion.gob.es/es/ModelosSolicitudes/Mod_solicitudes2/index.html" },
    { title: "Tasa Modelo 790-012 (Instrucciones)", format: "PDF", size: "180 KB", url: "https://icp.administracionelectronica.gob.es/icpplus/index.html" },
    { title: "Modelo Solicitud Empadronamiento", format: "PDF", size: "125 KB", url: "https://www.laspalmasgc.es/" },
    { title: "Guía Integración SCE Canarias", format: "PDF", size: "1.2 MB", url: "https://www.gobiernodecanarias.org/empleo/" }
  ];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center">
          <CheckSquare className="w-8 h-8 text-sky-600 mr-2" />
          Guías de Trámites y Asistencia Administrativa
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Aprende de forma clara y sencilla cómo resolver los trámites necesarios para vivir y trabajar legalmente en Gran Canaria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* EXPANDABLE ADMINISTRATIVE GUIDELINE LIST */}
        <div className="lg:col-span-8 space-y-4">
          {topics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            const topicCompleted = completedSteps[topic.id] || [];
            const completionPercent = Math.round((topicCompleted.length / topic.steps.length) * 100);

            return (
              <div
                key={topic.id}
                id={`admin-topic-card-${topic.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-100/50 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow transition-shadow"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-2 flex-1">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-800">
                      tramitología: {topic.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                      {topic.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                      {topic.summary}
                    </p>
                    
                    {/* Completion status indicator */}
                    {topicCompleted.length > 0 && (
                      <div className="flex items-center space-x-2 pt-1.5">
                        <div className="w-24 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${completionPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{completionPercent}% completado ({topicCompleted.length}/{topic.steps.length})</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Accordion Content Body */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-slate-50 dark:border-slate-800 pt-6 bg-slate-50/20 dark:bg-slate-900/10 space-y-6">
                    
                    {/* Step list with checkboxes */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Paso a Paso Obligatorio:</h4>
                      <div className="space-y-2.5">
                        {topic.steps.map((step, idx) => {
                          const stepId = `${topic.id}-${idx}`;
                          const isDone = topicCompleted.includes(stepId);
                          return (
                            <div
                              key={idx}
                              onClick={() => handleToggleStep(topic.id, idx)}
                              className={`flex items-start p-3 rounded-xl border cursor-pointer select-none transition-colors ${
                                isDone
                                  ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950 text-emerald-850 dark:text-emerald-400"
                                  : "bg-white dark:bg-slate-800 border-slate-200/50 dark:border-slate-700 hover:border-sky-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                id={`step-check-${stepId}`}
                                onChange={() => {}} // Swallowed, parent div click handles
                                className="mt-1 h-4 w-4 shrink-0accent-sky-600 rounded cursor-pointer mr-3"
                              />
                              <div className="text-xs sm:text-sm">
                                <span className="font-bold mr-1">Paso {idx + 1}:</span>
                                <span className="font-light leading-relaxed">{step}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resources buttons inside topic */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Enlaces y Formularios Oficiales:</h4>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {topic.usefulLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="referrer noopener"
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 text-sky-500 mr-2 shrink-0" />
                              {link.label}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* COLUMN 2: DOWNLOADABLE TEMPLATES & COMMUNITY HELP */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Document templates card download panel */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center pb-2 border-b border-slate-150">
              <Download className="w-5 h-5 text-sky-600 mr-2" />
              Documentación Útil
            </h3>
            
            <div className="space-y-3">
              {templatesDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-sky-100 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[170px] truncate">{doc.title}</p>
                    <p className="text-[10px] text-slate-400">Formato {doc.format} • {doc.size}</p>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="referrer noopener"
                    className="p-2 bg-white dark:bg-slate-850 hover:bg-sky-50 dark:hover:bg-slate-800 border rounded-lg text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                    title="Visitar Portal de descarga"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Sindicato y Voluntariado card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-5 rounded-2xl space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
              <HeartHandshake className="w-32 h-32" />
            </div>
            
            <h3 className="font-bold text-base flex items-center text-amber-300">
              <ShieldCheck className="w-5 h-5 mr-1" />
              Asesoría Legal Comunitaria
            </h3>
            
            <p className="text-[11px] text-indigo-200 leading-relaxed font-light">
              Si sufres abusos laborales en tu contrato, cobras menos del convenio establecido en cocina o limpieza, o sufres acoso inmobiliario, cuentas con el apoyo del <strong>Gabinete de Orientación Sindical</strong> y organizaciones de voluntariado de Gran Canaria de forma gratuita. No estás solo.
            </p>

            <div className="pt-2">
              <a
                href="https://www.gobiernodecanarias.org/empleo/"
                target="_blank"
                rel="referrer noopener"
                className="w-full text-center block bg-white/10 hover:bg-white/15 border border-white/15 text-white py-2 rounded-xl text-xs font-bold transition-all"
              >
                Atención Ciudadana y Denuncias
              </a>
            </div>
          </div>

          {/* Descuento de residente info alert */}
          <div className="bg-amber-50 dark:bg-slate-900/40 p-4 rounded-xl border border-amber-200 dark:border-amber-950/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <h4 className="font-bold text-amber-800 dark:text-amber-400 flex items-center">
              <Info className="w-4 h-4 mr-1 shrink-0" />
              Tip: Descuento de Residente Canario
            </h4>
            <p className="font-light leading-relaxed">
              Una vez que obtengas tu NIE y puedas empadronarte en Gran Canaria, tendrás derecho a un <strong>75% de descuento directo</strong> en billetes de avión y barcos para viajar entre las islas y a la España peninsular.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
