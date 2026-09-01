'use client';

import React, { useState } from 'react';
import AdminCentralDashboard from '../components/AdminCentralDashboard';
import MinerdGradeSheet from '../components/MinerdGradeSheet';
import QrAttendanceScanner from '../components/QrAttendanceScanner';
import PedagogicalPlanner from '../components/PedagogicalPlanner';
import MinerdRepository from '../components/MinerdRepository';

export default function EDUCLETRDApp() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Encabezado Superior EDUCLETRD */}
      <header className="bg-gradient-to-r from-blue-950 via-indigo-900 to-amber-600 text-white p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-amber-400">EDUCLETRD</h1>
          <p className="text-xs text-blue-100">Plataforma de Gestión Educativa - República Dominicana</p>
        </div>

        {/* Navegación por Módulos */}
        <nav className="flex flex-wrap gap-2">
          {[
            { id: 'admin', label: '⚙️ Admin Central' },
            { id: 'calificaciones', label: '📊 Calificaciones (P1-RP4)' },
            { id: 'asistencia', label: '📱 Asistencia QR' },
            { id: 'planificacion', label: '📝 Planificación' },
            { id: 'minerd', label: '📚 Recursos MINERD' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-blue-950 font-black'
                  : 'bg-blue-900/80 hover:bg-blue-800 text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Renderizado de Módulos */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {activeTab === 'admin' && <AdminCentralDashboard />}
        {activeTab === 'calificaciones' && <MinerdGradeSheet />}
        {activeTab === 'asistencia' && <QrAttendanceScanner />}
        {activeTab === 'planificacion' && <PedagogicalPlanner />}
        {activeTab === 'minerd' && <MinerdRepository />}
      </main>
    </div>
  );
}