import React, { useState, useRef } from 'react';

const SECCIONES_POR_CICLO = {
  '1er Ciclo': [
    '1A', '1B', '1C', '1D', '1E', '1F', '1G', '1H',
    '2A', '2B', '2C', '2D', '2E', '2F', '2G', '2H',
    '3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H'
  ],
  '2do Ciclo': [
    '4A', '4B', '4C', '4D', '4E',
    '5A', '5B', '5C', '5D', '5E',
    '6A', '6B', '6C', '6D'
  ]
};

const ASIGNATURAS_MINERD = [
  'Lengua Española',
  'Matemática',
  'Ciencias Sociales',
  'Ciencias Naturales',
  'Educación Física',
  'Salida de Lengua Española',
  'Salida de Idiomas',
  'Formación Integral Humana y Religiosa',
  'Francés',
  'Inglés',
  'Educación Artística',
  'Salida de Ciencias Sociales'
];

const GRUPOS_COMPETENCIAS = [
  { id: 'ce1', title: 'CE1', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'ce2_ce3', title: 'CE2 Y CE3', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'ce4_ce7', title: 'CE4 Y CE7', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'ce5_ce6', title: 'CE5 Y CE6', color: 'bg-purple-100 text-purple-900 border-purple-300' },
];

const generateBaseStudents = (sec) => {
  return Array.from({ length: 30 }, (_, i) => {
    const num = i + 1;
    const student = {
      id: `${sec}-EST-${num}`,
      num: num,
      name: `Estudiante Ejemplo ${num} (${sec})`,
    };

    GRUPOS_COMPETENCIAS.forEach(grupo => {
      student[grupo.id] = {
        p1: 0, rp1: '',
        p2: 0, rp2: '',
        p3: 0, rp3: '',
        p4: 0, rp4: ''
      };
    });

    return student;
  });
};

const generateInitialGradesData = () => {
  const allSections = [...SECCIONES_POR_CICLO['1er Ciclo'], ...SECCIONES_POR_CICLO['2do Ciclo']];
  const data = {};
  allSections.forEach((sec) => {
    data[sec] = generateBaseStudents(sec);
  });
  return data;
};

