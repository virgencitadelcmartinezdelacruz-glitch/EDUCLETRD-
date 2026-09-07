import React, { useState } from 'react';
import MinerdGradeSheet from './MinerdGradeSheet'; // Tu componente actual de calificaciones
import InformaticaEducativaHub from './InformaticaEducativaHub'; // El nuevo componente que creamos

export default function MainPlatform() {
  const [currentView, setCurrentView] = useState('calificaciones'); // 'calificaciones' o 'informatica'

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Selector Superior de Módulos (Navegación Simple) */}
      <div className="bg-slate-900 p-3 rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md">
            Liceo Emiliano Tejera
          </span>
          <span className="text-white text-xs font-semibold hidden md:inline">
            Plataforma de Gestión Educativa
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('calificaciones')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              currentView === 'calificaciones'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📊 Registro de Calificaciones
          </button>

          <button
            onClick={() => setCurrentView('informatica')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              currentView === 'informatica'
                ? 'bg-cyan-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            💻 Informática Educativa
          </button>
        </div>
      </div>

      {/* Renderizado Condicional del Módulo Activo */}
      {currentView === 'calificaciones' ? (
        <MinerdGradeSheet />
      ) : (
        <InformaticaEducativaHub />
      )}

    </div>
  );
}