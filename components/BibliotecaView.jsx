import React, { useState, useEffect, useRef } from 'react';

export default function BibliotecaView() {
  const [recursos, setRecursos] = useState([]);
  const [filtroAsignatura, setFiltroAsignatura] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [modalSubir, setModalSubir] = useState(false);
  const [documentoActivo, setDocumentoActivo] = useState(null); 
  
  const [titulo, setTitulo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('documentos');
  const [asignatura, setAsignatura] = useState('Matemáticas');
  const [descripcion, setDescripcion] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const fileInputRef = useRef(null);
  const asignaturaObjetivoRef = useRef('Matemáticas');

  // Tarjetas con fondos y acentos actualizados ("Informática / TICs" cambiado a "Libro Abierto de todas las areas")
  const listaAsignaturas = [
    { nombre: 'Matemáticas', icono: '📐', tarjetaBg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 shadow-sm', badgeBg: 'bg-blue-600 text-white', textoColor: 'text-blue-900 font-bold', botonVer: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300', botonImportar: 'bg-blue-600 hover:bg-blue-700 text-white font-black' },
    { nombre: 'Lengua Española', icono: '📖', tarjetaBg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 shadow-sm', badgeBg: 'bg-amber-600 text-white', textoColor: 'text-amber-900 font-bold', botonVer: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300', botonImportar: 'bg-amber-600 hover:bg-amber-700 text-white font-black' },
    { nombre: 'Ciencias Sociales', icono: '🌍', tarjetaBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-sm', badgeBg: 'bg-emerald-600 text-white', textoColor: 'text-emerald-900 font-bold', botonVer: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300', botonImportar: 'bg-emerald-600 hover:bg-emerald-700 text-white font-black' },
    { nombre: 'Ciencias Naturales', icono: '🔬', tarjetaBg: 'bg-fuchsia-50 hover:bg-fuchsia-100 border-fuchsia-200 shadow-sm', badgeBg: 'bg-fuchsia-600 text-white', textoColor: 'text-fuchsia-900 font-bold', botonVer: 'bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300', botonImportar: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black' },
    { nombre: 'Inglés', icono: '🗣️', tarjetaBg: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 shadow-sm', badgeBg: 'bg-cyan-600 text-white', textoColor: 'text-cyan-900 font-bold', botonVer: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border-cyan-300', botonImportar: 'bg-cyan-600 hover:bg-cyan-700 text-white font-black' },
    { nombre: 'Educación Física', icono: '⚽', tarjetaBg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 shadow-sm', badgeBg: 'bg-rose-600 text-white', textoColor: 'text-rose-900 font-bold', botonVer: 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300', botonImportar: 'bg-rose-600 hover:bg-rose-700 text-white font-black' },
    { nombre: 'Libro Abierto de todas las areas', icono: '📚', tarjetaBg: 'bg-violet-50 hover:bg-violet-100 border-violet-200 shadow-sm', badgeBg: 'bg-violet-600 text-white', textoColor: 'text-violet-900 font-bold', botonVer: 'bg-violet-100 hover:bg-violet-200 text-violet-800 border-violet-300', botonImportar: 'bg-violet-600 hover:bg-violet-700 text-white font-black' },
    { nombre: 'General / Otras', icono: '📁', tarjetaBg: 'bg-slate-100 hover:bg-slate-200 border-slate-300 shadow-sm', badgeBg: 'bg-slate-700 text-white', textoColor: 'text-slate-900 font-bold', botonVer: 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300', botonImportar: 'bg-slate-800 hover:bg-slate-900 text-white font-black' }
  ];

  useEffect(() => {
    const guardados = localStorage.getItem('educlet_biblioteca_digital_v5');
    if (guardados) {
      setRecursos(JSON.parse(guardados));
    }
  }, []);

  const detectarAsignaturaAutomatica = (texto) => {
    const t = texto.toLowerCase();
    if (t.includes('matemática') || t.includes('algebra') || t.includes('geometria') || t.includes('calculo')) return 'Matemáticas';
    if (t.includes('lengua') || t.includes('español') || t.includes('literatura') || t.includes('lectura') || t.includes('gramatica')) return 'Lengua Española';
    if (t.includes('social') || t.includes('historia') || t.includes('geografia') || t.includes('constitucion') || t.includes('patria')) return 'Ciencias Sociales';
    if (t.includes('natural') || t.includes('biologia') || t.includes('quimica') || t.includes('fisica') || t.includes('ciencia')) return 'Ciencias Naturales';
    if (t.includes('ingles') || t.includes('english') || t.includes('idioma')) return 'Inglés';
    if (t.includes('ef') || t.includes('deporte') || t.includes('educacion fisica') || t.includes('cuerpo')) return 'Educación Física';
    if (t.includes('libro') || t.includes('abierto') || t.includes('texto') || t.includes('minerd')) return 'Libro Abierto de todas las areas';
    return 'General / Otras';
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoSeleccionado(file);
      const nombreLimpio = file.name.replace(/\.[^/.]+$/, "");
      if (!titulo) setTitulo(nombreLimpio);
      
      const detectada = detectarAsignaturaAutomatica(nombreLimpio);
      if (detectada !== 'General / Otras') setAsignatura(detectada);
    }
  };

  const handleImportarDirectoAsignatura = (e, nombreAsignatura) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const nuevoRecurso = {
        id: Date.now(),
        titulo: file.name.replace(/\.[^/.]+$/, ""),
        tipoDocumento: file.name.endsWith('.pptx') || file.name.endsWith('.ppt') ? 'documentos' : 'planificacion',
        asignatura: nombreAsignatura,
        descripcion: `Importado directamente en la sección de ${nombreAsignatura}`,
        nombreArchivo: file.name,
        tipoMime: file.type,
        tamanio: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fecha: new Date().toLocaleDateString(),
        dataUrl: uploadEvent.target.result 
      };

      const actualizados = [nuevoRecurso, ...recursos];
      setRecursos(actualizados);
      localStorage.setItem('educlet_biblioteca_digital_v5', JSON.stringify(actualizados));
      alert(`¡Archivo "${file.name}" importado con éxito en ${nombreAsignatura}!`);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const dispararSelectorAsignatura = (nombreAsignatura) => {
    asignaturaObjetivoRef.current = nombreAsignatura;
    fileInputRef.current.click();
  };

  const guardarRecursoModal = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !archivoSeleccionado) {
      alert('Por favor, completa el título y selecciona un archivo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const nuevoRecurso = {
        id: Date.now(),
        titulo,
        tipoDocumento,
        asignatura,
        descripcion,
        nombreArchivo: archivoSeleccionado.name,
        tipoMime: archivoSeleccionado.type,
        tamanio: `${(archivoSeleccionado.size / (1024 * 1024)).toFixed(1)} MB`,
        fecha: new Date().toLocaleDateString(),
        dataUrl: uploadEvent.target.result 
      };

      const actualizados = [nuevoRecurso, ...recursos];
      setRecursos(actualizados);
      localStorage.setItem('educlet_biblioteca_digital_v5', JSON.stringify(actualizados));

      setTitulo('');
      setDescripcion('');
      setArchivoSeleccionado(null);
      setModalSubir(false);
      alert('¡Documento guardado con éxito!');
    };
    reader.readAsDataURL(archivoSeleccionado);
  };

  const eliminarRecurso = (id) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      const filtrados = recursos.filter(r => r.id !== id);
      setRecursos(filtrados);
      localStorage.setItem('educlet_biblioteca_digital_v5', JSON.stringify(filtrados));
      if (documentoActivo?.id === id) setDocumentoActivo(null);
    }
  };

  const compartirRecurso = (rec) => {
    if (navigator.share) {
      navigator.share({
        title: rec.titulo,
        text: `Recurso (${rec.asignatura}) - ${rec.titulo}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`¡Enlace copiado para compartir: "${rec.titulo}"!`);
    }
  };

  const recursosFiltrados = recursos.filter(r => {
    const cumpleAsignatura = filtroAsignatura === 'todas' || r.asignatura === filtroAsignatura;
    const cumpleTipo = filtroTipo === 'todos' || r.tipoDocumento === filtroTipo;
    return cumpleAsignatura && cumpleTipo;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 space-y-6 animate-fadeIn font-sans pb-16 px-4 md:px-8 max-w-7xl mx-auto pt-6">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleImportarDirectoAsignatura(e, asignaturaObjetivoRef.current)} 
        accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,image/*" 
        className="hidden" 
      />

      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <span>📚</span> Repositorio Institucional
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Biblioteca Digital Docente
          </h2>
          <p className="text-xs text-slate-600 mt-1">Importa documentos por asignatura, previsualiza al instante, comparte o descarga Word, PPT, Excel y PDF.</p>
        </div>

        <button
          onClick={() => setModalSubir(true)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:scale-105"
        >
          <span>📤</span> Subir Archivo General
        </button>
      </div>

      {/* TARJETAS DE ASIGNATURAS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Asignaturas y Colecciones (Haz clic para filtrar o importar):</span>
          {filtroAsignatura !== 'todas' && (
            <button 
              onClick={() => setFiltroAsignatura('todas')}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Ver todas las asignaturas ↺
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {listaAsignaturas.map((asig) => {
            const cantidad = recursos.filter(r => r.asignatura === asig.nombre).length;
            const estaSeleccionada = filtroAsignatura === asig.nombre;

            return (
              <div 
                key={asig.nombre}
                className={`border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md ${asig.tarjetaBg} ${
                  estaSeleccionada ? 'ring-4 ring-amber-400 border-amber-400 scale-[1.02]' : 'hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl p-1.5 bg-white/80 rounded-xl shadow-sm border border-slate-200">{asig.icono}</span>
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm ${asig.badgeBg}`}>
                      {cantidad} {cantidad === 1 ? 'doc' : 'docs'}
                    </span>
                  </div>
                  <h3 
                    onClick={() => setFiltroAsignatura(asig.nombre)} 
                    className={`text-xs md:text-sm cursor-pointer transition line-clamp-1 hover:underline ${asig.textoColor}`}
                  >
                    {asig.nombre}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => setFiltroAsignatura(asig.nombre)}
                    className={`text-[11px] font-bold py-2 px-2 rounded-xl transition text-center cursor-pointer border shadow-sm ${asig.botonVer}`}
                  >
                    Ver ({cantidad})
                  </button>
                  <button
                    onClick={() => dispararSelectorAsignatura(asig.nombre)}
                    className={`text-[11px] py-2 px-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-sm ${asig.botonImportar}`}
                    title={`Importar archivo en ${asig.nombre}`}
                  >
                    <span>📥</span> Importar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subfiltro por Tipo de Documento */}
      <div className="flex flex-wrap gap-2 items-center pt-2">
        <span className="text-xs font-bold text-slate-600 mr-2">Filtrar por Formato:</span>
        <button 
          onClick={() => setFiltroTipo('todos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${filtroTipo === 'todos' ? 'bg-indigo-600 text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFiltroTipo('planificacion')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${filtroTipo === 'planificacion' ? 'bg-indigo-600 text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          📑 Planificaciones
        </button>
        <button 
          onClick={() => setFiltroTipo('documentos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${filtroTipo === 'documentos' ? 'bg-indigo-600 text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          📁 Docs / Presentaciones (PPT, Word, Excel)
        </button>
      </div>

      {/* Listado de Recursos Filtrados */}
      {recursosFiltrados.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-600 space-y-3 shadow-md">
          <span className="text-4xl block">📂</span>
          <p className="text-sm font-bold text-slate-900">No hay documentos registrados para esta selección.</p>
          <p className="text-xs text-slate-500">Haz clic en el botón "Importar" de cualquier asignatura o colección para agregar un archivo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursosFiltrados.map((rec) => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-all duration-200">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {rec.asignatura}
                  </span>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => compartirRecurso(rec)}
                      className="text-slate-600 hover:text-indigo-600 text-xs transition p-1.5 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                      title="Compartir"
                    >
                      🔗
                    </button>
                    <button 
                      onClick={() => eliminarRecurso(rec.id)}
                      className="text-slate-600 hover:text-red-600 text-xs transition p-1.5 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">{rec.titulo}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{rec.descripcion || 'Sin descripción adicional.'}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="truncate max-w-[160px]">📎 {rec.nombreArchivo}</span>
                  <span className="font-bold text-indigo-600">{rec.tamanio}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDocumentoActivo(rec)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 shadow-sm"
                  >
                    <span>👁️</span> Vista Previa
                  </button>

                  <a
                    href={rec.dataUrl}
                    download={rec.nombreArchivo}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-sm"
                  >
                    <span>📥</span> Descargar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE VISTA PREVIA INTERACTIVA */}
      {documentoActivo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 md:p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{documentoActivo.asignatura}</span>
                  <span className="text-[10px] text-slate-500">• {documentoActivo.tipoDocumento}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{documentoActivo.titulo}</h3>
                <p className="text-xs text-slate-500">{documentoActivo.nombreArchivo} ({documentoActivo.tamanio})</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => compartirRecurso(documentoActivo)}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-300 cursor-pointer shadow-sm"
                >
                  <span>🔗</span> Compartir
                </button>
                <a
                  href={documentoActivo.dataUrl}
                  download={documentoActivo.nombreArchivo}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <span>📥</span> Descargar
                </a>
                <button 
                  onClick={() => setDocumentoActivo(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition cursor-pointer border border-slate-300 shadow-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-auto">
              {documentoActivo.tipoMime?.includes('image') ? (
                <img 
                  src={documentoActivo.dataUrl} 
                  alt={documentoActivo.titulo} 
                  className="max-h-full max-w-full object-contain rounded-xl border border-slate-200 shadow-md bg-white" 
                />
              ) : documentoActivo.tipoMime?.includes('pdf') ? (
                <iframe 
                  src={documentoActivo.dataUrl} 
                  title={documentoActivo.titulo}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="text-center space-y-4 max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-xl">
                  <span className="text-5xl block">📊</span>
                  <h4 className="font-bold text-slate-900 text-base">Vista Previa para Office (Word/Excel/PPT)</h4>
                  <p className="text-xs text-slate-600">Puedes abrirlo directamente en el visor en línea de Microsoft Office o descargarlo a tu equipo.</p>
                  <div className="flex justify-center gap-3 pt-2">
                    <a
                      href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(documentoActivo.dataUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-3 rounded-xl transition shadow-md"
                    >
                      Abrir Visor Office 🌐
                    </a>
                    <a
                      href={documentoActivo.dataUrl}
                      download={documentoActivo.nombreArchivo}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-md"
                    >
                      Descargar Archivo 📥
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL GENERAL PARA SUBIR ARCHIVOS CON SELECTOR DE ASIGNATURA */}
      {modalSubir && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📤</span>
                <h3 className="text-base font-black text-slate-900">Subir Recurso o Planificación</h3>
              </div>
              <button onClick={() => setModalSubir(false)} className="text-slate-500 hover:text-slate-900 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={guardarRecursoModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Archivo (Word, Excel, PPT, PDF, Imágenes)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Documento</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Planificación Unidad 1"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 mb-1">Área / Colección (Editable)</label>
                  <select
                    value={asignatura}
                    onChange={(e) => setAsignatura(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs text-indigo-900 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer shadow-sm"
                  >
                    {listaAsignaturas.map(a => (
                      <option key={a.nombre} value={a.nombre}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
                  <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="planificacion">Planificación</option>
                    <option value="documentos">Presentación / Doc / Excel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Breve</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles sobre el contenido..."
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSubir(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer border border-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Guardar Recurso →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}