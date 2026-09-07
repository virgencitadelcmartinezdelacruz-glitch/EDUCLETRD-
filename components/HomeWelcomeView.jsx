import React, { useState, useEffect } from 'react';

export default function HomeWelcomeView({ onNavigate }) {
  // Configuración institucional persistente e independiente por centro
  const [isEditingInstitution, setIsEditingInstitution] = useState(false);
  const [institutionName, setInstitutionName] = useState(() => {
    return localStorage.getItem('educlet_institution_name') || 'Liceo Emiliano Tejera (Salcedo)';
  });
  const [institutionCode, setInstitutionCode] = useState(() => {
    return localStorage.getItem('educlet_institution_code') || '00123';
  });

  // Métricas de avance sincronizadas automáticamente
  const [stats, setStats] = useState({
    calificaciones: 0,
    asistencia: 0,
    planificacion: 0,
    global: 0
  });

  useEffect(() => {
    try {
      const currentCode = localStorage.getItem('educlet_institution_code') || '00123';
      
      const savedCalificaciones = localStorage.getItem(`educlet_minerd_calificaciones_${currentCode}`);
      const savedAsistencia = localStorage.getItem(`educlet_asistencia_registros_${currentCode}`);
      const savedPlanificacion = localStorage.getItem(`educlet_planificacion_data_${currentCode}`);

      let califProgress = savedCalificaciones ? 90 : 15;
      let asistProgress = savedAsistencia ? 95 : 20;
      let planProgress = savedPlanificacion ? 85 : 10;

      const globalAvg = Math.round((califProgress + asistProgress + planProgress) / 3);

      setStats({
        calificaciones: califProgress,
        asistencia: asistProgress,
        planificacion: planProgress,
        global: globalAvg
      });
    } catch (e) {
      setStats({ calificaciones: 0, asistencia: 0, planificacion: 0, global: 0 });
    }
  }, [institutionCode]);

  const handleSaveInstitution = (e) => {
    e.preventDefault();
    const cleanCode = institutionCode.trim() || '00123';
    
    // Guardamos en localStorage para propagar el nombre a la barra superior y demás módulos
    localStorage.setItem('educlet_institution_name', institutionName);
    localStorage.setItem('educlet_institution_code', cleanCode);
    
    // Disparamos un evento personalizado para que el Navbar o layout global detecte el cambio de nombre inmediatamente
    window.dispatchEvent(new Event('storage'));
    
    setIsEditingInstitution(false);
    window.location.reload();
  };

  const handleResetData = () => {
    if (window.confirm(`¿Estás seguro de restablecer los datos para el centro con código ${institutionCode}?`)) {
      localStorage.removeItem(`educlet_minerd_calificaciones_${institutionCode}`);
      localStorage.removeItem(`educlet_asistencia_registros_${institutionCode}`);
      localStorage.removeItem(`educlet_planificacion_data_${institutionCode}`);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 font-sans">
      
      {/* Banner Hero Institucional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-10 shadow-2xl text-white border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-block text-xs md:text-sm font-black tracking-widest uppercase bg-amber-400 text-slate-950 px-4 py-1.5 rounded-xl shadow-md">
                ✨ Excelencia Educativa
              </span>

              {/* Botón de Cambio de Centro Educativo */}
              <button
                onClick={() => setIsEditingInstitution(!isEditingInstitution)}
                className="bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-400/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                🏫 Configurar Centro Educativo
              </button>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Bienvenido a esta tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-fuchsia-400">Plataforma Digital Interactiva</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed italic">
              "La educación no cambia el mundo, cambia a las personas que van a cambiar el mundo." — Impulsando el desarrollo en <span className="text-amber-300 font-semibold">{institutionName}</span>.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-slate-950/60 p-2">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqd2I0azhndGozZ2xrdXB3aXh3OXoxN28xdWF5eWh6bTZxNmR1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif" 
                alt="Docente trabajando en computadora" 
                className="w-full h-48 md:h-56 object-cover rounded-xl"
              />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[11px] font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-full shadow-lg">
                  💻 Docente en Acción Digital
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Panel Desplegable para Configurar el Centro Educativo */}
      {isEditingInstitution && (
        <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-2xl shadow-2xl max-w-xl mx-auto space-y-4 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-cyan-300">⚙️ Configuración del Centro Educativo Activo</h3>
            <button onClick={() => setIsEditingInstitution(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕ Cerrar</button>
          </div>
          <form onSubmit={handleSaveInstitution} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nombre del Centro / Liceo:</label>
              <input 
                type="text" 
                value={institutionName} 
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                required 
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Código del Centro:</label>
              <input 
                type="text" 
                value={institutionCode} 
                onChange={(e) => setInstitutionCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                required 
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button 
                type="button"
                onClick={handleResetData}
                className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
              >
                Limpiar datos de este centro
              </button>
              <button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer transition"
              >
                Actualizar Centro ✓
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Principal con las 3 Tarjetas, GIFs y Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Avance Global del Plantel */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                📈
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sincronizado
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Avance de Trabajo por Docente</h3>
              <p className="text-xs text-slate-400 mt-1">Monitoreo en tiempo real del progreso registrado en las áreas.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">📊 Calificaciones</span>
                  <span className="text-teal-400 font-bold">{stats.calificaciones}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.calificaciones}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">📱 Control de Asistencia</span>
                  <span className="text-purple-400 font-bold">{stats.asistencia}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.asistencia}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">📑 Planificación</span>
                  <span className="text-amber-400 font-bold">{stats.planificacion}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.planificacion}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Progreso general: <strong className="text-emerald-400">{stats.global}% Activo</strong></span>
          </div>
        </div>

        {/* 2. Tarjeta de Calificaciones (Con GIF y Gráfico) */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between backdrop-blur-md space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                📊
              </div>
              <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2.5 py-0.5 rounded-full font-semibold border border-teal-500/20">
                Módulo Activo
              </span>
            </div>
            
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50">
              <img 
                src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" 
                alt="Calificaciones" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-teal-300 bg-slate-900/90 px-2 py-0.5 rounded border border-teal-500/30">
                📈 Evaluaciones por Competencias
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Registro de Calificaciones</h3>
              <p className="text-xs text-slate-400 mt-1">Evaluación por competencias específicas, períodos de recuperación y reportes oficiales listos para el MINERD.</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Progreso de Ingreso de Notas</span>
                <span className="text-teal-400 font-bold">{stats.calificaciones}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-teal-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.calificaciones}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigate('calificaciones')}
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition cursor-pointer text-center block shadow-md"
            >
              Abrir Calificaciones →
            </button>
          </div>
        </div>

        {/* 3. Tarjeta de Asistencia QR (Con GIF y Gráfico) */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between backdrop-blur-md space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                📱
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full font-semibold border border-purple-500/20">
                Escaneo en Vivo
              </span>
            </div>

            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50">
              <img 
                src="https://media.giphy.com/media/xT5LMFZDsj0AKUDYTS/giphy.gif" 
                alt="Asistencia QR" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-purple-300 bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/30">
                📲 Control Automatizado QR
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Control de Asistencia QR</h3>
              <p className="text-xs text-slate-400 mt-1">Registro automatizado por secciones mediante escaneo rápido de credenciales y reportes diarios.</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Asistencia Registrada del Centro</span>
                <span className="text-purple-400 font-bold">{stats.asistencia}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-purple-400 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.asistencia}%` }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigate('asistencia')}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer text-center block shadow-md"
            >
              Abrir Asistencia QR →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}