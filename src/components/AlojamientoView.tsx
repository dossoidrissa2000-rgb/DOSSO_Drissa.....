import React, { useState } from "react";
import { Home as HomeIcon, MapPin, DollarSign, Calendar, MessageSquare, Send, CheckCircle, Share2, PlusCircle, ArrowLeft } from "lucide-react";
import { HousingItem } from "../types";

interface AlojamientoViewProps {
  housingList: HousingItem[];
  user: any;
  onPostHouse: (house: Partial<HousingItem>) => void;
}

export default function AlojamientoView({ housingList, user, onPostHouse }: AlojamientoViewProps) {
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [selectedPriceLimit, setSelectedPriceLimit] = useState<number>(800);
  const [contactingHouseId, setContactingHouseId] = useState<string | null>(null);
  
  // Custom contact message form
  const [contactName, setContactName] = useState(user?.fullName || "");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Listing creation form state
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newType, setNewType] = useState<"Piso completo" | "Habitación" | "Estudio">("Habitación");
  const [newLocation, setNewLocation] = useState("Las Palmas, Gran Canaria");
  const [newDesc, setNewDesc] = useState("");
  const [newContactEmail, setNewContactEmail] = useState(user?.email || "");
  const [newContactPhone, setNewContactPhone] = useState(user?.phone || "");
  const [postSuccess, setPostSuccess] = useState(false);

  const filteredHousing = housingList.filter((house) => {
    const matchesType = selectedType === "Todos" || house.type === selectedType;
    const matchesPrice = house.price <= selectedPriceLimit;
    return matchesType && matchesPrice;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactingHouseId(null);
      setContactMsg("");
    }, 4500);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert("Por favor completa el título y precio mensual de tu alojamiento.");
      return;
    }

    const item: Partial<HousingItem> = {
      title: newTitle,
      price: Number(newPrice),
      type: newType,
      location: newLocation,
      description: newDesc,
      bedrooms: newType === "Habitación" ? 1 : 2,
      bathrooms: 1,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
      contactPhone: newContactPhone || "+34 600 000 000",
      contactEmail: newContactEmail || "alojamiento@canariaconnect.locals"
    };

    onPostHouse(item);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setIsListingFormOpen(false);
      // reset
      setNewTitle("");
      setNewPrice("");
      setNewDesc("");
    }, 3000);
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-sky-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center">
            <HomeIcon className="w-8 h-8 text-sky-600 mr-2" />
            Encuentra Vivienda o Alojamiento Compartido
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Anuncios regulados de habitaciones compartidas o pisos de confianza para residentes y recién llegados a Gran Canaria.
          </p>
        </div>

        <button
          onClick={() => setIsListingFormOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold px-5 py-3 rounded-xl flex items-center space-x-2 text-sm shadow-md cursor-pointer shrink-0 transition-transform hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ofrecer mi Alojamiento</span>
        </button>
      </div>

      {/* FILTER PANEL */}
      {!isListingFormOpen && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-100 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo:</span>
            {["Todos", "Habitación", "Estudio", "Piso completo"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedType === t
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="w-full md:w-[320px] space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Precio Máximo:</span>
              <span className="text-sky-600 dark:text-sky-400">{selectedPriceLimit}€ / mes</span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={selectedPriceLimit}
              onChange={(e) => setSelectedPriceLimit(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>
        </div>
      )}

      {/* RENTAL REGULAR FORM FOR USER LISTINGS */}
      {isListingFormOpen ? (
        <div className="bg-white dark:bg-slate-800 max-w-2xl mx-auto rounded-2xl border border-sky-100 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <button
            onClick={() => setIsListingFormOpen(false)}
            className="text-xs font-bold text-sky-600 flex items-center space-x-1 mb-2"
          >
            <span>← Volver al Catálogo</span>
          </button>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Publica tu Alojamiento o Habitación</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ofrece tu espacio libre de forma regulada a la comunidad de CanariaConnect.</p>
          </div>

          {postSuccess ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 p-6 rounded-xl text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-lg">Alojamiento guardado con éxito</h3>
              <p className="text-xs">¡Gracias por apoyar a la comunidad! Tu anuncio ya forma parte de los resultados locales de CanariaConnect.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateListing} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título del Anuncio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Habitación reformada con WiFi"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Precio al mes (€) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 300"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Alojamiento *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  >
                    <option value="Habitación">Habitación en piso compartido</option>
                    <option value="Estudio">Estudio pequeño independiente</option>
                    <option value="Piso completo">Piso completo independiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Ubicación / Comarca en la Isla *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Playa del Inglés, San Bartolomé de Tirajana"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Detalles y descripción del espacio *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detalla qué incluye el precio (WiFi, agua, luz), normas de convivencia, si se busca estudiante, perfil ideal..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email de contacto</label>
                  <input
                    type="email"
                    placeholder="mi.correo@gmail.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teléfono o WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+34 600 000 000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl mt-4 cursor-pointer"
              >
                Registrar Publicación de Alojamiento
              </button>
            </form>
          )}
        </div>
      ) : (
        /* HOUSING LIST GRID CATALOGUE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHousing.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-sky-100/50 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-sky-900/90 text-white px-2.5 py-1 rounded-full text-xs font-extrabold backdrop-blur-md border border-white/10">
                    {item.type}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow shadow-black/20">
                    {item.price}€ / mes
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 bg-slate-50/40 dark:bg-slate-900/20 border-t border-slate-50 dark:border-slate-850">
                <button
                  id={`house-contact-${item.id}`}
                  onClick={() => setContactingHouseId(item.id)}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contactar Propietario</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HOUSING NOT EMPTY WATERFALL INFO */}
      {!isListingFormOpen && filteredHousing.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-sky-100 dark:border-slate-800 max-w-sm mx-auto">
          <HomeIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-white mt-3">Sin resultados coincidentes</h4>
          <p className="text-xs text-slate-400 mt-1">Aumenta tu rango máximo de precio mensual.</p>
        </div>
      )}

      {/* CONTACT DRAWER MODAL OVERLAY */}
      {contactingHouseId && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-md w-full border border-sky-100 p-6 shadow-2xl relative space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Contactar con Arrendador</h3>
              <button
                onClick={() => setContactingHouseId(null)}
                className="text-xs font-bold text-slate-450 hover:text-slate-800"
              >
                Cerrar ✕
              </button>
            </div>

            {contactSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl text-center space-y-1.5">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Mensaje enviado</h4>
                <p className="text-xs text-slate-500">Hemos enviado tu mensaje redactado y tu contacto al arrendador. Te enviará un WhatsApp pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <p className="text-slate-500">
                  Envía un mensaje indicando tu perfil laboral para concertar una visita física o vídeollamada al alojamiento.
                </p>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Tu Nombre de Contacto *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-550 block">Mensaje Personal *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ej. Hola, estoy muy interesado en la habitación. Trabajo en hostelería con contrato regular de Lopesan, no fumo ni tengo mascotas. ¿Cuándo se podría visitar?"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 bg-slate-50 resize-none text-[11px]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContactingHouseId(null)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-150 text-slate-700 font-bold transition-all text-[11px]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensaje</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border text-[10px] space-y-1 text-slate-500">
              <p className="font-bold text-slate-700">📞 Contacto Directo Telefónico:</p>
              <p>Propietario verificado: <span className="font-semibold text-sky-600">{housingList.find(h => h.id === contactingHouseId)?.contactPhone}</span></p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
