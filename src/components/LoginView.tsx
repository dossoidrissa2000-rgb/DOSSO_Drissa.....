import React, { useState } from "react";
import { LogIn, KeyRound, Mail, User, ShieldCheck, ArrowRight, Loader2, Compass } from "lucide-react";
import { UserProfile } from "../types";

interface LoginViewProps {
  onLogin: (email: string, fullName?: string) => Promise<boolean>;
  onSignup: (email: string, fullName: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function LoginView({ onLogin, onSignup, isLoading }: LoginViewProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("El email es requerido");
      return;
    }

    setLocalLoading(true);
    setErrorMsg(null);

    try {
      if (isLoginTab) {
        await onLogin(email);
      } else {
        if (!fullName) {
          setErrorMsg("El nombre completo es obligatorio para registrarse");
          setLocalLoading(false);
          return;
        }
        await onSignup(email, fullName);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al autenticar");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalLoading(true);
    setErrorMsg(null);
    try {
      // Simulate Google Auth
      await onLogin("invitado.google@gmail.com", "Invitado Google");
    } catch (err: any) {
      setErrorMsg("Error con Google SSO de simulación");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 pb-24">
      <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xl overflow-hidden p-8 sm:p-10 space-y-6">
        
        {/* Background ocean sunset accent */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-orange-550/10 pointer-events-none filter blur-2xl"></div>
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-sky-500/10 pointer-events-none filter blur-2xl"></div>

        {/* Brand Banner */}
        <div className="text-center space-y-2 relative">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md mb-2">
            CC
          </div>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
            Te damos la bienvenida
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-light">
            Únete a la plataforma CanariaConnect para gestionar tu perfil, ofertas y CVs de IA en Gran Canaria.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg font-bold cursor-pointer transition-colors ${
              isLoginTab
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-450 shadow-sm border border-slate-100 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg font-bold cursor-pointer transition-colors ${
              !isLoginTab
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-450 shadow-sm border border-slate-100 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Registrarme
          </button>
        </div>

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-xs p-3 rounded-lg border border-rose-100 dark:border-rose-950 text-center font-medium animate-bounce">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginTab && (
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase tracking-wide block">Nombre Completo *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Idrissa Dosso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wide block">Correo Electrónico *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="Ej. tu.correo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wide block">Contraseña *</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={localLoading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl mt-4 cursor-pointer flex items-center justify-center space-x-2 shadow-md transition-all uppercase tracking-wider text-xs"
          >
            {localLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>{isLoginTab ? "Acceder a mi Cuenta" : "Crear mi Cuenta de Canaria"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* MOCK GOOGLE LOGIN */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-850"></div>
          <span className="flex-shrink mx-4 text-slate-450 text-[10px] uppercase font-bold tracking-widest">o bien</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-850"></div>
        </div>

        <button
          id="google-sso-btn"
          onClick={handleGoogleLogin}
          disabled={localLoading}
          className="w-full py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl font-bold flex items-center justify-center space-x-2 text-xs cursor-pointer shadow-sm transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.514 5.514 0 0 1 8.5 13a5.514 5.514 0 0 1 5.491-5.514c2.217 0 3.996 1.258 4.782 3.085l3.86-1.5C21.1 5.3 17.85 3 14 3 8.477 3 4 7.477 4 13s4.477 10 10 10c5.5 0 9.5-3.8 9.5-9.5 0-.614-.055-1.214-.155-1.786l-11.105.071z"
            />
          </svg>
          <span>Acceder con tu cuenta de Google</span>
        </button>

        {/* SECURITY REASSURANCE NOTE */}
        <div className="text-center flex items-center justify-center text-[10px] text-slate-400 gap-1.5 pt-2 select-none border-t border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tus datos de CV y perfiles están protegidos de forma segura.</span>
        </div>

      </div>
    </div>
  );
}