export default function AdminControlPanel() {
  const [activeTab, setActiveTab] = useState('calificaciones');
  
  const [docentes, setDocentes] = useState([
    { id: 1, name: 'Juan Pérez', asignatura: 'Matemática', seccionesAsignadas: ['1A', '1B'] },
    { id: 2, name: 'Maria Rodríguez', asignatura: 'Lengua Española', seccionesAsignadas: ['1A', '2A'] },
    { id: 3, name: 'Carlos Gómez', asignatura: 'Ciencias Naturales', seccionesAsignadas: ['3A', '4A'] },
  ]);

  const [nuevoDocenteNombre, setNuevoDocenteNombre] = useState('');
  const [nuevaAsignaturaDocente, setNuevaAsignaturaDocente] = useState(ASIGNATURAS_MINERD[0]);
  const [docenteSeleccionadoId, setDocenteSeleccionadoId] = useState(1);
  
  const [toastMessage, setToastMessage] = useState(null);

  const [selectedCycle, setSelectedCycle] = useState('2do Ciclo');
  const [currentSection, setCurrentSection] = useState('5B');
  const [sectionsGrades, setSectionsGrades] = useState(generateInitialGradesData);
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fileInputRef = useRef(null);
  
  const docenteActual = docentes.find(d => d.id === Number(docenteSeleccionadoId)) || docentes[0];
  const students = sectionsGrades[currentSection] || generateBaseStudents(currentSection);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!nuevoDocenteNombre.trim()) {
      showNotification('Por favor ingrese el nombre del docente.');
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: nuevoDocenteNombre.trim(),
      asignatura: nuevaAsignaturaDocente,
      seccionesAsignadas: ['1A']
    };

    setDocentes([newDoc, ...docentes]);
    setDocenteSeleccionadoId(newDoc.id);
    setNuevoDocenteNombre('');
    showNotification(`¡Docente ${newDoc.name} registrado con éxito!`);
  };

  const handleGradeChange = (studentId, grupoId, field, value) => {
    setSectionsGrades(prev => {
      const currentList = prev[currentSection] || generateBaseStudents(currentSection);
      const secStudents = currentList.map(st => {
        if (st.id === studentId) {
          const grupoData = { ...st[grupoId] };
          if (field.startsWith('rp')) {
            grupoData[field] = value;
          } else {
            grupoData[field] = Math.max(0, Math.min(100, Number(value) || 0));
          }
          return { ...st, [grupoId]: grupoData };
        }
        return st;
      });
      return { ...prev, [currentSection]: secStudents };
    });
  };

  const getEffectivePeriodScore = (pVal, rpVal) => {
    const rpNum = Number(rpVal);
    if (rpVal !== '' && !isNaN(rpNum)) {
      return Math.max(pVal, rpNum);
    }
    return pVal;
  };

  const calculateGroupFinal = (st, grupoId) => {
    const g = st[grupoId];
    if (!g) return 0;
    const ef1 = getEffectivePeriodScore(g.p1, g.rp1);
    const ef2 = getEffectivePeriodScore(g.p2, g.rp2);
    const ef3 = getEffectivePeriodScore(g.p3, g.rp3);
    const ef4 = getEffectivePeriodScore(g.p4, g.rp4);
    return Math.round((ef1 + ef2 + ef3 + ef4) / 4);
  };

  const calculateOverallFinal = (st) => {
    const cf1 = calculateGroupFinal(st, 'ce1');
    const cf2 = calculateGroupFinal(st, 'ce2_ce3');
    const cf3 = calculateGroupFinal(st, 'ce4_ce7');
    const cf4 = calculateGroupFinal(st, 'ce5_ce6');
    return Math.round((cf1 + cf2 + cf3 + cf4) / 4);
  };

  const handleDeleteStudent = (studentId) => {
    setSectionsGrades(prev => {
      const currentList = prev[currentSection] || generateBaseStudents(currentSection);
      const filtered = currentList.filter(st => st.id !== studentId);
      const reindexed = filtered.map((st, idx) => ({ ...st, num: idx + 1 }));
      return { ...prev, [currentSection]: reindexed };
    });
    showNotification('Estudiante eliminado correctamente.');
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const currentList = sectionsGrades[currentSection] || generateBaseStudents(currentSection);
    const newNum = currentList.length + 1;
    const newStudent = {
      id: `${currentSection}-EST-${Date.now()}`,
      num: newNum,
      name: newStudentName.trim(),
    };

    GRUPOS_COMPETENCIAS.forEach(grupo => {
      newStudent[grupo.id] = { p1: 0, rp1: '', p2: 0, rp2: '', p3: 0, rp3: '', p4: 0, rp4: '' };
    });

    setSectionsGrades(prev => ({
      ...prev,
      [currentSection]: [...currentList, newStudent]
    }));

    setNewStudentName('');
    setShowAddModal(false);
    showNotification(`¡Estudiante agregado a la sección ${currentSection}!`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
      const currentList = sectionsGrades[currentSection] || generateBaseStudents(currentSection);
      
      const importedStudents = lines.map((line, idx) => {
        const parts = line.split(',');
        const name = parts[parts.length - 1].replace(/"/g, '').trim();
        const num = currentList.length + idx + 1;
        
        const st = {
          id: `${currentSection}-IMP-${Date.now()}-${idx}`,
          num: num,
          name: name || `Estudiante ${num}`
        };

        GRUPOS_COMPETENCIAS.forEach(grupo => {
          st[grupo.id] = { p1: 0, rp1: '', p2: 0, rp2: '', p3: 0, rp3: '', p4: 0, rp4: '' };
        });

        return st;
      });

      if (importedStudents.length > 0) {
        setSectionsGrades(prev => ({
          ...prev,
          [currentSection]: [...currentList, ...importedStudents]
        }));
        showNotification(`¡Se importaron ${importedStudents.length} estudiantes a la sección ${currentSection}!`);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleDownloadCSV = () => {
    let csv = `\uFEFFN°,ID,Estudiante`;
    GRUPOS_COMPETENCIAS.forEach(g => {
      csv += `,${g.title} P1,${g.title} RP1,${g.title} P2,${g.title} RP2,${g.title} P3,${g.title} RP3,${g.title} P4,${g.title} RP4,${g.title} CF`;
    });
    csv += `,Calificación Final Global,Sección,Docente,Asignatura\n`;

    students.forEach(st => {
      csv += `${st.num},"${st.id}","${st.name}"`;
      GRUPOS_COMPETENCIAS.forEach(g => {
        const gp = st[g.id];
        const gcf = calculateGroupFinal(st, g.id);
        csv += `,${gp.p1},"${gp.rp1}",${gp.p2},"${gp.rp2}",${gp.p3},"${gp.rp3}",${gp.p4},"${gp.rp4}",${gcf}`;
      });
      csv += `,${calculateOverallFinal(st)},"${currentSection}","${docenteActual.name}","${docenteActual.asignatura}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registro_${currentSection}_${docenteActual.asignatura.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  const approvedCount = students.filter(st => calculateOverallFinal(st) >= 70).length;
  const processCount = students.length - approvedCount;
  const totalMatriculaGlobal = 33 * 30;

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans space-y-6 relative" suppressHydrationWarning>
      
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-400/30 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER INSTITUCIONAL */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Liceo Emiliano Tejera — Salcedo
          </span>
          <h1 className="text-2xl font-black mt-1">Plataforma de Gestión Educativa (MINERD)</h1>
          <p className="text-xs text-slate-400">Año Escolar 2026-2027</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('docentes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'docentes' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            👨‍🏫 Panel Docentes & Registro
          </button>
          <button
            onClick={() => setActiveTab('calificaciones')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'calificaciones' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            📝 Planillas de Notas
          </button>
        </div>
      </div>

      {activeTab === 'docentes' ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                  Control Activo del Profesor
                </span>
                <h2 className="text-xl font-black">Seleccione el Docente Operando</h2>
                <p className="text-xs text-slate-300">Cada sección cuenta con un cupo estándar de 30 estudiantes matriculados.</p>
              </div>

              <div className="w-full md:w-72">
                <label className="block text-[11px] font-bold text-amber-300 mb-1">Docente en Sesión:</label>
                <select
                  value={docenteSeleccionadoId}
                  onChange={(e) => setDocenteSeleccionadoId(e.target.value)}
                  className="w-full bg-white text-slate-950 font-black text-xs p-3 rounded-xl border border-amber-400 focus:outline-none shadow"
                >
                  {docentes.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — ({doc.asignatura})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10 mt-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <span className="block text-[10px] uppercase font-bold text-amber-300">Estudiantes por Sección</span>
                <span className="text-lg font-black text-white">30 Estudiantes</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <span className="block text-[10px] uppercase font-bold text-sky-300">Secciones Totales</span>
                <span className="text-lg font-black text-white">33 Secciones</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <span className="block text-[10px] uppercase font-bold text-emerald-300">Matrícula Estimada Global</span>
                <span className="text-lg font-black text-white">{totalMatriculaGlobal} Estudiantes</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4 lg:col-span-1">
              <h3 className="font-black text-slate-900 text-sm uppercase border-b pb-2 flex items-center gap-2">
                <span>➕</span> Registrar Nuevo Docente
              </h3>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    placeholder="Ej. Ana Mercedes"
                    value={nuevoDocenteNombre}
                    onChange={(e) => setNuevoDocenteNombre(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asignatura / Área:</label>
                  <select
                    value={nuevaAsignaturaDocente}
                    onChange={(e) => setNuevaAsignaturaDocente(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:border-amber-500"
                  >
                    {ASIGNATURAS_MINERD.map((asig) => (
                      <option key={asig} value={asig}>{asig}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Guardar y Activar Docente
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                  <span>📋</span> Directorio de Docentes ({docentes.length})
                </h3>
                <button
                  onClick={() => setActiveTab('calificaciones')}
                  className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition"
                >
                  Ir a calificar con {docenteActual.name} →
                </button>
              </div>

              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0">
                    <tr>
                      <th className="p-3 border-b">#</th>
                      <th className="p-3 border-b">Docente</th>
                      <th className="p-3 border-b">Asignatura</th>
                      <th className="p-3 border-b text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {docentes.map((doc, index) => (
                      <tr key={doc.id} className={`hover:bg-slate-50 transition ${doc.id === Number(docenteSeleccionadoId) ? 'bg-amber-50/60' : ''}`}>
                        <td className="p-3 font-bold text-slate-400">{index + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{doc.name}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md text-[11px] border border-indigo-200">
                            {doc.asignatura}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setDocenteSeleccionadoId(doc.id);
                              setActiveTab('calificaciones');
                            }}
                            className="bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px]"
                          >
                            Calificar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <span className="block text-[10px] text-amber-400 uppercase font-bold">Docente Evaluando:</span>
              <span className="text-sm font-black">{docenteActual.name}</span>
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <span className="block text-[10px] text-sky-400 uppercase font-bold">Asignatura Oficial:</span>
              <span className="text-sm font-black">{docenteActual.asignatura}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Ciclo:</label>
                <select
                  value={selectedCycle}
                  onChange={(e) => {
                    const newCycle = e.target.value;
                    setSelectedCycle(newCycle);
                    setCurrentSection(SECCIONES_POR_CICLO[newCycle][0]);
                  }}
                  className="w-full bg-slate-800 text-white font-bold text-xs rounded-lg p-2 border border-slate-700 focus:outline-none"
                >
                  <option value="1er Ciclo">1er Ciclo</option>
                  <option value="2do Ciclo">2do Ciclo</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-amber-400 mb-1">Sección (30 Est.):</label>
                <select
                  value={currentSection}
                  onChange={(e) => setCurrentSection(e.target.value)}
                  className="w-full bg-amber-400 text-slate-950 font-black text-xs p-2 rounded-lg border border-amber-500 focus:outline-none"
                >
                  {SECCIONES_POR_CICLO[selectedCycle].map(sec => (
                    <option key={sec} value={sec}>Sección {sec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-700 font-semibold">
              📚 Sección Activa: <strong className="text-slate-900">{currentSection}</strong> | Estudiantes matriculados: <strong className="text-slate-900">{students.length}</strong>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span><span>Agregar Estudiante</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, .txt"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>📂</span><span>Importar Listado</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>📥</span><span>Descargar CSV</span>
              </button>
            </div>
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-black text-slate-900 text-sm uppercase">Agregar Estudiante (Sección {currentSection})</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo:</label>
                    <input
                      type="text"
                      placeholder="Ej. Pérez Gómez, Juan"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-200 text-slate-800 font-bold z-20 shadow-sm">
                <tr>
                  <th className="p-3 border-b border-r border-slate-300 bg-slate-300 sticky left-0 z-30">N°</th>
                  <th className="p-3 border-b border-r border-slate-300 bg-slate-300 sticky left-10 z-30 min-w-[180px]">Estudiante</th>
                  <th className="p-3 border-b border-r border-slate-300 bg-slate-300 text-center">Acción</th>
                  
                  {GRUPOS_COMPETENCIAS.map((grupo) => (
                    <th key={grupo.id} colSpan="9" className={`p-2 text-center border border-slate-300 ${grupo.color}`}>
                      {grupo.title}
                    </th>
                  ))}
                  <th className="p-3 text-center border-b border-slate-300 bg-blue-950 text-white">CF Global</th>
                </tr>
                <tr>
                  <th className="p-2 border-r border-slate-300 bg-slate-200 sticky left-0 z-30"></th>
                  <th className="p-2 border-r border-slate-300 bg-slate-200 sticky left-10 z-30"></th>
                  <th className="p-2 border-r border-slate-300 bg-slate-200"></th>
                  
                  {GRUPOS_COMPETENCIAS.map((grupo) => (
                    <React.Fragment key={`${grupo.id}-sub`}>
                      <th className="p-1.5 text-center border border-slate-300 bg-white">P1</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-amber-50">RP1</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-white">P2</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-amber-50">RP2</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-white">P3</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-amber-50">RP3</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-white">P4</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-amber-50">RP4</th>
                      <th className="p-1.5 text-center border border-slate-300 bg-slate-300 font-bold">CF</th>
                    </React.Fragment>
                  ))}
                  <th className="p-2 text-center bg-blue-900 text-white">Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((st) => {
                  const overallFinal = calculateOverallFinal(st);
                  const isApproved = overallFinal >= 70;

                  return (
                    <tr key={st.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-2.5 font-bold text-slate-500 border-r border-slate-200 bg-slate-100 sticky left-0 z-10 text-center">{st.num}</td>
                      <td className="p-2.5 font-semibold text-slate-800 border-r border-slate-200 bg-white sticky left-10 z-10">{st.name}</td>
                      
                      <td className="p-2 text-center border-r border-slate-200 bg-white">
                        <button
                          onClick={() => handleDeleteStudent(st.id)}
                          title="Eliminar estudiante"
                          className="bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 p-1.5 rounded-lg transition text-xs font-bold"
                        >
                          🗑️
                        </button>
                      </td>

                      {GRUPOS_COMPETENCIAS.map((grupo) => {
                        const gData = st[grupo.id] || { p1: 0, rp1: '', p2: 0, rp2: '', p3: 0, rp3: '', p4: 0, rp4: '' };
                        const groupFinal = calculateGroupFinal(st, grupo.id);

                        return (
                          <React.Fragment key={`${st.id}-${grupo.id}`}>
                            <td className="p-1 text-center border border-slate-200">
                              <input type="number" min="0" max="100" value={gData.p1 ?? ''}
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'p1', e.target.value)}
                                className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200 bg-amber-50/30">
                              <input type="number" min="0" max="100" value={gData.rp1 ?? ''} placeholder="--"
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp1', e.target.value)}
                                className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200">
                              <input type="number" min="0" max="100" value={gData.p2 ?? ''}
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'p2', e.target.value)}
                                className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200 bg-amber-50/30">
                              <input type="number" min="0" max="100" value={gData.rp2 ?? ''} placeholder="--"
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp2', e.target.value)}
                                className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200">
                              <input type="number" min="0" max="100" value={gData.p3 ?? ''}
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'p3', e.target.value)}
                                className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200 bg-amber-50/30">
                              <input type="number" min="0" max="100" value={gData.rp3 ?? ''} placeholder="--"
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp3', e.target.value)}
                                className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200">
                              <input type="number" min="0" max="100" value={gData.p4 ?? ''}
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'p4', e.target.value)}
                                className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1 text-center border border-slate-200 bg-amber-50/30">
                              <input type="number" min="0" max="100" value={gData.rp4 ?? ''} placeholder="--"
                                onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp4', e.target.value)}
                                className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                            </td>
                            <td className="p-1.5 text-center border border-slate-200 font-black bg-slate-200 text-slate-900">
                              {groupFinal}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      <td className={`p-2.5 text-center font-black border border-slate-200 ${isApproved ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {overallFinal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 bg-slate-100 p-4 rounded-xl border border-slate-200">
            <div>📊 Estudiantes en Sección: <strong className="text-slate-900">{students.length}</strong></div>
            <div>✅ Aprobados (>=70): <strong className="text-emerald-700">{approvedCount}</strong></div>
            <div>⚠️ En Proceso (<70): <strong className="text-amber-700">{processCount}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}