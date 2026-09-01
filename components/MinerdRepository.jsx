import React from 'react';

export default function MinerdRepository() {
  const interactiveTools = [
    { name: 'Kahoot!', cat: 'Evaluación Gamificada', desc: 'Cuestionarios interactivos para repasos en el aula.', link: 'https://kahoot.com', color: 'bg-purple-600' },
    { name: 'Educaplay', cat: 'Actividades Multimedia', desc: 'Crucigramas, sopas de letras y mapas interactivos.', link: 'https://educaplay.com', color: 'bg-amber-500' },
    { name: 'Wordwall', cat: 'Juegos Didácticos', desc: 'Ruedas del azar, emparejamiento y cuestionarios.', link: 'https://wordwall.net', color: 'bg-blue-600' },
    { name: 'Mentimeter', cat: 'Participación en Vivo', desc: 'Encuestas rápidas y nubes de palabras en tiempo real.', link: 'https://mentimeter.com', color: 'bg-cyan-600' },
    { name: 'Padlet', cat: 'Muros Colaborativos', desc: 'Pizarras virtuales para compartir recursos e ideas.', link: 'https://padlet.com', color: 'bg-rose-500' },
    { name: 'Perplexity AI', cat: 'Investigación Asistida', desc: 'Búsquedas avanzadas para soporte pedagógico.', link: 'https://perplexity.ai', color: 'bg-emerald-600' }
  ];

  const minerdDocuments = [
    { title: 'Adecuación Curricular 2023-2024', type: 'PDF', size: '4.2 MB' },
    { title: 'Ordenanza 02-2022 (Evaluación de Aprendizajes)', type: 'PDF', size: '1.8 MB' },
    { title: 'Registro de Grado Oficial - Nivel Secundario', type: 'XLSX', size: '2.5 MB' },
    { title: 'Guía de Planificación por Competencias', type: 'DOCX', size: '1.1 MB' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 font-sans space-y-8">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-600 p-6 rounded-xl text-white flex justify-between items-center">
        <div>
          <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            Recursos Oficiales e Interactivos
          </span>
          <h2 className="text-2xl font-black mt-1">Repositorio Curricular & Herramientas TIC</h2>
          <p className="text-xs text-blue-100">Documentación MINERD e integración directa con entornos dinámicos de aprendizaje</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🎮</span> Herramientas Interactivas para el Aula
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {interactiveTools.map((tool, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${tool.color}`}>
                    {tool.cat}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{tool.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
              </div>
              <a
                href={tool.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-center text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 py-1.5 rounded-lg transition"
              >
                Abrir Plataforma ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📚</span> Normativas y Documentos Oficiales MINERD
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-700 font-bold">
                <th className="p-3">Nombre del Documento</th>
                <th className="p-3 text-center">Formato</th>
                <th className="p-3 text-center">Tamaño</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {minerdDocuments.map((doc, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition">
                  <td className="p-3 font-semibold text-slate-800">{doc.title}</td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-500">{doc.size}</td>
                  <td className="p-3 text-right">
                    <button className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-[11px] px-3 py-1 rounded-md shadow transition">
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}