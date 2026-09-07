import React from 'react';

export default function HomeWelcomeView({ onNavigate }) {
  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12">
      
      {/* Banner Principal Institucional */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>🏫</span> Liceo Emiliano Tejera — Salcedo
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Plataforma de Gestión Educativa <span className="text-amber-400">EDUCLETRD</span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
            Entorno digital oficial del centro educativo. Utilice el menú superior de navegación o el acceso directo a la Biblioteca Digital.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('inicio')}
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="text-xl animate-bounce">👋</span>
              <span>¡Bienvenidos a EDUCLETRD!</span>
            </button>

            <button
              onClick={() => onNavigate('biblioteca')}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-sm shadow-xl transition-all duration-300 cursor-pointer"
            >
              <span>📚</span>
              <span>Biblioteca Digital & Archivos</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}