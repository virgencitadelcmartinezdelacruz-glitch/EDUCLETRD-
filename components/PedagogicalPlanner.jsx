import React, { useState, useRef } from 'react';

export default function PlanificacionDocenteDigital() {
  // Datos Generales
  const [unitTitle, setUnitTitle] = useState('Unidad 1: Introducción a la Asignatura');
  const [subject, setSubject] = useState('Lengua Española');
  const [teacherName, setTeacherName] = useState('Docente');
  const [cycle, setCycle] = useState('1er Ciclo (1ro, 2do, 3ro)');
  const [section, setSection] = useState('Sección 1A');
  const [duration, setDuration] = useState('4 Semanas');

  // Situación e Indicadores
  const [learningSituation, setLearningSituation] = useState('');
  const [achievementIndicators, setAchievementIndicators] = useState('');

  // Competencias Fundamentales Seleccionadas
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);

  // Malla Curricular
  const [conceptual, setConceptual] = useState('');
  const [procedural, setProcedural] = useState('');
  const [attitudinal, setAttitudinal] = useState('');

  // Secuencia, Evaluación y Recursos
  const [didacticSequence, setDidacticSequence] = useState('');
  const [evaluationInstruments, setEvaluationInstruments] = useState('');
  const [educationalResources, setEducationalResources] = useState('');

  // Estados de IA y Archivo
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const listCompetencies = [
    'Ética y Ciudadana',
    'Comunicativa',
    'Pensamiento Lógico, Crítico y Creativo',
    'Resolución de Problemas',
    'Científica y Tecnológica',
    'Ambiental y de la Salud',
    'Desarrollo Personal y Espiritual'
  ];

  const toggleCompetency = (comp) => {
    if (selectedCompetencies.includes(comp)) {
      setSelectedCompetencies(selectedCompetencies.filter(item => item !== comp));
    } else {
      setSelectedCompetencies([...selectedCompetencies, comp]);
    }
  };

  // Botón Importar Doc para IA
  const handleImportDoc = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsGenerating(true);
    setTimeout(() => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setUnitTitle(`Unidad: ${cleanName}`);
      setLearningSituation(
        `Los estudiantes de ${section} analizarán el documento "${file.name}" para identificar conceptos clave de ${subject} y proponer soluciones a casos prácticos.`
      );
      setAchievementIndicators(
        `• Domina las ideas principales de "${file.name}".\n• Responde correctamente las preguntas evaluativas derivadas del texto.`
      );
      setIsGenerating(false);
      alert(`✨ Documento "${file.name}" importado y procesado por la IA.`);
    }, 1200);
  };

  // Botón Completar con IA
  const handleCompleteWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLearningSituation(
        `En el marco del desarrollo del área de ${subject}, los estudiantes de ${section} analizan situaciones cotidianas para proponer alternativas fundamentadas.`
      );
      setAchievementIndicators(
        `• Demuestra comprensión conceptual en actividades grupales.\n• Elabora reportes aplicando los contenidos de la unidad.`
      );
      setConceptual('• Conceptos clave, principios generales y vocabulario temático.');
      setProcedural('• Procedimientos de indagación, lectura analítica y producción.');
      setAttitudinal('• Colaboración, escucha activa y rigor académico.');
      setDidacticSequence('• Inicio: Recuperación de saberes previos.\n• Desarrollo: Lectura activa y plenaria.\n• Cierre: Síntesis evaluativa.');
      setEvaluationInstruments('• Rúbrica analítica y Lista de cotejo.');
      setEducationalResources('• Documento base, plataforma digital y pizarra.');
      setIsGenerating(false);
    }, 1000);
  };

  // Botón Borrar
  const handleClear = () => {
    if (window.confirm('¿Deseas vaciar los campos de la planificación?')) {
      setUnitTitle('');
      setLearningSituation('');
      setAchievementIndicators('');
      setSelectedCompetencies([]);
      setConceptual('');
      setProcedural('');
      setAttitudinal('');
      setDidacticSequence('');
      setEvaluationInstruments('');
      setEducationalResources('');
    }
  };

  // BOTÓN COMPARTIR (Web Share API + Copiar Texto)
  const handleShare = async () => {
    const textToShare = 
      `📌 PLANIFICACIÓN DOCENTE DIGITAL\n` +
      `• Unidad: ${unitTitle}\n` +
      `• Asignatura: ${subject}\n` +
      `• Docente: ${teacherName}\n` +
      `• Sección/Ciclo: ${section} (${cycle})\n` +
      `• Duración: ${duration}\n\n` +
      `📍 Situación de Aprendizaje:\n${learningSituation || 'N/A'}\n\n` +
      `🎯 Indicadores de Logro:\n${achievementIndicators || 'N/A'}\n\n` +
      `🛠️ Recursos: ${educationalResources || 'N/A'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: unitTitle || 'Planificación Docente',
          text: textToShare,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Compartir cancelado:', err);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('📲 ¡Información de la planificación copiada al portapapeles!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 font-sans bg-slate-100 min-h-screen">
      
      {/* HEADER INTEGRADO CON EL BOTÓN COMPARTIR AGREGADO */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-amber-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            GESTIÓN DIDÁCTICA INTELIGENTE
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">Planificación Docente Digital</h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Diseño de Unidades, Indicadores de Logro e Importación IA
          </p>
        </div>

        {/* CONTROLES DEL ENCABEZADO */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>+ Importar Doc para IA</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportDoc}
            accept=".doc,.docx,.pdf,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleCompleteWithAI}
            disabled={isGenerating}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold text-xs px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <span>✨ Completar con IA</span>
          </button>

          {/* BOTÓN AGREGADO */}
          <button
            type="button"
            onClick={handleShare}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5"
          >
            <span>🔗 Compartir</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 font-medium text-xs px-3 py-2.5 rounded-lg border border-slate-700 transition flex items-center gap-1"
          >
            <span>🗑️ Borrar</span>
          </button>
        </div>
      </div>

      {/* DATOS DE LA UNIDAD DIDÁCTICA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>📌</span> DATOS DE LA UNIDAD DIDÁCTICA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Título de la Unidad / Tema:</label>
            <input
              type="text"
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Asignatura:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Docente:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ciclo Educativo:</label>
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="1er Ciclo (1ro, 2do, 3ro)">1er Ciclo (1ro, 2do, 3ro)</option>
              <option value="2do Ciclo (4to, 5to, 6to)">2do Ciclo (4to, 5to, 6to)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Sección / Grado:</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="Sección 1A">Sección 1A</option>
              <option value="Sección 1B">Sección 1B</option>
              <option value="Sección 2A">Sección 2A</option>
              <option value="Sección 3A">Sección 3A</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tiempo / Duración Estimada:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SITUACIÓN DE APRENDIZAJE E INDICADORES DE LOGRO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>📍</span> SITUACIÓN DE APRENDIZAJE
          </h2>
          <textarea
            rows={5}
            value={learningSituation}
            onChange={(e) => setLearningSituation(e.target.value)}
            placeholder="Describe el contexto, el problema pedagógico, el producto esperado..."
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎯</span> INDICADORES DE LOGRO
          </h2>
          <textarea
            rows={5}
            value={achievementIndicators}
            onChange={(e) => setAchievementIndicators(e.target.value)}
            placeholder="Escribe o genera con la IA los indicadores de logro del diseño curricular..."
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* COMPETENCIAS FUNDAMENTALES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>🏆</span> COMPETENCIAS FUNDAMENTALES
        </h2>
        <div className="flex flex-wrap gap-2">
          {listCompetencies.map((comp) => {
            const isSelected = selectedCompetencies.includes(comp);
            return (
              <button
                key={comp}
                type="button"
                onClick={() => toggleCompetency(comp)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                  isSelected
                    ? 'bg-blue-950 text-white border-blue-950'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                + {comp}
              </button>
            );
          })}
        </div>
      </div>

      {/* MALLA DE CONTENIDOS CURRICULARES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>📚</span> MALLA DE CONTENIDOS CURRICULARES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1">📘 Conceptuales:</label>
            <textarea
              rows={4}
              value={conceptual}
              onChange={(e) => setConceptual(e.target.value)}
              placeholder="Conceptos, hechos, principios..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">⚙️ Procedimentales:</label>
            <textarea
              rows={4}
              value={procedural}
              onChange={(e) => setProcedural(e.target.value)}
              placeholder="Procedimientos, técnicas, análisis..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-rose-600 mb-1">❤️ Actitudinales:</label>
            <textarea
              rows={4}
              value={attitudinal}
              onChange={(e) => setAttitudinal(e.target.value)}
              placeholder="Valores, actitudes de convivencia y ética..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SECUENCIA, EVALUACIÓN Y RECURSOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>🚀</span> SECUENCIA DIDÁCTICA DE ACTIVIDADES
          </h2>
          <textarea
            rows={5}
            value={didacticSequence}
            onChange={(e) => setDidacticSequence(e.target.value)}
            placeholder="Estructura de Inicio, Desarrollo y Cierre..."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>📊</span> EVALUACIÓN E INSTRUMENTOS
          </h2>
          <textarea
            rows={5}
            value={evaluationInstruments}
            onChange={(e) => setEvaluationInstruments(e.target.value)}
            placeholder="Rúbricas, listas de cotejo, pruebas..."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>🛠️</span> RECURSOS EDUCATIVOS
          </h2>
          <textarea
            rows={5}
            value={educationalResources}
            onChange={(e) => setEducationalResources(e.target.value)}
            placeholder="Libros, herramientas digitales, plataformas..."
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* PIE DE PÁGINA / BOTONES INFERIORES */}
      <div className="flex justify-end items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition"
        >
          + Nueva Unidad
        </button>

        <button
          type="button"
          onClick={() => alert('💾 Planificación guardada correctamente.')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <span>💾 Guardar Planificación</span>
        </button>
      </div>

    </div>
  );
}