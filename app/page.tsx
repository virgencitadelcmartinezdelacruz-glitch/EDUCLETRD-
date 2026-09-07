'use client';

import React, { useState, useEffect } from 'react';
import HomeWelcomeView from '@/components/HomeWelcomeView';
import BibliotecaView from '@/components/BibliotecaView';
import MinerdGradeSheet from '@/components/MinerdGradeSheet';
import QrAttendanceScanner from '@/components/QrAttendanceScanner';
import PedagogicalPlanner from '@/components/PedagogicalPlanner';
import MinerdRepository from '@/components/MinerdRepository';

export default function Page() {
  const [currentView, setCurrentView] = useState('inicio');

  // Estado para el logo institucional
  const [institutionLogo, setInstitutionLogo] = useState(null);

  // Estado para el nombre dinámico del centro educativo en la barra superior
  const [institutionName, setInstitutionName] = useState('Liceo Emiliano Tejera (Salcedo)');

  // Cargar logo y nombre guardados previamente si existen en localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('educlet_institution_logo');
    if (savedLogo) {
      setInstitutionLogo(savedLogo);
    }

    const updateInstitution = () => {
      const savedName = localStorage.getItem('educlet_institution_name');
      if (savedName) setInstitutionName(savedName);
    };

    updateInstitution();

    window.addEventListener('storage', updateInstitution);
    window.addEventListener('institutionChanged', updateInstitution);

    return () => {
      window.removeEventListener('storage', updateInstitution);
      window.removeEventListener('institutionChanged', updateInstitution);
    };
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setInstitutionLogo(base64String);
        localStorage.setItem('educlet_institution_logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Barra Superior / Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg overflow-hidden border-2 border-white/20 group-hover:scale-105 transition">
                {institutionLogo ? (
                  <img src={institutionLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>E</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>

            <div>
              <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-300 to-fuchsia-400">
                EDUCLETRD
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Plataforma de Gestión Educativa • <span className="text-slate-200 font-semibold">{institutionName}</span>
              </p>
            </div>
          </div>

          {/* Menú de Navegación Superior */}
          <nav className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentView('inicio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'inicio' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              🏠 Inicio
            </button>
            <button
              onClick={() => setCurrentView('biblioteca')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'biblioteca' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              📚 Biblioteca Digital
            </button>
            <button
              onClick={() => setCurrentView('calificaciones')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'calificaciones' ? 'bg-teal-500 text-slate-950 shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              📊 Calificaciones
            </button>
            <button
              onClick={() => setCurrentView('asistencia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'asistencia' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              📱 Asistencia QR
            </button>
            <button
              onClick={() => setCurrentView('planificacion')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'planificacion' ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              📑 Planificación
            </button>
            <button
              onClick={() => setCurrentView('recursos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'recursos' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              📁 Recursos MINERD
            </button>
          </nav>

        </div>
      </header>

      {/* Contenido Principal Dinámico */}
      <main className="flex-1">
        {currentView === 'inicio' && <HomeWelcomeView onNavigate={setCurrentView} />}
        {currentView === 'biblioteca' && <BibliotecaView />}
        {currentView === 'calificaciones' && <MinerdGradeSheet />}
        {currentView === 'asistencia' && <QrAttendanceScanner />}
        {currentView === 'planificacion' && <PedagogicalPlanner />}
        {currentView === 'recursos' && <MinerdRepository />}
      </main>

    </div>
  );
}