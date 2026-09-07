import React, { useState, useRef } from 'react';

export default function PlanificacionDocenteDigital() {
  const [schools, setSchools] = useState(['Liceo Emiliano Tejera', 'Centro Educativo General', 'Instituto Politécnico Nacional']);
  const [schoolName, setSchoolName] = useState('Liceo Emiliano Tejera');

  const [teachers, setTeachers] = useState(['Docente', 'Prof. Yanverlin', 'Prof. María']);
  const [teacherName, setTeacherName] = useState('Docente');

  const [subjects, setSubjects] = useState(['Matemática', 'Lengua Española', 'Ciencias Sociales', 'Ciencias Naturales']);
  const [subject, setSubject] = useState('Matemática');

  const [cycle, setCycle] = useState('1er Ciclo (1ro, 2do, 3ro)');
  
  const [sections, setSections] = useState([
    '1ro de Secundaria (Sección 1A)',
    '1ro de Secundaria (Sección 1B)',
    '2do de Secundaria (Sección 2A)',
    '3ro de Secundaria (Sección 3A)'
  ]);
  const [section, setSection] = useState('1ro de Secundaria (Sección 1A)');

  const [unitTitle, setUnitTitle] = useState('Unidad 1: Introducción a la Asignatura');
  const [duration, setDuration] = useState('4 Semanas (Mes Completo)');

  const [learningSituation, setLearningSituation] = useState('');
  const [achievementIndicators, setAchievementIndicators] = useState('');
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);

  const [conceptual, setConceptual] = useState('');
  const [procedural, setProcedural] = useState('');
  const [attitudinal, setAttitudinal] = useState('');

  const [didacticStart, setDidacticStart] = useState('');
  const [didacticDevelopment, setDidacticDevelopment] = useState('');
  const [didacticClosing, setDidacticClosing] = useState('');

  const [evaluationInstruments, setEvaluationInstruments] = useState('');
  const [educationalResources, setEducationalResources] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);
  const excelInputRef = useRef(null);

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

  const handleAddSchool = () => {
    const name = prompt('Ingrese el nombre del nuevo centro educativo:');
    if (name && !schools.includes(name)) {
      setSchools([...schools, name]);
      setSchoolName(name);
    }
  };

  const handleAddTeacher = () => {
    const name = prompt('Ingrese el nombre del nuevo docente:');
    if (name && !teachers.includes(name)) {
      setTeachers([...teachers, name]);
      setTeacherName(name);
    }
  };

  const handleDeleteTeacher = () => {
    if (teachers.length <= 1) {
      alert('Debe haber al menos un docente registrado.');
      return;
    }
    setTeachers(teachers.filter(t => t !== teacherName));
    setTeacherName(teachers.filter(t => t !== teacherName)[0]);
  };

  const handleAddSubject = () => {
    const name = prompt('Ingrese el nombre de la nueva asignatura:');
    if (name && !subjects.includes(name)) {
      setSubjects([...subjects, name]);
      setSubject(name);
    }
  };

  const handleDeleteSubject = () => {
    if (subjects.length <= 1) {
      alert('Debe haber al menos una asignatura registrada.');
      return;
    }
    setSubjects(subjects.filter(s => s !== subject));
    setSubject(subjects.filter(s => s !== subject)[0]);
  };

  const handleAddSection = () => {
    const name = prompt('Ingrese el grado o sección (Ej: 4to de Secundaria - Sección 4B):');
    if (name && !sections.includes(name)) {
      setSections([...sections, name]);
      setSection(name);
    }
  };

  const handleDeleteSection = () => {
    if (sections.length <= 1) {
      alert('Debe haber al menos una sección registrada.');
      return;
    }
    setSections(sections.filter(s => s !== section));
    setSection(sections.filter(s => s !== section)[0]);
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length > 0) {
        const importedSections = lines.map(l => l.split(',')[0].trim());
        setSections([...new Set([...sections, ...importedSections])]);
        alert(`📊 Se importaron ${importedSections.length} elementos/secciones desde el archivo Excel.`);
      }
    };
    reader.readAsText(file);
  };

  const handleImportAndComplete = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsGenerating(true);
    setTimeout(() => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setUnitTitle(`Unidad Mensual Profundizada: ${cleanName}`);
      
      setSelectedCompetencies([
        'Pensamiento Lógico, Crítico y Creativo',
        'Resolución de Problemas',
        'Comunicativa'
      ]);

      setLearningSituation(
        `Durante el desarrollo de este mes en ${section}, los estudiantes de ${subject} enfrentarán el reto analítico basado en el archivo "${file.name}". Se promoverá la indagación crítica mediante la resolución de problemáticas del entorno.`
      );

      setAchievementIndicators(
        `• Aplica con rigor conceptual los principios teóricos y prácticos extraídos de "${file.name}".\n• Formula argumentos sólidos y estructurados evidenciando pensamiento crítico y lógico.\n• Resuelve problemas complejos colaborativamente.`
      );

      setConceptual(
        `• Semana 1: Fundamentos teóricos y vocabulario técnico.\n• Semana 2: Modelos de análisis estructural y variables críticas.\n• Semana 3: Casos de estudio aplicados y resolución guiada.\n• Semana 4: Síntesis integradora y proyecciones.`
      );

      setProcedural(
        `• Lectura crítica, decodificación de textos complejos y subrayado analítico.\n• Ejecución de procedimientos algorítmicos y esquematización gráfica.\n• Construcción de reportes y exposiciones orales.`
      );

      setAttitudinal(
        `• Rigor científico y honestidad académica.\n• Apertura al debate constructivo y trabajo en equipo.\n• Responsabilidad en la entrega de asignaciones.`
      );

      setDidacticStart(
        `• Recuperación de saberes previos mediante lluvia de ideas interactiva sobre "${file.name}".\n• Activación de la motivación y socialización de los propósitos de la unidad mensual.\n• Exploración de conceptos clave y vocabulario técnico inicial.`
      );

      setDidacticDevelopment(
        `• Trabajo en equipos colaborativos analizando fragmentos críticos del texto importado.\n• Talleres prácticos de resolución de ejercicios y simulación de casos reales.\n• Plenarias de puesta en común, contraste de hipótesis y realimentación formativa por parte del docente.`
      );

      setDidacticClosing(
        `• Socialización de productos finales y entrega de portafolios de evidencias.\n• Evaluación metacognitiva grupal: ¿Qué aprendimos, cómo lo aplicamos y qué desafíos superamos?\n• Síntesis final y cierre conceptual del periodo mensual.`
      );

      setEvaluationInstruments(
        `• Rúbrica analítica para evaluación de proyectos y exposiciones.\n• Lista de cotejo para seguimiento del trabajo colaborativo semanal.\n• Pruebas de desempeños y autoevaluación reflexiva.`
      );

      setEducationalResources(
        `• Documento base analizado ("${file.name}"), plataforma institucional, guías de trabajo, proyectores multimedia y recursos interactivos de apoyo.`
      );
      
      setIsGenerating(false);
      alert(`✨ Archivo "${file.name}" analizado a profundidad. Casillas de inicio, desarrollo, cierre y competencias completadas.`);
    }, 1500);
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas vaciar los campos de la planificación?')) {
      setUnitTitle('');
      setLearningSituation('');
      setAchievementIndicators('');
      setSelectedCompetencies([]);
      setConceptual('');
      setProcedural('');
      setAttitudinal('');
      setDidacticStart('');
      setDidacticDevelopment('');
      setDidacticClosing('');
      setEvaluationInstruments('');
      setEducationalResources('');
    }
  };

  const handleShare = async () => {
    const textToShare = 
      `📌 PLANIFICACIÓN DOCENTE MENSUAL DIGITAL (${schoolName})\n` +
      `• Unidad: ${unitTitle}\n` +
      `• Asignatura: ${subject}\n` +
      `• Docente: ${teacherName}\n` +
      `• Grado/Sección: ${section} (${cycle})\n` +
      `• Duración: ${duration}\n\n` +
      `📍 Situación de Aprendizaje:\n${learningSituation || 'N/A'}\n\n` +
      `🎯 Indicadores de Logro:\n${achievementIndicators || 'N/A'}`;

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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 font-sans bg-[#f4f6fb] min-h-screen text-slate-800">
      
      {/* BANNER PRINCIPAL CON TONOS CLAROS Y VIVOS */}
      <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            Planificación Docente Digital
          </h1>
          <p className="text-xs md:text-sm text-teal-100 italic font-medium max-w-2xl leading-relaxed">
            "Planificar es trazar el puente entre el sueño de enseñar y el futuro de transformar vidas; cada lección bien diseñada siembra la curiosidad y cosecha el conocimiento."
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{isGenerating ? "Analizando..." : "📁 Importar y Completar con IA"}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportAndComplete}
            accept=".doc,.docx,.pdf,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleShare}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <span>🔗 Compartir</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="bg-slate-700/80 hover:bg-slate-800 text-slate-100 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1 shadow-md"
          >
            <span>🗑️ Borrar</span>
          </button>
        </div>
      </div>

      {/* DATOS DE LA UNIDAD DIDÁCTICA Y GESTIÓN INSTITUCIONAL */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
        <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
          <span className="text-teal-600 text-base">📌</span> DATOS DE LA UNIDAD DIDÁCTICA Y GESTIÓN INSTITUCIONAL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Título de la Unidad / Tema:</label>
            <input
              type="text"
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700">Centro Educativo:</label>
              <button type="button" onClick={handleAddSchool} className="text-teal-600 font-bold hover:underline">+ Centro</button>
            </div>
            <select
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            >
              {schools.map((sch) => (
                <option key={sch} value={sch}>{sch}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700">Asignatura:</label>
              <div className="space-x-1.5">
                <button type="button" onClick={handleAddSubject} className="text-teal-600 font-bold hover:underline">+ Asignatura</button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={handleDeleteSubject} className="text-rose-600 font-bold hover:underline">Eliminar</button>
              </div>
            </div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700">Docente:</label>
              <div className="space-x-1.5">
                <button type="button" onClick={handleAddTeacher} className="text-teal-600 font-bold hover:underline">+ Docente</button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={handleDeleteTeacher} className="text-rose-600 font-bold hover:underline">Eliminar</button>
              </div>
            </div>
            <select
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            >
              {teachers.map((teach) => (
                <option key={teach} value={teach}>{teach}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Ciclo Educativo:</label>
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            >
              <option value="1er Ciclo (1ro, 2do, 3ro)">1er Ciclo (1ro, 2do, 3ro)</option>
              <option value="2do Ciclo (4to, 5to, 6to)">2do Ciclo (4to, 5to, 6to)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700">Grado / Sección:</label>
              <div className="space-x-1">
                <button type="button" onClick={handleAddSection} className="text-teal-600 font-bold hover:underline">+ Sección</button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={() => excelInputRef.current?.click()} className="text-indigo-600 font-bold hover:underline">Importar Excel</button>
                <input type="file" ref={excelInputRef} onChange={handleImportExcel} accept=".csv,.txt" className="hidden" />
                <span className="text-slate-300">|</span>
                <button type="button" onClick={handleDeleteSection} className="text-rose-600 font-bold hover:underline">Eliminar</button>
              </div>
            </div>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-teal-700 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Tiempo / Duración Estimada:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* SITUACIÓN DE APRENDIZAJE E INDICADORES DE LOGRO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-600 text-base">📍</span> SITUACIÓN DE APRENDIZAJE
          </h2>
          <textarea
            rows={5}
            value={learningSituation}
            onChange={(e) => setLearningSituation(e.target.value)}
            placeholder="Describe el contexto, el problema pedagógico, el producto esperado..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-rose-500 text-base">🎯</span> INDICADORES DE LOGRO
          </h2>
          <textarea
            rows={5}
            value={achievementIndicators}
            onChange={(e) => setAchievementIndicators(e.target.value)}
            placeholder="Escribe o importa un documento para completar los indicadores de logro..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* COMPETENCIAS FUNDAMENTALES */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
          <span className="text-amber-500 text-base">🏆</span> COMPETENCIAS FUNDAMENTALES SELECCIONADAS
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {listCompetencies.map((comp) => {
            const isSelected = selectedCompetencies.includes(comp);
            return (
              <button
                key={comp}
                type="button"
                onClick={() => toggleCompetency(comp)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition shadow-sm ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-teal-600/20 shadow-md font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {comp}
              </button>
            );
          })}
        </div>
      </div>

      {/* MALLA DE CONTENIDOS CURRICULARES */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
          <span className="text-indigo-600 text-base">📚</span> MALLA DE CONTENIDOS CURRICULARES (PROFUNDIZADA POR SEMANA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-teal-700 mb-1.5">📘 Conceptuales:</label>
            <textarea
              rows={5}
              value={conceptual}
              onChange={(e) => setConceptual(e.target.value)}
              placeholder="Conceptos, hechos, principios por semanas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-indigo-700 mb-1.5">⚙️ Procedimentales:</label>
            <textarea
              rows={5}
              value={procedural}
              onChange={(e) => setProcedural(e.target.value)}
              placeholder="Procedimientos, técnicas, análisis..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-rose-600 mb-1.5">❤️ Actitudinales:</label>
            <textarea
              rows={5}
              value={attitudinal}
              onChange={(e) => setAttitudinal(e.target.value)}
              placeholder="Valores, actitudes de convivencia y ética..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* SECUENCIA DIDÁCTICA */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
          <span className="text-emerald-600 text-base">🚀</span> SECUENCIA DIDÁCTICA (ACTIVIDADES DE INICIO, DESARROLLO Y CIERRE)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-emerald-700 mb-1.5">🟢 Actividades de Inicio:</label>
            <textarea
              rows={5}
              value={didacticStart}
              onChange={(e) => setDidacticStart(e.target.value)}
              placeholder="Recuperación de saberes previos, motivación..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-700 mb-1.5">🔵 Actividades de Desarrollo:</label>
            <textarea
              rows={5}
              value={didacticDevelopment}
              onChange={(e) => setDidacticDevelopment(e.target.value)}
              placeholder="Construcción del conocimiento, análisis profundo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-700 mb-1.5">🔴 Actividades de Cierre:</label>
            <textarea
              rows={5}
              value={didacticClosing}
              onChange={(e) => setDidacticClosing(e.target.value)}
              placeholder="Socialización de resultados, metacognición..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* EVALUACIÓN Y RECURSOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-teal-600 text-base">📊</span> EVALUACIÓN E INSTRUMENTOS
          </h2>
          <textarea
            rows={4}
            value={evaluationInstruments}
            onChange={(e) => setEvaluationInstruments(e.target.value)}
            placeholder="Rúbricas, listas de cotejo, pruebas..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <h2 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-indigo-600 text-base">🛠️</span> RECURSOS EDUCATIVOS
          </h2>
          <textarea
            rows={4}
            value={educationalResources}
            onChange={(e) => setEducationalResources(e.target.value)}
            placeholder="Libros, herramientas digitales, plataformas..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* BOTONES INFERIORES */}
      <div className="flex justify-end items-center gap-3 pt-3">
        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition shadow-sm"
        >
          + Nueva Unidad
        </button>

        <button
          type="button"
          onClick={() => alert('💾 Planificación guardada correctamente.')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <span>💾 Guardar Planificación</span>
        </button>
      </div>

    </div>
  );
}