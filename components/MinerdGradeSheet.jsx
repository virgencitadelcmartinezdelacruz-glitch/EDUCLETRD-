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

const GRUPOS_COMPETENCIAS = [
  { id: 'ce1', title: 'CE1', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'ce2_ce3', title: 'CE2 Y CE3', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'ce4_ce7', title: 'CE4 Y CE7', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'ce5_ce6', title: 'CE5 Y CE6', color: 'bg-purple-100 text-purple-900 border-purple-300' },
];

const generateBaseStudents = (sec) => {
  return Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const student = {
      id: `${sec}-EST-${num.toString().padStart(2, '0')}`,
      num: num,
      name: `Estudiante ${num} (${sec})`,
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

export default function MinerdGradeSheet() {
  const [subject, setSubject] = useState('Lengua Española');
  const [teacherName, setTeacherName] = useState('Docente');
  const [selectedCycle, setSelectedCycle] = useState('1er Ciclo');
  const [currentSection, setCurrentSection] = useState('1A');

  const [sectionsGrades, setSectionsGrades] = useState(generateInitialGradesData);
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);
  const students = sectionsGrades[currentSection] || [];

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCycleChange = (e) => {
    const newCycle = e.target.value;
    setSelectedCycle(newCycle);
    setCurrentSection(SECCIONES_POR_CICLO[newCycle][0]);
  };

  const handleGradeChange = (studentId, grupoId, field, value) => {
    setSectionsGrades(prev => {
      const secStudents = prev[currentSection].map(st => {
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

  const approvedCount = students.filter(st => calculateOverallFinal(st) >= 70).length;
  const processCount = students.length - approvedCount;

  // 1. Agregar nuevo estudiante manualmente
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newNum = students.length + 1;
    const newStudent = {
      id: `${currentSection}-EST-${newNum.toString().padStart(2, '0')}`,
      num: newNum,
      name: newStudentName.trim(),
    };

    GRUPOS_COMPETENCIAS.forEach(grupo => {
      newStudent[grupo.id] = { p1: 0, rp1: '', p2: 0, rp2: '', p3: 0, rp3: '', p4: 0, rp4: '' };
    });

    setSectionsGrades(prev => ({
      ...prev,
      [currentSection]: [...prev[currentSection], newStudent]
    }));

    setNewStudentName('');
    setShowAddModal(false);
    showNotification(`¡Estudiante agregado con éxito a la sección ${currentSection}!`);
  };

  // 2. Importar listado desde archivo CSV o TXT
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
      
      const importedStudents = lines.map((line, idx) => {
        const parts = line.split(',');
        const name = parts[parts.length - 1].replace(/"/g, '').trim();
        const num = students.length + idx + 1;
        
        const st = {
          id: `${currentSection}-IMP-${num.toString().padStart(2, '0')}`,
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
          [currentSection]: [...prev[currentSection], ...importedStudents]
        }));
        showNotification(`¡Se importaron ${importedStudents.length} estudiantes correctamente a la sección ${currentSection}!`);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reiniciar input para permitir reimportar el mismo archivo si es necesario
  };

  // 3. Compartir registro
  const handleShare = async () => {
    const shareData = {
      title: 'Registro de Calificaciones MINERD',
      text: `Registro MINERD - Sección ${currentSection} | Asignatura: ${subject} | Docente: ${teacherName} | Total Estudiantes: ${students.length}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotification('¡Registro compartido exitosamente!');
      } else {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        showNotification('¡Información del registro copiada al portapapeles!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        navigator.clipboard.writeText(window.location.href);
        showNotification('¡Enlace copiado al portapapeles!');
      }
    }
  };

  const handleDownloadExcel = () => {
    let csv = `\uFEFFN°,ID,Estudiante`;
    GRUPOS_COMPETENCIAS.forEach(g => {
      csv += `,${g.title} P1,${g.title} RP1,${g.title} P2,${g.title} RP2,${g.title} P3,${g.title} RP3,${g.title} P4,${g.title} RP4,${g.title} CF`;
    });
    csv += `,Calificación Final Global,Sección\n`;

    students.forEach(st => {
      csv += `${st.num},"${st.id}","${st.name}"`;
      GRUPOS_COMPETENCIAS.forEach(g => {
        const gp = st[g.id];
        const gcf = calculateGroupFinal(st, g.id);
        csv += `,${gp.p1},"${gp.rp1}",${gp.p2},"${gp.rp2}",${gp.p3},"${gp.rp3}",${gp.p4},"${gp.rp4}",${gcf}`;
      });
      csv += `,${calculateOverallFinal(st)},"${currentSection}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registro_Competencias_Seccion_${currentSection}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 font-sans space-y-6 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-400/30 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CONFIGURACIÓN */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-black text-amber-400 text-sm uppercase tracking-wider">
            ⚙️ Configuración del Registro por Grupos de Competencias (MINERD)
          </h3>
          <span className="text-[11px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-md">
            Estructura Oficial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Docente:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Asignatura:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Ciclo Educativo:</label>
            <select
              value={selectedCycle}
              onChange={handleCycleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
            >
              <option value="1er Ciclo">1er Ciclo (1ro, 2do, 3ro)</option>
              <option value="2do Ciclo">2do Ciclo (4to, 5to, 6to)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-400 mb-1">Sección:</label>
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

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-amber-600 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            Registro Oficial — Sección {currentSection}
          </span>
          <h2 className="text-2xl font-black mt-1">Calificaciones por Grupos de Competencias</h2>
          <p className="text-xs text-blue-100">Distribución por CE1, CE2 y CE3, CE4 y CE7, CE5 y CE6 | {subject}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 text-center">
            <span className="block text-[10px] uppercase font-bold text-emerald-300">Aprobados</span>
            <span className="text-lg font-black text-white">{approvedCount}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 text-center">
            <span className="block text-[10px] uppercase font-bold text-amber-300">En Proceso</span>
            <span className="text-lg font-black text-white">{processCount}</span>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIONES Y BOTONES FUNCIONALES */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-700 font-semibold">
          💡 Sección activa: <span className="font-bold text-slate-900">{currentSection}</span> ({students.length} estudiantes registrados)
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Agregar Nueva */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕</span>
            <span>Agregar Estudiante</span>
          </button>

          {/* Input oculto para importación de archivos */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, .txt"
            className="hidden"
          />

          {/* Botón Importar Listado */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span>📂</span>
            <span>Importar Listado</span>
          </button>

          {/* Botón Compartir */}
          <button
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔗</span>
            <span>Compartir</span>
          </button>

          {/* Botón Descargar CSV */}
          <button
            onClick={handleDownloadExcel}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* MODAL AGREGAR ESTUDIANTE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm uppercase">Agregar Nuevo Estudiante (Sección {currentSection})</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Estudiante:</label>
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
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Guardar Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLA PRINCIPAL CON GRUPOS DE COMPETENCIAS */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-slate-200 text-slate-800 font-bold z-20 shadow-sm">
            <tr>
              <th className="p-3 border-b border-r border-slate-300 bg-slate-300 sticky left-0 z-30">N°</th>
              <th className="p-3 border-b border-r border-slate-300 bg-slate-300 sticky left-10 z-30 min-w-[180px]">Estudiantes</th>
              
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

                  {GRUPOS_COMPETENCIAS.map((grupo) => {
                    const gData = st[grupo.id] || { p1: 0, rp1: '', p2: 0, rp2: '', p3: 0, rp3: '', p4: 0, rp4: '' };
                    const groupFinal = calculateGroupFinal(st, grupo.id);

                    return (
                      <React.Fragment key={`${st.id}-${grupo.id}`}>
                        <td className="p-1.5 text-center border border-slate-200">
                          <input type="number" min="0" max="100" value={gData.p1}
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'p1', e.target.value)}
                            className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200 bg-amber-50/30">
                          <input type="number" min="0" max="100" value={gData.rp1} placeholder="--"
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp1', e.target.value)}
                            className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200">
                          <input type="number" min="0" max="100" value={gData.p2}
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'p2', e.target.value)}
                            className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200 bg-amber-50/30">
                          <input type="number" min="0" max="100" value={gData.rp2} placeholder="--"
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp2', e.target.value)}
                            className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200">
                          <input type="number" min="0" max="100" value={gData.p3}
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'p3', e.target.value)}
                            className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200 bg-amber-50/30">
                          <input type="number" min="0" max="100" value={gData.rp3} placeholder="--"
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp3', e.target.value)}
                            className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200">
                          <input type="number" min="0" max="100" value={gData.p4}
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'p4', e.target.value)}
                            className="w-11 text-center bg-white border border-slate-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200 bg-amber-50/30">
                          <input type="number" min="0" max="100" value={gData.rp4} placeholder="--"
                            onChange={(e) => handleGradeChange(st.id, grupo.id, 'rp4', e.target.value)}
                            className="w-11 text-center bg-amber-50/50 border border-amber-300 font-bold text-xs rounded p-1 focus:outline-none focus:border-amber-500" />
                        </td>
                        <td className="p-1.5 text-center border border-slate-200 font-mono font-bold bg-slate-100 text-slate-800">
                          {groupFinal}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  <td className={`p-2.5 text-center font-mono font-black text-sm border-l border-slate-300 ${isApproved ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                    {overallFinal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}