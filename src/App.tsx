import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import JobsView from "./components/JobsView";
import EducationView from "./components/EducationView";
import CvGeneratorView from "./components/CvGeneratorView";
import AyudaAdminView from "./components/AyudaAdminView";
import AlojamientoView from "./components/AlojamientoView";
import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import { Job, Course, UserProfile, CVProfile, AdminTopic, HousingItem } from "./types";
import { Compass, Sparkles, Heart } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("inicio");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [adminTopics, setAdminTopics] = useState<AdminTopic[]>([]);
  const [housingList, setHousingList] = useState<HousingItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load initial data and confirm user session
  useEffect(() => {
    async function initPlatform() {
      try {
        setIsLoading(true);

        // Fetch User Session
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData && sessionData.user) {
          setUser(sessionData.user);
        }

        // Fetch jobs, courses, topics and housing list from full stack server
        const [jobsRes, coursesRes, topicsRes, housingRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/courses"),
          fetch("/api/admin-topics"),
          fetch("/api/housing")
        ]);

        const [jobsData, coursesData, topicsData, housingData] = await Promise.all([
          jobsRes.json(),
          coursesRes.json(),
          topicsRes.json(),
          housingRes.json()
        ]);

        setJobs(jobsData || []);
        setCourses(coursesData || []);
        setAdminTopics(topicsData || []);
        setHousingList(housingData || []);

      } catch (e) {
        console.error("Error loading CanariaConnect API metadata:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initPlatform();
  }, []);

  // Sync Dark mode toggling under document class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Auth Operations
  const handleLogin = async (email: string, fullName?: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setCurrentTab("dashboard");
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSignup = async (email: string, fullName: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setCurrentTab("dashboard");
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setCurrentTab("inicio");
    } catch (e) {
      console.error(e);
    }
  };

  // User Profile configuration updates
  const handleUpdateProfile = async (profileData: any) => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Jobs Actions
  const handleApplyJob = async (jobId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleSaveToggleJob = async (jobId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // AI CV Builder Integration
  const handleGenerateCV = async (cvData: any): Promise<CVProfile | null> => {
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData)
      });
      const data = await res.json();
      if (data.success && data.cv) {
        // Redraw profile session if user session reflects dynamic push
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData && sessionData.user) {
          setUser(sessionData.user);
        }
        return data.cv;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleDeleteCV = async (cvId: string): Promise<boolean> => {
    // Client-side simulation fallback of delete
    if (user) {
      const updatedHistory = user.cvHistory.filter(c => c.id !== cvId);
      setUser({
        ...user,
        cvHistory: updatedHistory
      });
      return true;
    }
    return false;
  };

  // House listings updates
  const handlePostHouse = (newHouse: Partial<HousingItem>) => {
    const fullHouse: HousingItem = {
      id: `house-${Date.now()}`,
      title: newHouse.title || "Alojamiento Compartido",
      price: newHouse.price || 300,
      type: newHouse.type || "Habitación",
      location: newHouse.location || "Gran Canaria, España",
      bedrooms: newHouse.bedrooms || 1,
      bathrooms: newHouse.bathrooms || 1,
      description: newHouse.description || "",
      imageUrl: newHouse.imageUrl || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
      contactEmail: newHouse.contactEmail || "alojamiento@canariaconnect.locals",
      contactPhone: newHouse.contactPhone || "+34 600 000 000",
      isAvailable: true
    };
    setHousingList((prev) => [fullHouse, ...prev]);
  };

  // Render correct Active Section Tab
  const renderContent = () => {
    switch (currentTab) {
      case "inicio":
        return <HomeView setCurrentTab={setCurrentTab} user={user} />;
      case "empleos":
        return (
          <JobsView
            jobs={jobs}
            user={user}
            onApply={handleApplyJob}
            onSaveToggle={handleSaveToggleJob}
            onNavigateToLogin={() => setCurrentTab("login")}
            isLoading={isLoading}
          />
        );
      case "formacion":
        return <EducationView courses={courses} isLoading={isLoading} />;
      case "cv-generator":
        return (
          <CvGeneratorView
            user={user}
            onGenerateCV={handleGenerateCV}
            onNavigateToLogin={() => setCurrentTab("login")}
            cvHistory={user?.cvHistory || []}
            onDeleteCV={handleDeleteCV}
          />
        );
      case "ayuda-admin":
        return <AyudaAdminView topics={adminTopics} />;
      case "alojamiento":
        return (
          <AlojamientoView
            housingList={housingList}
            user={user}
            onPostHouse={handlePostHouse}
          />
        );
      case "login":
        return (
          <LoginView
            onLogin={handleLogin}
            onSignup={handleSignup}
            isLoading={isLoading}
          />
        );
      case "dashboard":
        if (!user) {
          setCurrentTab("login");
          return null;
        }
        return (
          <DashboardView
            user={user}
            jobs={jobs}
            onUpdateProfile={handleUpdateProfile}
            onSaveToggle={handleSaveToggleJob}
            setCurrentTab={setCurrentTab}
          />
        );
      default:
        return <HomeView setCurrentTab={setCurrentTab} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Dynamic Header navbar navigation component */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Contents core panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading && jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-10 w-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">Iniciando plataforma CanariaConnect...</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Modern Footer section */}
      <footer className="bg-white dark:bg-slate-950 border-t border-sky-100 dark:border-slate-850 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base bg-gradient-to-r from-sky-600 to-amber-500 bg-clip-text text-transparent">
                CanariaConnect
              </span>
              <span className="text-xs text-slate-400">| © 2026. Todos los derechos reservados.</span>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-400 font-light flex items-center gap-1">
              Diseñado con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" /> para la inserción y empoderamiento de residentes y recién llegados a Gran Canaria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
