import React, { useState, useEffect } from 'react';

export default function RepositorioCurricularMinerd() {
  // ==========================================
  // PERSISTENCIA TOTAL Y AUTOMÁTICA (localStorage)
  // ==========================================
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // 1. Herramientas Interactivas (Persistentes)
  const [interactiveTools, setInteractiveTools] = useState(() => {
    const saved = localStorage.getItem('minerd_interactive_tools');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { name: 'Kahoot!', category: 'Evaluación Gamificada', badgeColor: 'bg-purple-700 text-white', description: 'Cuestionarios interactivos para repasos y motivación en el aula.', url: 'https://kahoot.com' },
      { name: 'Educaplay', category: 'Actividades Multimedia', badgeColor: 'bg-amber-600 text-white', description: 'Crucigramas, sopas de letras, mapas interactivos y adivinanzas.', url: 'https://www.educaplay.com' },
      { name: 'Wordwall', category: 'Juegos Didácticos', badgeColor: 'bg-blue-600 text-white', description: 'Ruedas del azar, juegos de emparejamiento y cuestionarios dinámicos.', url: 'https://wordwall.net' },
      { name: 'Mentimeter', category: 'Participación en Vivo', badgeColor: 'bg-teal-600 text-white', description: 'Encuestas en vivo, nubes de palabras y sesiones de preguntas (Q&A).', url: 'https://www.mentimeter.com' },
      { name: 'Padlet', category: 'Muros Colaborativos', badgeColor: 'bg-rose-600 text-white', description: 'Pizarras virtuales colaborativas para compartir recursos, esquemas e ideas.', url: 'https://padlet.com' },
      { name: 'Perplexity AI', category: 'Investigación Asistida', badgeColor: 'bg-emerald-600 text-white', description: 'Búsquedas inteligentes asistidas con fuentes para soporte pedagógico.', url: 'https://www.perplexity.ai' },
      { name: 'GeoGebra', category: 'Matemáticas', badgeColor: 'bg-orange-600 text-white', description: 'Geometría dinámica, álgebra, hojas de cálculo y simulaciones matemáticas para el aula.', url: 'https://www.geogebra.org' },
      { name: 'PhET Interactive Simulations', category: 'Ciencias de la Naturaleza', badgeColor: 'bg-cyan-600 text-white', description: 'Simulaciones divertidas e interactivas de física, química, biología y matemáticas.', url: 'https://phet.colorado.edu' },
      { name: 'Gamma App', category: 'Inteligencia Artificial', badgeColor: 'bg-indigo-600 text-white', description: 'Creación automatizada de presentaciones visuales, apuntes y documentos con IA en segundos.', url: 'https://gamma.app' },
      { name: 'NotebookLM', category: 'Inteligencia Artificial', badgeColor: 'bg-violet-600 text-white', description: 'Cuaderno personalizado impulsado por IA para estudiar, resumir y chatear con documentos pedagógicos y PDF.', url: 'https://notebooklm.google.com' },
      { name: 'Canva para Educación', category: 'Diseño y Creatividad', badgeColor: 'bg-sky-600 text-white', description: 'Plataforma de diseño gráfico para crear infografías, carteles y materiales didácticos atractivos.', url: 'https://www.canva.com/education' },
      { name: 'Google Workspace / Classroom', category: 'Gestión y Aula Virtual', badgeColor: 'bg-blue-700 text-white', description: 'Entorno integrado para organizar clases, tareas, documentos compartidos y videoconferencias.', url: 'https://classroom.google.com' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('minerd_interactive_tools', JSON.stringify(interactiveTools));
  }, [interactiveTools]);

  const toolCategories = [
    'Todas', 
    'Evaluación Gamificada', 
    'Actividades Multimedia', 
    'Matemáticas', 
    'Ciencias de la Naturaleza', 
    'Inteligencia Artificial', 
    'Muros Colaborativos', 
    'Diseño y Creatividad'
  ];

  // 2. Documentos y Normativas (Persistentes)
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('minerd_documents');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 1, name: 'Diseño Curricular Nivel Secundario (Primer Ciclo)', format: 'PDF', size: '14.2 MB', category: 'Currículo', url: 'https://www.ministeriodeeducacion.gob.do/' },
      { id: 2, name: 'Diseño Curricular Nivel Secundario (Segundo Ciclo)', format: 'PDF', size: '18.5 MB', category: 'Currículo', url: 'https://www.ministeriodeeducacion.gob.do/' },
      { id: 3, name: 'Orden Departamental No. 43-2019 (Evaluación de los Aprendizajes)', format: 'PDF', size: '2.4 MB', category: 'Normativas', url: 'https://www.ministeriodeeducacion.gob.do/' },
      { id: 4, name: 'Ordenanza No. 02-2016 (Sistema de Evaluación)', format: 'PDF', size: '3.1 MB', category: 'Normativas', url: 'https://www.ministeriodeeducacion.gob.do/' },
      { id: 5, name: 'Guía Metodológica para la Planificación por Competencias', format: 'PDF', size: '5.8 MB', category: 'Planificación', url: 'https://www.ministeriodeeducacion.gob.do/' },
      { id: 6, name: 'Manual Operativo de Centros Educativos públicos', format: 'PDF', size: '8.9 MB', category: 'Gestión', url: 'https://www.ministeriodeeducacion.gob.do/' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('minerd_documents', JSON.stringify(documents));
  }, [documents]);

  const docCategories = ['Todos', 'Currículo', 'Normativas', 'Planificación', 'Gestión'];

  // 3. Videos Educativos de YouTube (Persistentes)
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('minerd_videos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 1, title: 'Introducción al Currículo por Competencias', subject: 'Pedagogía y Didáctica', embedId: 'jfKfPfyJRdk' },
      { id: 2, title: 'Estrategias de enseñanza y planificación docente', subject: 'Práctica Pedagógica', embedId: '3JZ_D3ELwOQ' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('minerd_videos', JSON.stringify(videos));
  }, [videos]);

  const [videoSearch, setVideoSearch] = useState('');

  // 4. Registro Automático de Actividades y Resultados de Estudiantes (Persistentes)
  const [studentActivities, setStudentActivities] = useState(() => {
    const saved = localStorage.getItem('minerd_student_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 1,
        activityName: 'Kahoot! Repaso de Geometría Analítica',
        tool: 'Kahoot!',
        section: '3ro Secundaria A',
        date: '2026-09-06 10:30 AM',
        participants: 28,
        averageScore: '85 / 100',
        notes: 'Excelente participación grupal. Destacaron los estudiantes en identificación de teoremas.'
      },
      {
        id: 2,
        activityName: 'Educaplay: Crucigrama de Ecosistemas y Biodiversidad',
        tool: 'Educaplay',
        section: '4to Secundaria B',
        date: '2026-09-05 02:15 PM',
        participants: 32,
        averageScore: '90 / 100',
        notes: 'Completado con éxito en el laboratorio de informática.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('minerd_student_activities', JSON.stringify(studentActivities));
  }, [studentActivities]);

  const [activitySearch, setActivitySearch] = useState('');

  // ==========================================
  // FILTRADOS
  // ==========================================
  const filteredTools = interactiveTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [docSearch, setDocSearch] = useState('');
  const [selectedDocCategory, setSelectedDocCategory] = useState('Todos');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearch.toLowerCase());
    const matchesCategory = selectedDocCategory === 'Todos' || doc.category === selectedDocCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videos.filter(vid => 
    vid.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
    vid.subject.toLowerCase().includes(videoSearch.toLowerCase()) ||
    vid.embedId.toLowerCase().includes(videoSearch.toLowerCase())
  );

  const filteredActivities = studentActivities.filter(act =>
    act.activityName.toLowerCase().includes(activitySearch.toLowerCase()) ||
    act.tool.toLowerCase().includes(activitySearch.toLowerCase()) ||
    act.section.toLowerCase().includes(activitySearch.toLowerCase())
  );

  // ==========================================
  // ACCIONES: DOCUMENTOS
  // ==========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const categoryPrompt = prompt('Selecciona la categoría para este PDF (Currículo, Normativas, Planificación, Gestión):', 'Planificación');
    const validCategory = docCategories.includes(categoryPrompt) ? categoryPrompt : 'Planificación';
    
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fileUrl = URL.createObjectURL(file);

    const newDoc = {
      id: Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      format: 'PDF',
      size: sizeInMb,
      category: validCategory,
      url: fileUrl
    };

    setDocuments([newDoc, ...documents]);
    alert(`✅ Documento PDF "${newDoc.name}" agregado y guardado automáticamente.`);
  };

  const handleUploadDocumentByLink = () => {
    const title = prompt('Ingrese el nombre del documento oficial:');
    if (!title) return;
    const url = prompt('Ingrese el enlace web o URL directa del archivo PDF:', 'https://');
    if (!url) return;
    const categoryPrompt = prompt('Categoría (Currículo, Normativas, Planificación, Gestión):', 'Normativas');
    const validCategory = docCategories.includes(categoryPrompt) ? categoryPrompt : 'Normativas';
    const size = prompt('Tamaño aproximado (ej. 3.5 MB):', '2.0 MB');

    const newDoc = {
      id: Date.now(),
      name: title,
      format: 'PDF',
      size: size || '1.5 MB',
      category: validCategory,
      url: url.startsWith('http') ? url : `https://${url}`
    };

    setDocuments([newDoc, ...documents]);
    alert('✅ Documento web guardado correctamente.');
  };

  const handleDeleteDocument = (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el documento "${name}" del repositorio?`)) {
      setDocuments(documents.filter(doc => doc.id !== id));
      alert('🗑️ Documento eliminado y cambios guardados.');
    }
  };

  const handleSearchOnlinePDF = () => {
    const query = prompt('¿Qué documento o normativa deseas buscar en la web?', 'Diseño curricular secundaria PDF');
    if (query) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' filetype:pdf')}`;
      window.open(searchUrl, '_blank');
    }
  };

  // ==========================================
  // ACCIONES: VIDEOS YOUTUBE
  // ==========================================
  const handleSearchOnlineYouTube = () => {
    const query = prompt('¿Qué tema o video educativo para prácticas pedagógicas deseas buscar en YouTube?', 'Estrategias de enseñanza');
    if (query) {
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      window.open(youtubeSearchUrl, '_blank');
    }
  };

  const handleAddYouTubeVideo = () => {
    const title = prompt('Título del video educativo:');
    if (!title) return;
    const subject = prompt('Asignatura o Tema relacionado:', 'Práctica Pedagógica');
    const url = prompt('Enlace del video de YouTube (ej. https://www.youtube.com/watch?v=XXXXXXXXXXX):', 'https://www.youtube.com/watch?v=');
    
    if (url) {
      let embedId = '';
      if (url.includes('v=')) {
        embedId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        embedId = url.split('youtu.be/')[1]?.split('?')[0];
      }

      if (!embedId) {
        alert('⚠️ No se pudo extraer el código del video de YouTube. Asegúrate de que el enlace sea correcto.');
        return;
      }

      const newVideo = {
        id: Date.now(),
        title,
        subject: subject || 'General',
        embedId
      };

      setVideos([newVideo, ...videos]);
      alert('✅ Video educativo agregado y guardado de forma permanente.');
    }
  };

  const handleSearchAndPlayByLink = () => {
    const url = prompt('Pega aquí el enlace de YouTube (URL completa o enlace corto youtu.be) para buscarlo y reproducirlo en la plataforma:');
    if (!url) return;

    let embedId = '';
    if (url.includes('v=')) {
      embedId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      embedId = url.split('youtu.be/')[1]?.split('?')[0];
    }

    if (!embedId) {
      alert('⚠️ Enlace inválido. Asegúrate de que sea un enlace válido de YouTube.');
      return;
    }

    const existingVideo = videos.find(v => v.embedId === embedId);
    if (existingVideo) {
      setVideoSearch(existingVideo.title);
      alert(`▶️ ¡Video encontrado en tu videoteca guardada: "${existingVideo.title}"!`);
    } else {
      const title = prompt('Este video no está en la lista. Ingresa un título para guardarlo y reproducirlo:', 'Video Educativo YouTube');
      const subject = prompt('Asignatura o Categoría:', 'Práctica Pedagógica');
      
      const newVideo = {
        id: Date.now(),
        title: title || 'Video Externo YouTube',
        subject: subject || 'General',
        embedId
      };

      setVideos([newVideo, ...videos]);
      setVideoSearch(newVideo.title);
      alert('✅ Video guardado y listo para reproducirse.');
    }
  };

  const handleDeleteVideo = (id, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el video "${title}"?`)) {
      setVideos(videos.filter(vid => vid.id !== id));
      alert('🗑️ Video eliminado correctamente.');
    }
  };

  // ==========================================
  // ACCIONES: REGISTRO AUTOMÁTICO DE ACTIVIDADES
  // ==========================================
  const handleRegisterActivity = () => {
    const activityName = prompt('Nombre o título de la actividad realizada (ej. Kahoot de Matemáticas TEMA 1):');
    if (!activityName) return;
    const tool = prompt('Plataforma utilizada (ej. Kahoot!, Educaplay, Wordwall, Mentimeter, Padlet):', 'Kahoot!');
    const section = prompt('Sección de estudiantes (ej. 3ro Secundaria A, 5to de Secundaria):', '3ro Secundaria A');
    const participants = prompt('Número de estudiantes participantes:', '25');
    const averageScore = prompt('Calificación o desempeño promedio (ej. 88/100 o Muy Alto):', '85 / 100');
    const notes = prompt('Observaciones o comentarios pedagógicos:', 'Excelente participación y dominio de los conceptos.');

    const newActivity = {
      id: Date.now(),
      activityName,
      tool: tool || 'Kahoot!',
      section: section || 'General',
      date: new Date().toLocaleString(),
      participants: participants || '0',
      averageScore: averageScore || 'N/A',
      notes: notes || 'Sin observaciones.'
    };

    setStudentActivities([newActivity, ...studentActivities]);
    alert('🎉 ¡Actividad y resultados de los estudiantes guardados automáticamente en la plataforma para consultas futuras!');
  };

  const handleDeleteActivity = (id, name) => {
    if (window.confirm(`¿Deseas eliminar el registro de resultados de "${name}"?`)) {
      setStudentActivities(studentActivities.filter(act => act.id !== id));
      alert('🗑️ Registro eliminado correctamente.');
    }
  };

  const handleAddTool = () => {
    const name = prompt('Nombre de la nueva herramienta digital:');
    if (!name) return;
    const category = prompt('Categoría (ej. Matemáticas, Inteligencia Artificial, Ciencias, etc.):', 'Pedagogía');
    const description = prompt('Breve descripción de su uso pedagógico:');
    const url = prompt('Enlace web (URL) de la plataforma:', 'https://');

    if (name && url) {
      const newTool = {
        name,
        category: category || 'General',
        badgeColor: 'bg-teal-700 text-white',
        description: description || 'Herramienta de apoyo docente.',
        url: url.startsWith('http') ? url : `https://${url}`
      };
      setInteractiveTools([newTool, ...interactiveTools]);
      alert('✅ Herramienta interactiva guardada permanentemente.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 font-sans bg-[#f4f6fb] min-h-screen text-slate-800">
      
      {/* BANNER PRINCIPAL CON FRASE TECNOLÓGICA */}
      <div className="bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-3">
        <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-amber-300 uppercase tracking-widest border border-white/10">
          💾 Guardado Automático Activo • Innovación Educativa
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
          Repositorio Curricular & Registro de Actividades TIC
        </h1>
        <p className="text-xs md:text-sm text-purple-100 font-medium max-w-2xl leading-relaxed italic">
          "La tecnología no reemplazará a los grandes profesores, pero en las manos de estos, es transformadora."
        </p>
      </div>

      {/* SECCIÓN NUEVA: REGISTRO Y RESULTADOS AUTOMÁTICOS DE ESTUDIANTES */}
      <div className="bg-white border-2 border-teal-500/40 rounded-3xl p-6 shadow-md space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                Registro Automático de Resultados de Estudiantes (Kahoot, Educaplay, etc.)
              </h2>
              <p className="text-xs text-slate-500 font-medium">Guarda y consulta el historial de puntajes y participación de tus clases</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar actividad o sección..."
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition flex-1 md:w-56"
            />
            
            <button
              type="button"
              onClick={handleRegisterActivity}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>+ Registrar Actividad / Kahoot</span>
            </button>
          </div>
        </div>

        {/* TABLA DE ACTIVIDADES Y RESULTADOS GUARDADOS */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-teal-50 text-teal-900 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Actividad / Plataforma</th>
                <th className="p-4">Sección</th>
                <th className="p-4">Fecha y Hora</th>
                <th className="p-4">Participantes</th>
                <th className="p-4">Promedio / Puntaje</th>
                <th className="p-4">Observaciones Pedagógicas</th>
                <th className="p-4 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-teal-600">📌</span> 
                        <div>
                          <div>{act.activityName}</div>
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                            {act.tool}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{act.section}</td>
                    <td className="p-4 text-slate-500">{act.date}</td>
                    <td className="p-4 font-bold text-indigo-900">{act.participants} estudiantes</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-lg text-[10px]">
                        {act.averageScore}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 italic max-w-xs">{act.notes}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id, act.activityName)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                        title="Eliminar este registro"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400 font-medium">
                    No hay actividades registradas con ese criterio de búsqueda. ¡Haz clic en "+ Registrar Actividad / Kahoot" para guardar una nueva!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECCIÓN 1: HERRAMIENTAS INTERACTIVAS Y PEDAGÓGICAS */}
      <div className="space-y-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                Entornos Digitales e Inteligencia Artificial para el Aula
              </h2>
              <p className="text-xs text-slate-500 font-medium">Recursos guardados y sincronizados localmente</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar herramienta digital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition flex-1 md:w-64"
            />
            <button
              type="button"
              onClick={handleAddTool}
              className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition"
            >
              + Agregar Herramienta
            </button>
          </div>
        </div>

        {/* Filtros por Categoría de Herramientas */}
        <div className="flex flex-wrap gap-2 pt-1">
          {toolCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-black'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE HERRAMIENTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <div 
                key={index}
                className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${tool.badgeColor}`}>
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{tool.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </div>

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-teal-600 text-slate-700 hover:text-white font-bold text-xs py-3 rounded-2xl border border-slate-200 transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Abrir Plataforma ↗</span>
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              No se encontraron herramientas digitales con ese criterio de búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: NORMATIVAS Y DOCUMENTOS OFICIALES */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                Normativas y Documentos Oficiales
              </h2>
              <p className="text-xs text-slate-500 font-medium">Currículo oficial, ordenanzas y normativas con guardado automático</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar documento..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition flex-1 md:w-48"
            />
            
            <input
              type="file"
              id="pdfUploadInput"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={handleSearchOnlinePDF}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
              title="Busca documentos PDF directamente en la web"
            >
              <span>🔍 Buscar en Web</span>
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('pdfUploadInput').click()}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              📁 Subir PDF
            </button>

            <button
              type="button"
              onClick={handleUploadDocumentByLink}
              className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              + Enlace Web
            </button>
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="flex flex-wrap gap-2 pt-1">
          {docCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedDocCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition ${
                selectedDocCategory === cat
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm font-black'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TABLA DE DOCUMENTOS */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Nombre del Documento</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Formato</th>
                <th className="p-4">Tamaño</th>
                <th className="p-4 text-right">Opciones de Lectura y Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <span>📄</span> {doc.name}
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{doc.format}</td>
                    <td className="p-4 font-semibold text-slate-500">{doc.size}</td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                        title="Leer o ver documento"
                      >
                        📖 Leer ↗
                      </a>
                      <a
                        href={doc.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                        title="Descargar archivo PDF"
                      >
                        📥 Descargar
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                        className="inline-block bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                        title="Eliminar documento del listado"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400 font-medium">
                    No se encontraron documentos oficiales con ese criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECCIÓN 3: VIDEOS EDUCATIVOS DE YOUTUBE EN LÍNEA */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📺</span>
            <div>
              <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                Videoteca Educativa (Reproducción Directa de YouTube)
              </h2>
              <p className="text-xs text-slate-500 font-medium">Recursos audiovisuales guardados de forma permanente</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar video por título o ID..."
              value={videoSearch}
              onChange={(e) => setVideoSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition flex-1 md:w-44"
            />
            
            <button
              type="button"
              onClick={handleSearchAndPlayByLink}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
              title="Buscar y reproducir video pegando el enlace de YouTube"
            >
              <span>🔗 Buscar por Link</span>
            </button>

            <button
              type="button"
              onClick={handleSearchOnlineYouTube}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
              title="Buscar videos educativos directamente en YouTube"
            >
              <span>🔍 Explorar YouTube</span>
            </button>

            <button
              type="button"
              onClick={handleAddYouTubeVideo}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>+ Agregar Video</span>
            </button>
          </div>
        </div>

        {/* GRID DE VIDEOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((vid) => (
              <div key={vid.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="inline-block bg-rose-100 text-rose-800 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase">
                      {vid.subject}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(vid.id, vid.title)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs transition flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-rose-200 shadow-xs"
                      title="Eliminar este video de la plataforma"
                    >
                      <span>🗑️ Eliminar</span>
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{vid.title}</h3>
                </div>

                {/* Reproductor de YouTube integrado */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-slate-900">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${vid.embedId}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 font-medium">
              No se encontraron videos educativos con ese criterio de búsqueda.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}