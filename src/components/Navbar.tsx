import React, { useState } from "react";
import { Menu, X, Compass, Briefcase, GraduationCap, FileCode, CheckSquare, LogOut, User, Sun, Moon, Home as HomeIcon } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  darkMode,
  toggleDarkMode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "inicio", label: "Inicio", icon: Compass },
    { id: "empleos", label: "Empleos", icon: Briefcase },
    { id: "formacion", label: "Formación", icon: GraduationCap },
    { id: "cv-generator", label: "Crear CV IA", icon: FileCode },
    { id: "ayuda-admin", label: "Asistencia", icon: CheckSquare },
    { id: "alojamiento", label: "Alojamiento", icon: HomeIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-sky-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            id="nav-logo"
            onClick={() => setCurrentTab("inicio")}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              CC
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-amber-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-amber-400">
                CanariaConnect
              </span>
              <p className="text-[10px] text-sky-500 font-medium tracking-widest uppercase -mt-1 dark:text-sky-300">
                Gran Canaria
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-400"
                      : "text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Dark Mode toggle */}
            <button
              id="theme-toggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-3">
                <button
                  id="nav-to-dashboard"
                  onClick={() => setCurrentTab("dashboard")}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                    currentTab === "dashboard"
                      ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.fullName}</span>
                </button>

                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => setCurrentTab("login")}
                className="ml-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:brightness-110 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-sky-500/10 cursor-pointer transition-all duration-200"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-sky-600" />}
            </button>
            
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left text-base font-medium ${
                  isActive
                    ? "bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 px-4">
            {user ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-amber-500 text-white py-2 rounded-lg font-medium text-sm"
                >
                  Mi Panel de Control
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 text-rose-500 font-medium text-sm py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCurrentTab("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium text-center text-sm"
              >
                Iniciar Sesión / Registrarse
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
