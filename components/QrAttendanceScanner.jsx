import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

// Generador de secciones según el ciclo seleccionado
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

const generateQrUrl = (name, id) => {
  const encodedData = encodeURIComponent(`ESTUDIANTE: ${name} | ID: ${id}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
};

// Generación inicial de datos base de estudiantes (hasta 30 por sección)
const generateBaseStudents = (sec) => {
  return Array.from({ length: 30 }, (_, i) => {
    const studentNum = i + 1;
    const studentId = `${sec}-EST-${studentNum.toString().padStart(2, '0')}`;
    const name = `Estudiante ${studentNum} (${sec})`;
    return {
      id: studentId,
      num: studentNum,
      name: name,
      qrUrl: generateQrUrl(name, studentId)
    };
  });
};

const generateInitialSectionsData = () => {
  const allSections = [...SECCIONES_POR_CICLO['1er Ciclo'], ...SECCIONES_POR_CICLO['2do Ciclo']];
  const data = {};

  allSections.forEach((sec) => {
    const baseStudents = generateBaseStudents(sec);
    const initialSessionId = `S1-D1`;
    
    data[sec] = {
      students: baseStudents,
      sessions: [
        {
          id: initialSessionId,
          title: 'Pase 1 (Semana 1)',
          date: new Date().toLocaleDateString(),
          records: baseStudents.reduce((acc, st) => {
            acc[st.id] = { status: 'Ausente', time: '--:--' };
            return acc;
          }, {})
        }
      ]
    };
  });

  return data;
};

export default function QrAttendanceScanner() {
  const [subject, setSubject] = useState('Lengua Española');
  const [teacherName, setTeacherName] = useState('Docente');
  const [selectedCycle, setSelectedCycle] = useState('1er Ciclo');
  
  const [sectionsData, setSectionsData] = useState(generateInitialSectionsData);
  const [currentSection, setCurrentSection] = useState('1A');
  
  const [activeSessionId, setActiveSessionId] = useState('S1-D1');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const html5QrcodeScannerRef = useRef(null);

  const handleCycleChange = (e) => {
    const newCycle = e.target.value;
    setSelectedCycle(newCycle);
    const firstSecOfCycle = SECCIONES_POR_CICLO[newCycle][0];
    setCurrentSection(firstSecOfCycle);
    setSelectedStudent(null);
    if (sectionsData[firstSecOfCycle] && sectionsData[firstSecOfCycle].sessions.length > 0) {
      setActiveSessionId(sectionsData[firstSecOfCycle].sessions[0].id);
    }
  };

  const handleSectionChange = (newSec) => {
    setCurrentSection(newSec);
    setSelectedStudent(null);
    const secSessions = sectionsData[newSec]?.sessions || [];
    if (secSessions.length > 0) {
      setActiveSessionId(secSessions[0].id);
    }
  };

  const sectionObj = sectionsData[currentSection] || { students: [], sessions: [] };
  const students = sectionObj.students;
  const sessions = sectionObj.sessions;

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || { records: {} };
  const records = currentSession.records || {};

  const presentCount = students.filter(s => records[s.id]?.status === 'Presente').length;
  const lateCount = students.filter(s => records[s.id]?.status === 'Tardanza').length;
  const absentCount = students.filter(s => records[s.id]?.status === 'Ausente' || !records[s.id]).length;

  // Añadir un nuevo pase de lista (+)
  const handleAddSession = () => {
    const nextSessionNum = sessions.length + 1;
    const newId = `sesion-${Date.now()}`;
    const newTitle = `Pase ${nextSessionNum} (${new Date().toLocaleDateString()})`;
    
    const freshRecords = students.reduce((acc, st) => {
      acc[st.id] = { status: 'Ausente', time: '--:--' };
      return acc;
    }, {});

    setSectionsData(prev => {
      const currentSecData = prev[currentSection];
      return {
        ...prev,
        [currentSection]: {
          ...currentSecData,
          sessions: [
            ...currentSecData.sessions,
            { id: newId, title: newTitle, date: new Date().toLocaleDateString(), records: freshRecords }
          ]
        }
      };
    });
    setActiveSessionId(newId);
  };

  // Borrar / Deshacer la sesión activa actual (elimina el pase de lista actual)
  const handleDeleteCurrentSession = () => {
    if (sessions.length <= 1) {
      alert('⚠️ No se puede eliminar el único pase de lista disponible en esta sección.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el pase de lista "${currentSession.title}"? Esta acción no se puede deshacer.`)) {
      setSectionsData(prev => {
        const secData = prev[currentSection];
        const updatedSessions = secData.sessions.filter(s => s.id !== activeSessionId);
        return {
          ...prev,
          [currentSection]: {
            ...secData,
            sessions: updatedSessions
          }
        };
      });
      // Cambiar al primer pase restante
      const remainingSessions = sessions.filter(s => s.id !== activeSessionId);
      setActiveSessionId(remainingSessions[0].id);
    }
  };

  // Marcar estado de un estudiante en la sesión activa
  const markAttendance = (studentId, newStatus) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setSectionsData(prev => {
      const secData = prev[currentSection];
      const updatedSessions = secData.sessions.map(ses => {
        if (ses.id === activeSessionId) {
          return {
            ...ses,
            records: {
              ...ses.records,
              [studentId]: {
                status: newStatus,
                time: newStatus === 'Ausente' ? '--:--' : timeNow
              }
            }
          };
        }
        return ses;
      });

      return {
        ...prev,
        [currentSection]: { ...secData, sessions: updatedSessions }
      };
    });
  };

  const markAllPresent = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setSectionsData(prev => {
      const secData = prev[currentSection];
      const updatedSessions = secData.sessions.map(ses => {
        if (ses.id === activeSessionId) {
          const updatedRecords = {};
          students.forEach(st => {
            updatedRecords[st.id] = { status: 'Presente', time: timeNow };
          });
          return { ...ses, records: updatedRecords };
        }
        return ses;
      });

      return {
        ...prev,
        [currentSection]: { ...secData, sessions: updatedSessions }
      };
    });
  };

  const toggleCameraScanner = async () => {
    if (typeof window === 'undefined') return;
    const { Html5Qrcode } = await import('html5-qrcode');

    if (isScanning) {
      if (html5QrcodeScannerRef.current) {
        await html5QrcodeScannerRef.current.stop();
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
      setIsScanning(false);
      setScanMessage('');
    } else {
      setIsScanning(true);
      setScanMessage('Iniciando cámara...');

      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode("reader");
          html5QrcodeScannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => processScannedCode(decodedText),
            () => {}
          );
          setScanMessage('📷 Escáner activo. Apunta la cámara al carnet.');
        } catch (err) {
          console.error(err);
          setScanMessage('❌ No se pudo acceder a la cámara.');
          setIsScanning(false);
        }
      }, 300);
    }
  };

  const processScannedCode = (decodedText) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const matchedStudent = students.find(s => decodedText.includes(s.id) || decodedText.includes(s.name));

    if (matchedStudent) {
      markAttendance(matchedStudent.id, 'Presente');
      setScanMessage(`✅ ¡Registrado (${currentSession.title}): ${matchedStudent.name} (${timeNow})`);
    } else {
      setScanMessage(`⚠️ El estudiante escaneado no pertenece a la sección ${currentSection}.`);
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrcodeScannerRef.current && isScanning) {
        html5QrcodeScannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const processStudentList = (rawNames) => {
      const newStudents = rawNames.filter(Boolean).slice(0, 30).map((name, idx) => {
        const studentNum = idx + 1;
        const cleanName = String(name).trim();
        const studentId = `${currentSection}-IMP-${studentNum.toString().padStart(2, '0')}`;
        return {
          id: studentId,
          num: studentNum,
          name: cleanName,
          qrUrl: generateQrUrl(cleanName, studentId)
        };
      });

      if (newStudents.length > 0) {
        const freshRecords = newStudents.reduce((acc, st) => {
          acc[st.id] = { status: 'Ausente', time: '--:--' };
          return acc;
        }, {});

        setSectionsData(prev => ({
          ...prev,
          [currentSection]: {
            students: newStudents,
            sessions: [
              {
                id: `sesion-imp-${Date.now()}`,
                title: 'Pase 1 (Importado)',
                date: new Date().toLocaleDateString(),
                records: freshRecords
              }
            ]
          }
        }));
        setActiveSessionId(`sesion-imp-${Date.now()}`);
        alert(`¡Se importaron ${newStudents.length} estudiantes en la sección ${currentSection}!`);
      }
    };

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processStudentList(json.flat());
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split(/\r?\n/).filter(line => line.trim() !== '');
        processStudentList(lines);
      };
      reader.readAsText(file);
    }
  };

  const printQrCards = (targetStudents) => {
    const printWindow = window.open('', '_blank');
    const cardsHtml = targetStudents.map(s => `
      <div style="border: 2px dashed #1e293b; border-radius: 12px; padding: 12px; width: 180px; text-align: center; font-family: sans-serif; page-break-inside: avoid; background: #ffffff;">
        <span style="font-size: 9px; font-weight: bold; background: #f59e0b; color: #0f172a; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Carnet QR</span>
        <h4 style="margin: 8px 0 2px 0; font-size: 13px; color: #0f172a; font-weight: bold;">${s.name}</h4>
        <p style="margin: 0 0 8px 0; font-size: 10px; color: #64748b; font-family: monospace;">Sección: ${currentSection} | ID: ${s.id}</p>
        <img src="${s.qrUrl}" alt="QR" style="width: 130px; height: 130px; margin: 0 auto; display: block;" />
        <p style="margin: 6px 0 0 0; font-size: 8px; color: #475569;">Pase de Lista Digital</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Carnets QR - Sección ${currentSection}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; background: #fff; }
            .grid { display: flex; flex-wrap: wrap; gap: 15px; justify-content: start; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h2 style="font-size: 18px; margin-bottom: 5px;">Carnets QR - Sección ${currentSection}</h2>
          <p style="font-size: 12px; margin-bottom: 15px; color: #475569;">Asignatura: ${subject} | Ciclo: ${selectedCycle}</p>
          <div class="grid">${cardsHtml}</div>
          <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getReportData = () => {
    const subjectTitle = `Reporte Asistencia - ${subject} - Sección ${currentSection} (${currentSession.title})`;
    const text = `📋 REPORTE DE ASISTENCIA (${currentSession.title})\n` +
      `👤 Docente: ${teacherName}\n` +
      `📚 Asignatura: ${subject}\n` +
      `🏫 Ciclo: ${selectedCycle} | Sección: ${currentSection}\n` +
      `📊 Resumen: Presentes: ${presentCount} | Tardanzas: ${lateCount} | Ausentes: ${absentCount}\n` +
      `-----------------------------------\n` +
      students.map(s => {
        const rec = records[s.id] || { status: 'Ausente', time: '--:--' };
        return `• ${s.name}: [${rec.status}] (${rec.time})`;
      }).join('\n');
    
    return { subjectTitle, text };
  };

  const handleShare = async () => {
    const { subjectTitle, text } = getReportData();
    if (navigator.share) {
      try {
        await navigator.share({ title: subjectTitle, text: text });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('📋 Reporte copiado al portapapeles.');
    }
  };

  const handleDownload = () => {
    let csv = `\uFEFFID,Estudiante,Sesión,Estado,Hora,Sección\n`;
    sessions.forEach(ses => {
      students.forEach(s => {
        const rec = ses.records[s.id] || { status: 'Ausente', time: '--:--' };
        csv += `"${s.id}","${s.name}","${ses.title}","${rec.status}","${rec.time}","${currentSection}"\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asistencia_Completa_Seccion_${currentSection}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 font-sans space-y-6">
      
      {/* PANEL DE CONFIGURACIÓN DEL DOCENTE */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-black text-amber-400 text-sm uppercase tracking-wider">
            ⚙️ Configuración de Práctica Pedagógica
          </h3>
          <span className="text-[11px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-md">
            Perfil del Docente
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
              placeholder="Nombre del Docente"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Asignatura:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs rounded-lg p-2 focus:outline-none focus:border-amber-400"
              placeholder="Ej. Matemática, Lengua Española..."
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
            <label className="block text-[11px] font-bold text-amber-400 mb-1">Sección Correspondiente:</label>
            <select
              value={currentSection}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full bg-amber-400 text-slate-950 font-black text-xs p-2 rounded-lg border border-amber-500 focus:outline-none"
            >
              {SECCIONES_POR_CICLO[selectedCycle].map(sec => (
                <option key={sec} value={sec}>Sección {sec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Header Resumen */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-amber-600 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            {selectedCycle} — Sección {currentSection}
          </span>
          <h2 className="text-2xl font-black mt-1">{subject}</h2>
          <p className="text-xs text-blue-100">Docente: {teacherName} | Pase de lista digital semanal y control QR</p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/20 text-right">
          <span className="block text-[10px] uppercase font-bold text-amber-300">Sesión Activa</span>
          <span className="text-base font-black text-white">{currentSession.title}</span>
        </div>
      </div>

      {/* GESTOR DE PASES DE LISTA MÚLTIPLES (CON BOTONES DE AGREGAR Y BORRAR) */}
      <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-xs text-slate-800 uppercase tracking-wide">
              📅 Pases de Lista de la Asignatura (Hasta 5 por semana / 10 Meses)
            </h3>
            <p className="text-[11px] text-slate-600">
              Selecciona una sesión, añade una nueva con <b>"+"</b> o borra el pase activo con el botón de deshacer/eliminar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteCurrentSession}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              title="Borrar o deshacer este pase de lista activo"
            >
              <span>🗑️ Borrar Pase Actual</span>
            </button>
            <button
              onClick={handleAddSession}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              title="Agregar nuevo pase de lista"
            >
              <span className="text-base leading-none">＋</span>
              <span>Nuevo Pase</span>
            </button>
          </div>
        </div>

        {/* Pestañas de sesiones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {sessions.map((ses, idx) => {
            const isActive = ses.id === activeSessionId;
            return (
              <button
                key={ses.id}
                onClick={() => setActiveSessionId(ses.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border shadow-sm ${
                  isActive
                    ? 'bg-blue-950 text-amber-400 border-blue-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Pase {idx + 1}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-400 text-blue-950' : 'bg-slate-100 text-slate-500'}`}>
                  {ses.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex justify-between items-center">
          <span className="text-xs font-bold text-emerald-800">Presentes ({currentSession.title})</span>
          <span className="text-xl font-black text-emerald-900">{presentCount}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex justify-between items-center">
          <span className="text-xs font-bold text-amber-800">Tardanzas ({currentSession.title})</span>
          <span className="text-xl font-black text-amber-900">{lateCount}</span>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex justify-between items-center">
          <span className="text-xs font-bold text-rose-800">Ausentes ({currentSession.title})</span>
          <span className="text-xl font-black text-rose-900">{absentCount}</span>
        </div>
      </div>

      {/* PANEL DE ESCÁNER DE CÁMARA */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <span>📷 Escáner QR con Cámara ({currentSession.title})</span>
            </h3>
            <p className="text-xs text-slate-300">Escanea los carnets para registrar la asistencia en este pase de lista específico.</p>
          </div>
          <button
            onClick={toggleCameraScanner}
            className={`${isScanning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-black px-4 py-2.5 rounded-lg transition shadow flex items-center gap-2`}
          >
            {isScanning ? '⏹️ Detener Cámara' : '📷 Abrir Cámara y Escanear'}
          </button>
        </div>

        {isScanning && (
          <div className="flex flex-col items-center justify-center space-y-3 bg-black/40 p-4 rounded-xl border border-slate-700">
            <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-amber-400"></div>
            {scanMessage && (
              <div className="text-xs font-bold text-amber-300 bg-slate-800 px-3 py-1.5 rounded-md border border-amber-400/30 text-center">
                {scanMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRA DE ACCIONES MASIVAS, DESCARGAR Y COMPARTIR */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={markAllPresent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5"
            >
              <span>✅ Marcar Todos Presentes</span>
            </button>
            <label className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition shadow flex items-center gap-1.5">
              <span>📥 Importar Listado</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv, .docx, .pdf, .txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => printQrCards(students)}
              className="bg-amber-500 hover:bg-amber-600 text-blue-950 text-xs font-black px-3.5 py-2 rounded-lg transition shadow"
            >
              🖨️ Imprimir QRs
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
            >
              <span>📥 Descargar (Todos los Pases)</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
            >
              <span>🔗 Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLA DE ESTUDIANTES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-200 text-slate-700 font-bold z-10">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Estudiante ({currentSession.title})</th>
                <th className="p-3 text-center">Hora</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Carnet QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((st) => {
                const rec = records[st.id] || { status: 'Ausente', time: '--:--' };
                return (
                  <tr key={st.id} className="hover:bg-blue-50/50 transition">
                    <td className="p-3 font-mono font-bold text-slate-500">{st.num}</td>
                    <td className="p-3 font-semibold text-slate-800">{st.name}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">{rec.time}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-sm">
                        <button
                          onClick={() => markAttendance(st.id, 'Presente')}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${rec.status === 'Presente' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          Presente
                        </button>
                        <button
                          onClick={() => markAttendance(st.id, 'Tardanza')}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${rec.status === 'Tardanza' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          Tardanza
                        </button>
                        <button
                          onClick={() => markAttendance(st.id, 'Ausente')}
                          className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${rec.status === 'Ausente' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          Ausente
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow"
                      >
                        Ver QR
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Panel QR Individual */}
        <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          {selectedStudent ? (
            <>
              <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Carnet Digital - Sección {currentSection}
              </span>
              <div>
                <h4 className="font-bold text-base text-white">{selectedStudent.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedStudent.id}</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-amber-400">
                <img src={selectedStudent.qrUrl} alt={`QR ${selectedStudent.name}`} className="w-36 h-36" />
              </div>
              <button
                onClick={() => printQrCards([selectedStudent])}
                className="bg-emerald-500 hover:bg-emerald-600 text-blue-950 font-black text-xs px-4 py-2 rounded-xl shadow transition"
              >
                🖨️ Imprimir Este Carnet
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">🪪</div>
              <p className="text-xs text-slate-400">
                Haz clic en <b>"Ver QR"</b> para inspeccionar e imprimir el carnet de un estudiante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}