import React, { useState, useEffect } from 'react';

const RegistroCalificaciones = () => {
  const [docentesList, setDocentesList] = useState(() => {
    const saved = localStorage.getItem('educlet_docentes_list');
    return saved ? JSON.parse(saved) : [
      "Adelina Escaño García De Rosario",
      "Adrián Alberto De Jesús Castillo",
      "Altagracia Del Carmen Núñez",
      "Antonia Yokaira Batista Rosario",
      "Ariel Johan Gil García",
      "Denice Adamilka Osorio Bonilla",
      "Diancareli Fernández Núñez",
      "Emelinda Martínez Almánzar de González.",
      "Engels Antonio Almánzar Duarte",
      "Eric Estarlyn Espaillat Lantigua",
      "Francisco Alberto Martínez Collado",
      "Glenis Altagracia Cuevas Brito",
      "Joelisa Altagracia Núñez Rodríguez",
      "José Abel Agramonte López",
      "Juan Francisco García Reynoso",
      "Juan Ramón Hidalgo Paulino",
      "Kelvin Manuel Cuevas Felipe",
      "Lourdes Danilda Almonte Sánchez",
      "Luís Emilio Guzmán Salcedo.",
      "Marlyn Lindaura Padilla",
      "Napoleón Reyes Severino",
      "Nathaly Bienvenida Hernández Durán",
      "Reynaldo Sena Peña",
      "Rosa Antonia Durán Rosario",
      "Rosalba Antonia Núñez Vásquez",
      "Rosanny Altagracia Ovalles Arias",
      "Sor Arisleida José Ortega",
      "Wilson Antonio Rodríguez",
      "Yvelisse del Carmen Adames Ferreiras",
      "Xiomara García Blanco",
      "Ariadna Esthepany Blanco Arias",
      "Ramón Aridio Yaport Almonte (Monitor)",
      "Wendy Mariela Amparo Gil",
      "Yessica Altagracia López Reyes",
      "Daneika María Mieses Ramón",
      "Esmeralda del Carmen Sánchez Ovalles",
      "Yennifer Sánchez",
      "Elvis Ortega Santos",
      "Jirandy Pérez Santana",
      "Juan Félix García Paredes",
      "Abelardo González (Monitor)",
      "Ramón Ant. Peguero",
      "Albert Ramón Vásquez Fernández",
      "Mindy Elissa Peña Regalado",
      "Aura Estela Brito Lora",
      "Fiordaliza Minaya",
      "José Benjamín María García"
    ];
  });

  const [seccionesData, setSeccionesData] = useState(() => {
    const saved = localStorage.getItem('educlet_secciones_data');
    return saved ? JSON.parse(saved) : {
      "1er Ciclo (1ro, 2do, 3ro)": [
        "1ERO A", "1ERO B", "1ERO C", "1ERO D", "1ERO E", "1ERO F",
        "2DO A", "2DO B", "2DO C", "2DO D", "2DO E", "2DO F",
        "3ERO A", "3ERO B", "3ERO C", "3ERO D", "3ERO E", "3ERO F"
      ],
      "2do Ciclo (4to, 5to, 6to)": [
        "4TO A", "4TO B", "4TO C", "4TO D", "4TO E",
        "5TO A", "5TO B", "5TO C", "5TO D",
        "6TO A", "6TO B", "6TO C"
      ]
    };
  });

  const [docente, setDocente] = useState('');
  const [asignatura, setAsignatura] = useState('Lengua Española');
  const [ciclo, setCiclo] = useState('2do Ciclo (4to, 5to, 6to)');
  const [seccion, setSeccion] = useState('4TO A');
  const [claveInput, setClaveInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDocentePasswordModal, setShowDocentePasswordModal] = useState(false);

  const [adminPinInput, setAdminPinInput] = useState('');
  const [newSubjectPin, setNewSubjectPin] = useState('');
  const [targetSubjectToChange, setTargetSubjectToChange] = useState('Lengua Española');

  const [docentePasswordActual, setDocentePasswordActual] = useState('');
  const [docentePasswordNueva, setDocentePasswordNueva] = useState('');
  const [docentePasswordConfirmar, setDocentePasswordConfirmar] = useState('');

  const [selectedStudentIdToDelete, setSelectedStudentIdToDelete] = useState('');

  const [subjectPins, setSubjectPins] = useState(() => {
    const saved = localStorage.getItem('educlet_subject_pins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaultPins = {
          'Lengua Española': '1234', 'Matemática': '1234', 'Ciencias Sociales': '1234',
          'Ciencias de la Naturaleza': '1234', 'Inglés': '1234', 'Francés': '1234',
          'Educación Física': '1234', 'Educación Artística': '1234', 'FIHR': '1234',
          'Salida de Idiomas': '1234', 'Salida de Lengua Española': '1234', 'Salida de Ciencias Sociales': '1234'
        };
        return { ...defaultPins, ...parsed };
      } catch (e) {
        return { 'Lengua Española': '1234', 'Matemática': '1234' };
      }
    }
    return {
      'Lengua Española': '1234',
      'Matemática': '1234',
      'Ciencias Sociales': '1234',
      'Ciencias de la Naturaleza': '1234',
      'Inglés': '1234',
      'Francés': '1234',
      'Educación Física': '1234',
      'Educación Artística': '1234',
      'FIHR': '1234',
      'Salida de Idiomas': '1234',
      'Salida de Lengua Española': '1234',
      'Salida de Ciencias Sociales': '1234'
    };
  });

  const ADMIN_MASTER_PIN = '9999-EDUCLET-ROOT-ADMIN';
  const storageKey = `grades_${seccion}_${asignatura}`.replace(/\s+/g, '_');

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem(`students_${seccion}`);
    return savedStudents ? JSON.parse(savedStudents) : Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      name: `Estudiante ${index + 1}`
    }));
  });

  useEffect(() => {
    const savedGrades = localStorage.getItem(storageKey);
    setGrades(savedGrades ? JSON.parse(savedGrades) : {});

    const savedStudents = localStorage.getItem(`students_${seccion}`);
    setStudents(savedStudents ? JSON.parse(savedStudents) : Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      name: `Estudiante ${index + 1}`
    })));
  }, [seccion, asignatura, storageKey]);

  const groups = [
    { id: 'CE1', label: 'CE1' },
    { id: 'CE2_3', label: 'CE2 Y CE3' },
    { id: 'CE4_7', label: 'CE4 Y CE7' },
    { id: 'CE5_6', label: 'CE5 Y CE6' },
  ];

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!docente) {
      alert('Por favor, seleccione primero su nombre en el menú de Docentes para autenticarse en su asignatura.');
      return;
    }
    const currentSubjectPin = subjectPins[asignatura] || '1234';
    if (claveInput === currentSubjectPin || claveInput === ADMIN_MASTER_PIN) {
      setIsUnlocked(true);
      alert(`¡Acceso concedido para el/la docente ${docente} en la asignatura ${asignatura}! Edición habilitada.`);
    } else {
      alert('PIN incorrecto para esta asignatura. PIN por defecto: 1234. O utilice el botón de Recuperación de Contraseña.');
    }
  };

  const handleRecuperarPassword = () => {
    const rootPinIngresado = prompt(`--- RECUPERACIÓN DE CONTRASEÑA ---\n\nEl PIN por defecto de cualquier asignatura es: 1234\n\nSi fue modificado, ingrese la Llave Maestra de Administración del Centro (${ADMIN_MASTER_PIN}) para blanquear y restablecer el PIN de "${asignatura}" a '1234':`);
    
    if (rootPinIngresado === ADMIN_MASTER_PIN) {
      const updatedPins = { ...subjectPins, [asignatura]: '1234' };
      setSubjectPins(updatedPins);
      localStorage.setItem('educlet_subject_pins', JSON.stringify(updatedPins));
      setClaveInput('1234');
      alert(`¡Contraseña restablecida exitosamente!\nEl PIN de la asignatura "${asignatura}" vuelve a ser: 1234`);
    } else if (rootPinIngresado !== null) {
      alert('Llave maestra incorrecta. Contacte a la Dirección del centro.');
    }
  };

  const handleChangeDocentePasswordSubmit = (e) => {
    e.preventDefault();
    if (!docente) {
      alert('Seleccione un docente activo primero.');
      return;
    }
    const currentPin = subjectPins[asignatura] || '1234';
    if (docentePasswordActual !== currentPin && docentePasswordActual !== ADMIN_MASTER_PIN) {
      alert('El PIN actual ingresado no es correcto para esta asignatura.');
      return;
    }
    if (docentePasswordNueva.length < 4) {
      alert('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (docentePasswordNueva !== docentePasswordConfirmar) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }

    const updatedPins = { ...subjectPins, [asignatura]: docentePasswordNueva };
    setSubjectPins(updatedPins);
    localStorage.setItem('educlet_subject_pins', JSON.stringify(updatedPins));
    alert(`¡Contraseña de la asignatura "${asignatura}" cambiada con éxito para ${docente}!`);
    setDocentePasswordActual('');
    setDocentePasswordNueva('');
    setDocentePasswordConfirmar('');
    setShowDocentePasswordModal(false);
  };

  const handleSavePermanently = () => {
    if (!isUnlocked) {
      alert('Debe desbloquear la asignatura con sus credenciales para guardar los cambios.');
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(grades));
    localStorage.setItem(`students_${seccion}`, JSON.stringify(students));
    alert(`¡Cambios guardados permanentemente para el docente ${docente || 'Sin asignar'} en la sección ${seccion} (${asignatura})!`);
  };

  const handleAddDocente = () => {
    const nuevoNombreDocente = prompt("Ingrese el nombre completo del nuevo docente:");
    if (nuevoNombreDocente && nuevoNombreDocente.trim() !== "") {
      const nombreLimpio = nuevoNombreDocente.trim();
      if (!docentesList.includes(nombreLimpio)) {
        const updatedList = [...docentesList, nombreLimpio].sort();
        setDocentesList(updatedList);
        localStorage.setItem('educlet_docentes_list', JSON.stringify(updatedList));
        setDocente(nombreLimpio);
        alert(`Docente ${nombreLimpio} agregado y seleccionado correctamente.`);
      } else {
        alert("Este docente ya se encuentra registrado en el listado.");
      }
    }
  };

  const handleRemoveDocente = () => {
    if (!docente) {
      alert("Por favor, seleccione primero un docente en el menú desplegable para poder eliminarlo.");
      return;
    }
    if (window.confirm(`¿Está seguro de eliminar a "${docente}" del listado de docentes de este centro?`)) {
      const updatedList = docentesList.filter(d => d !== docente);
      setDocentesList(updatedList);
      localStorage.setItem('educlet_docentes_list', JSON.stringify(updatedList));
      setDocente('');
      alert("Docente eliminado del listado correctamente.");
    }
  };

  const handleAddStudent = () => {
    if (!isUnlocked) {
      alert('Debe desbloquear la edición para agregar estudiantes.');
      return;
    }
    const nuevoNombre = prompt("Ingrese el nombre del nuevo estudiante:");
    if (nuevoNombre && nuevoNombre.trim() !== "") {
      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const updatedStudents = [...students, { id: newId, name: nuevoNombre.trim() }];
      setStudents(updatedStudents);
      localStorage.setItem(`students_${seccion}`, JSON.stringify(updatedStudents));
    }
  };

  const handleDeleteSelectedStudent = () => {
    if (!isUnlocked) {
      alert('Debe desbloquear la edición para eliminar estudiantes.');
      return;
    }
    if (!selectedStudentIdToDelete) {
      alert("Por favor, seleccione en el menú desplegable el estudiante que desea eliminar.");
      return;
    }
    const studentObj = students.find(s => s.id === Number(selectedStudentIdToDelete));
    if (studentObj) {
      if (window.confirm(`¿Está completamente seguro de eliminar al estudiante "${studentObj.name}"? Se borrará su fila y calificaciones asociadas en esta sección.`)) {
        const updatedStudents = students.filter(s => s.id !== Number(selectedStudentIdToDelete));
        setStudents(updatedStudents);
        localStorage.setItem(`students_${seccion}`, JSON.stringify(updatedStudents));
        setSelectedStudentIdToDelete('');
        alert(`Estudiante eliminado correctamente.`);
      }
    }
  };

  const handleStudentNameChange = (studentId, newName) => {
    if (!isUnlocked) return;
    const updatedStudents = students.map(st => st.id === studentId ? { ...st, name: newName } : st);
    setStudents(updatedStudents);
    localStorage.setItem(`students_${seccion}`, JSON.stringify(updatedStudents));
  };

  const handleImportList = () => {
    if (!isUnlocked) {
      alert('Debe desbloquear la edición para importar listados.');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
              setStudents(imported);
              localStorage.setItem(`students_${seccion}`, JSON.stringify(imported));
              alert('Listado importado correctamente.');
            }
          } catch (err) {
            alert('Error al leer el archivo.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAddAsignatura = () => {
    const nuevaAsig = prompt("Ingrese el nombre de la nueva asignatura:");
    if (nuevaAsig && nuevaAsig.trim() !== "") {
      const cleanName = nuevaAsig.trim();
      setSubjectPins(prev => {
        const updated = { ...prev, [cleanName]: '1234' };
        localStorage.setItem('educlet_subject_pins', JSON.stringify(updated));
        return updated;
      });
      setAsignatura(cleanName);
      setIsUnlocked(false);
      alert(`Asignatura ${cleanName} agregada exitosamente (PIN por defecto: 1234).`);
    }
  };

  const handleEliminarAsignatura = () => {
    const asignaturasDisponibles = Object.keys(subjectPins);
    if (asignaturasDisponibles.length <= 1) {
      alert("No se puede eliminar la última asignatura restante.");
      return;
    }
    const asigStr = asignaturasDisponibles.join(", ");
    const asigAEliminar = prompt(`Asignaturas actuales:\n${asigStr}\n\nEscriba exactamente el nombre de la asignatura que desea eliminar:`);

    if (asigAEliminar && asigAEliminar.trim() !== "") {
      const cleanTarget = asigAEliminar.trim();
      if (subjectPins[cleanTarget] !== undefined) {
        if (window.confirm(`¿Está seguro de eliminar la asignatura "${cleanTarget}"? Se borrarán sus PINs y datos asociados.`)) {
          const updatedPins = { ...subjectPins };
          delete updatedPins[cleanTarget];
          setSubjectPins(updatedPins);
          localStorage.setItem('educlet_subject_pins', JSON.stringify(updatedPins));
          
          const remaining = Object.keys(updatedPins);
          setAsignatura(remaining[0]);
          setIsUnlocked(false);
          alert(`Asignatura "${cleanTarget}" eliminada correctamente.`);
        }
      } else {
        alert("La asignatura ingresada no existe en el listado.");
      }
    }
  };

  const handleAddSeccion = () => {
    const cicloDestino = prompt("Seleccione el ciclo para la nueva sección:\n1. 1er Ciclo (1ro, 2do, 3ro)\n2. 2do Ciclo (4to, 5to, 6to)\n(Escriba '1' o '2')");
    if (cicloDestino === '1' || cicloDestino === '2') {
      const nombreCicloKey = cicloDestino === '1' ? "1er Ciclo (1ro, 2do, 3ro)" : "2do Ciclo (4to, 5to, 6to)";
      const nuevaSecNombre = prompt(`Ingrese el nombre de la nueva sección para ${nombreCicloKey} (Ej: 3ERO G):`);
      
      if (nuevaSecNombre && nuevaSecNombre.trim() !== "") {
        const cleanSec = nuevaSecNombre.trim().toUpperCase();
        setSeccionesData(prev => {
          const cicloActualizado = [...prev[nombreCicloKey], cleanSec];
          const nuevoObjetoSecciones = {
            ...prev,
            [nombreCicloKey]: cicloActualizado
          };
          localStorage.setItem('educlet_secciones_data', JSON.stringify(nuevoObjetoSecciones));
          return nuevoObjetoSecciones;
        });
        setCiclo(nombreCicloKey);
        setSeccion(cleanSec);
        alert(`¡Sección ${cleanSec} agregada y seleccionada con éxito en ${nombreCicloKey}!`);
      }
    } else if (cicloDestino !== null) {
      alert("Opción de ciclo no válida. Ingrese 1 o 2.");
    }
  };

  const handleEliminarSeccion = () => {
    const cicloKey = prompt("Seleccione el ciclo de la sección a eliminar:\n1. 1er Ciclo (1ro, 2do, 3ro)\n2. 2do Ciclo (4to, 5to, 6to)\n(Escriba '1' o '2')");
    if (cicloKey === '1' || cicloKey === '2') {
      const selectedCicloName = cicloKey === '1' ? "1er Ciclo (1ro, 2do, 3ro)" : "2do Ciclo (4to, 5to, 6to)";
      const seccionesDisponibles = seccionesData[selectedCicloName].join(", ");
      const secAEliminar = prompt(`Secciones en ${selectedCicloName}:\n${seccionesDisponibles}\n\nEscriba exactamente el nombre de la sección que desea eliminar:`);

      if (secAEliminar && secAEliminar.trim() !== "") {
        const cleanTarget = secAEliminar.trim().toUpperCase();
        if (seccionesData[selectedCicloName].includes(cleanTarget)) {
          if (window.confirm(`¿Está completamente seguro de eliminar la sección ${cleanTarget} del sistema? Se borrarán sus datos asociados.`)) {
            setSeccionesData(prev => {
              const nuevoObjetoSecciones = {
                ...prev,
                [selectedCicloName]: prev[selectedCicloName].filter(s => s !== cleanTarget)
              };
              localStorage.setItem('educlet_secciones_data', JSON.stringify(nuevoObjetoSecciones));
              return nuevoObjetoSecciones;
            });
            localStorage.removeItem(`students_${cleanTarget}`);
            alert(`Sección ${cleanTarget} eliminada correctamente.`);
          }
        } else {
          alert('La sección ingresada no coincide con ninguna en la lista.');
        }
      }
    }
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    if (adminPinInput === ADMIN_MASTER_PIN || adminPinInput === subjectPins[targetSubjectToChange]) {
      if (!newSubjectPin || newSubjectPin.length < 4) {
        alert('El nuevo PIN debe tener al menos 4 caracteres.');
        return;
      }
      const updatedPins = { ...subjectPins, [targetSubjectToChange]: newSubjectPin };
      setSubjectPins(updatedPins);
      localStorage.setItem('educlet_subject_pins', JSON.stringify(updatedPins));
      alert(`¡PIN de seguridad actualizado exitosamente para ${targetSubjectToChange}!`);
      setAdminPinInput('');
      setNewSubjectPin('');
      setShowConfigModal(false);
    } else {
      alert('Credenciales inválidas. Se requiere el PIN anterior de la asignatura o la identificación raíz del Administrador.');
    }
  };

  const handleGradeChange = (studentId, group, periodField, value) => {
    if (!isUnlocked) {
      alert('Debe desbloquear la edición introduciendo el PIN autorizado de la asignatura.');
      return;
    }
    const numValue = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));

    setGrades(prev => {
      const studentData = prev[studentId] || {};
      const groupData = studentData[group] || {};
      const updatedGroupData = {
        ...groupData,
        [periodField]: numValue
      };

      const getValidPeriodVal = (pKey, rpKey) => {
        const p = updatedGroupData[pKey];
        const rp = updatedGroupData[rpKey];
        const pNum = (p !== '' && p !== undefined) ? Number(p) : null;
        const rpNum = (rp !== '' && rp !== undefined) ? Number(rp) : null;

        let finalVal = pNum;
        if (rpNum !== null && (pNum === null || rpNum > pNum)) {
          finalVal = rpNum;
        }
        return finalVal;
      };

      const val1 = getValidPeriodVal('p1', 'rp1');
      const val2 = getValidPeriodVal('p2', 'rp2');
      const val3 = getValidPeriodVal('p3', 'rp3');
      const val4 = getValidPeriodVal('p4', 'rp4');

      const activeValues = [val1, val2, val3, val4].filter(v => v !== null && !isNaN(v) && v >= 70);

      if (activeValues.length > 0) {
        const sum = activeValues.reduce((acc, curr) => acc + curr, 0);
        updatedGroupData.cf = Math.round(sum / activeValues.length);
      } else {
        const allPresent = [val1, val2, val3, val4].filter(v => v !== null && !isNaN(v));
        if (allPresent.length > 0) {
          const sum = allPresent.reduce((acc, curr) => acc + curr, 0);
          updatedGroupData.cf = Math.round(sum / allPresent.length);
        } else {
          updatedGroupData.cf = '';
        }
      }

      const newState = {
        ...prev,
        [studentId]: {
          ...studentData,
          [group]: updatedGroupData
        }
      };

      localStorage.setItem(storageKey, JSON.stringify(newState));
      return newState;
    });
  };

  const calculateFinalSummary = (studentId) => {
    const getGroupCF = (gId) => {
      const cf = grades[studentId]?.[gId]?.cf;
      return (cf !== '' && cf !== undefined && !isNaN(cf)) ? Number(cf) : null;
    };

    const pc1Val = getGroupCF('CE1');
    const pc2Val = getGroupCF('CE2_3');
    const pc3Val = getGroupCF('CE4_7');
    const pc4Val = getGroupCF('CE5_6');

    const pcValues = [pc1Val, pc2Val, pc3Val, pc4Val].filter(v => v !== null);
    
    let finalCalification = '';
    if (pcValues.length > 0) {
      const sum = pcValues.reduce((acc, val) => acc + val, 0);
      finalCalification = Math.round(sum / pcValues.length);
    }

    return {
      pc1: pc1Val !== null ? pc1Val : '-',
      pc2: pc2Val !== null ? pc2Val : '-',
      pc3: pc3Val !== null ? pc3Val : '-',
      pc4: pc4Val !== null ? pc4Val : '-',
      finalCalification: finalCalification !== '' ? finalCalification : '-'
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Registro de Calificaciones - ${asignatura} (${seccion})`,
      text: `Registro oficial de calificaciones de la asignatura ${asignatura}, sección ${seccion}, docente: ${docente || 'Sin asignar'}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 font-sans relative">

      {/* Modal de Configuración y PINs (Admin) */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md shadow-2xl text-slate-800">
            <h3 className="text-slate-900 font-bold text-base mb-2">Panel de Seguridad y Administración</h3>
            <p className="text-xs text-slate-500 mb-4">
              Permite cambiar el PIN de cualquier asignatura utilizando credenciales de administrador o el PIN anterior.
            </p>
            <form onSubmit={handleSaveNewPin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Seleccionar Asignatura:</label>
                <select 
                  value={targetSubjectToChange}
                  onChange={(e) => setTargetSubjectToChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 font-semibold focus:outline-none focus:border-orange-500"
                >
                  {Object.keys(subjectPins).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-medium">PIN Actual o Llave Maestra de Administrador:</label>
                <input 
                  type="password"
                  placeholder="PIN anterior o Root PIN"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Nuevo PIN Privado para la Asignatura:</label>
                <input 
                  type="password"
                  placeholder="Nuevo PIN de 4+ dígitos"
                  value={newSubjectPin}
                  onChange={(e) => setNewSubjectPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 font-bold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowConfigModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded shadow-sm"
                >
                  Actualizar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Contraseña Individual del Docente */}
      {showDocentePasswordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md shadow-2xl text-slate-800">
            <h3 className="text-slate-900 font-bold text-base mb-1">Cambiar Contraseña de Asignatura</h3>
            <p className="text-xs text-slate-500 mb-4">
              Docente: <span className="font-semibold text-indigo-700">{docente || 'No seleccionado'}</span><br/>
              Asignatura: <span className="font-semibold text-indigo-700">{asignatura}</span><br/>
              Actualice su clave privada para evitar que otros docentes modifiquen sus registros.
            </p>
            <form onSubmit={handleChangeDocentePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">PIN Actual de la Asignatura:</label>
                <input 
                  type="password"
                  placeholder="Ingrese el PIN actual (ej. 1234)"
                  value={docentePasswordActual}
                  onChange={(e) => setDocentePasswordActual(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Nueva Contraseña Privada:</label>
                <input 
                  type="password"
                  placeholder="Nueva clave (mínimo 4 caracteres)"
                  value={docentePasswordNueva}
                  onChange={(e) => setDocentePasswordNueva(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Confirmar Nueva Contraseña:</label>
                <input 
                  type="password"
                  placeholder="Repita la nueva clave"
                  value={docentePasswordConfirmar}
                  onChange={(e) => setDocentePasswordConfirmar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowDocentePasswordModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded shadow-sm"
                >
                  Guardar Nueva Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Panel de Configuración General y Gestión */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl mb-6 shadow-md text-white">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h2 className="text-amber-400 font-bold text-xs tracking-wide uppercase flex items-center gap-2">
            ⚙️ CONFIGURACIÓN DE PRÁCTICA PEDAGÓGICA
          </h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowConfigModal(true)} className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded border border-slate-700 transition">
              ⚙️ Admin / PINs
            </button>
            <button onClick={handleAddDocente} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-xs transition">
              + Docente
            </button>
            <button onClick={handleRemoveDocente} className="bg-rose-900/60 hover:bg-rose-800/60 text-rose-200 text-xs font-semibold px-3 py-1.5 rounded border border-rose-700 transition">
              🗑️ Quitar Docente
            </button>
            <button onClick={handleAddAsignatura} className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
              + Asignatura
            </button>
            <button onClick={handleEliminarAsignatura} className="bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
              🗑️ Asignatura
            </button>
            <button onClick={handleAddSeccion} className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
              + Sección
            </button>
            <button onClick={handleEliminarSeccion} className="bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition">
              🗑️ Sección
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Docente:</label>
            <select 
              value={docente}
              onChange={(e) => setDocente(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="">Seleccione Docente</option>
              {docentesList.map((doc, i) => (
                <option key={i} value={doc}>{doc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Asignatura:</label>
            <select 
              value={asignatura} 
              onChange={(e) => {
                setAsignatura(e.target.value);
                setIsUnlocked(false);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              {Object.keys(subjectPins).map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Ciclo Educativo:</label>
            <select 
              value={ciclo} 
              onChange={(e) => {
                const newCiclo = e.target.value;
                setCiclo(newCiclo);
                setSeccion(seccionesData[newCiclo][0]);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="1er Ciclo (1ro, 2do, 3ro)">1er Ciclo (1ro, 2do, 3ro)</option>
              <option value="2do Ciclo (4to, 5to, 6to)">2do Ciclo (4to, 5to, 6to)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Sección Correspondiente:</label>
            <select 
              value={seccion} 
              onChange={(e) => setSeccion(e.target.value)}
              className="w-full bg-amber-400 border border-amber-500 rounded p-2 text-slate-950 focus:outline-none font-extrabold shadow-xs"
            >
              {seccionesData[ciclo].map((sec, i) => (
                <option key={i} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zona de Seguridad con PIN */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🔒</span>
            <div>
              <span className="font-semibold text-slate-200">Seguridad de Calificaciones: {asignatura}</span>
              <p className="text-[11px] text-slate-400">
                {isUnlocked ? '✨ Desbloqueado para edición' : 'Protegido para evitar cambios de terceros. PIN por defecto: 1234'}
              </p>
            </div>
          </div>
          
          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="flex items-center gap-2">
              <input 
                type="password"
                placeholder="PIN Asignatura"
                value={claveInput}
                onChange={(e) => setClaveInput(e.target.value)}
                className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-white font-mono text-center w-28 focus:outline-none focus:border-amber-400"
                required
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded transition">
                Desbloquear
              </button>
              <button 
                type="button"
                onClick={() => setShowDocentePasswordModal(true)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded transition"
              >
                Cambiar Clave
              </button>
              <button 
                type="button"
                onClick={handleRecuperarPassword}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded transition"
              >
                Recuperar Clave
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded font-bold">
                Edición Habilitada ✅
              </span>
              <button 
                type="button"
                onClick={() => setShowDocentePasswordModal(true)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded transition"
              >
                Cambiar Clave
              </button>
              <button 
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="bg-rose-700 hover:bg-rose-600 text-white font-semibold px-3 py-1.5 rounded transition"
              >
                Bloquear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner de la Sección Activa */}
      <div className="bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-900 text-white p-5 rounded-xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="bg-slate-950/40 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            2DO CICLO – {seccion}
          </span>
          <h1 className="text-2xl font-black tracking-wide mt-1">{asignatura}</h1>
          <p className="text-xs text-slate-200 font-medium">
            Docente: <span className="underline font-bold">{docente || 'Sin asignar'}</span> | Registro oficial de calificaciones y competencias MINERD
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Botones de Imprimir y Compartir añadidos */}
          <button 
            onClick={handlePrint}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm backdrop-blur-xs"
            title="Imprimir Registro"
          >
            🖨️ Imprimir
          </button>
          <button 
            onClick={handleShare}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm backdrop-blur-xs"
            title="Compartir Calificaciones"
          >
            🔗 Compartir
          </button>
          <div className="bg-slate-950/60 border border-white/10 px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ESTADO DE SESIÓN</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 justify-end ${isUnlocked ? 'text-emerald-400' : 'text-amber-300'}`}>
              {isUnlocked ? '🔓 Desbloqueado (Edición Activa)' : '🔒 Bloqueado (Seguro)'}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Acciones de Estudiantes y Listado */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-sm text-slate-900">Calificaciones por Grupos de Competencias</h3>
          <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2.5 py-0.5 rounded-full border border-slate-200">
            Sección: {seccion}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleImportList}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            📁 Importar Listado
          </button>
          <button 
            onClick={handleAddStudent}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            + Agregar Estudiante
          </button>
          <span className="bg-slate-100 text-slate-700 font-extrabold text-xs px-3 py-2 rounded-lg border border-slate-200">
            MATRÍCULA: {students.length}
          </span>
        </div>
      </div>

      {/* Barra inferior de gestión de filas y guardado manual */}
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Sección activa: <strong className="text-slate-800">{seccion}</strong> ({ciclo})</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStudentIdToDelete}
            onChange={(e) => setSelectedStudentIdToDelete(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium text-xs focus:outline-none"
          >
            <option value="">-- Seleccionar estudiante a eliminar --</option>
            {students.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
          <button 
            onClick={handleDeleteSelectedStudent}
            className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 px-3 py-1.5 rounded font-semibold transition"
          >
            Eliminar Estudiante
          </button>
          <button 
            onClick={handleSavePermanently}
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-1.5 rounded font-bold shadow transition flex items-center gap-1.5"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </div>

      {/* Tabla Oficial de Calificaciones con Estudiantes Fijos (Sticky Column) y Celdas Anchas */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead className="sticky top-0 z-30 shadow-xs">
            <tr className="bg-slate-900 text-white text-center font-bold">
              <th className="p-3 border-r border-slate-800 w-12 sticky left-0 z-40 bg-slate-900">No.</th>
              <th className="p-3 border-r border-slate-800 min-w-[240px] sticky left-12 z-40 bg-slate-900 text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">Nombres de los Estudiantes</th>
              {groups.map(g => (
                <th key={g.id} colSpan="9" className="p-2 border-r border-slate-800 bg-slate-800">
                  {g.label}
                </th>
              ))}
              <th colSpan="5" className="p-2 bg-indigo-950">RESUMEN FINAL</th>
            </tr>
            <tr className="bg-slate-800 text-slate-200 text-center font-semibold text-[11px]">
              <th className="p-2 border-r border-slate-700 sticky left-0 z-40 bg-slate-800"></th>
              <th className="p-2 border-r border-slate-700 sticky left-12 z-40 bg-slate-800 text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">Competencias Específicas MINERD</th>
              {groups.map(g => (
                <React.Fragment key={g.id}>
                  <th className="p-2 border-r border-slate-700 bg-slate-900/60 min-w-[42px]" title="Período 1">P1</th>
                  <th className="p-2 border-r border-slate-700 bg-slate-900/60 min-w-[42px]" title="Recuperación P1">RP1</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Período 2">P2</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Recuperación P2">RP2</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Período 3">P3</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Recuperación P3">RP3</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Período 4">P4</th>
                  <th className="p-2 border-r border-slate-700 min-w-[42px]" title="Recuperación P4">RP4</th>
                  <th className="p-2 border-r border-slate-700 bg-amber-950/50 text-amber-300 min-w-[45px]" title="Calificación Final del Grupo">CF</th>
                </React.Fragment>
              ))}
              <th className="p-2 border-r border-indigo-900 bg-indigo-900 min-w-[45px]">PC1</th>
              <th className="p-2 border-r border-indigo-900 bg-indigo-900 min-w-[45px]">PC2</th>
              <th className="p-2 border-r border-indigo-900 bg-indigo-900 min-w-[45px]">PC3</th>
              <th className="p-2 border-r border-indigo-900 bg-indigo-900 min-w-[45px]">PC4</th>
              <th className="p-2 bg-purple-950 text-purple-200 min-w-[48px]">CF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {students.map((st, index) => {
              const summary = calculateFinalSummary(st.id);
              return (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 text-center font-bold text-slate-500 border-r border-slate-200 bg-slate-100 sticky left-0 z-20">
                    {index + 1}
                  </td>
                  <td className="p-2 border-r border-slate-200 bg-white sticky left-12 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <input 
                      type="text"
                      value={st.name}
                      onChange={(e) => handleStudentNameChange(st.id, e.target.value)}
                      disabled={!isUnlocked}
                      className={`w-full bg-transparent px-1.5 py-1 rounded text-slate-800 font-semibold focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 ${!isUnlocked ? 'cursor-default' : ''}`}
                    />
                  </td>
                  {groups.map(g => {
                    const gData = grades[st.id]?.[g.id] || {};
                    return (
                      <React.Fragment key={g.id}>
                        {['p1', 'rp1', 'p2', 'rp2', 'p3', 'rp3', 'p4', 'rp4'].map(field => (
                          <td key={field} className="p-1.5 border-r border-slate-200 text-center">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={gData[field] !== undefined ? gData[field] : ''}
                              onChange={(e) => handleGradeChange(st.id, g.id, field, e.target.value)}
                              disabled={!isUnlocked}
                              placeholder="-"
                              className="w-10 text-center bg-slate-50/50 border border-slate-300 rounded py-1.5 text-slate-900 text-xs font-extrabold focus:bg-white focus:border-amber-500 focus:outline-none shadow-2xs"
                            />
                          </td>
                        ))}
                        <td className="p-1.5 border-r border-slate-200 text-center font-black bg-amber-50/60 text-amber-900">
                          {gData.cf !== undefined && gData.cf !== '' ? gData.cf : '-'}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="p-1.5 border-r border-slate-200 text-center font-bold text-indigo-900 bg-indigo-50/40">{summary.pc1}</td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-bold text-indigo-900 bg-indigo-50/40">{summary.pc2}</td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-bold text-indigo-900 bg-indigo-50/40">{summary.pc3}</td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-bold text-indigo-900 bg-indigo-50/40">{summary.pc4}</td>
                  <td className="p-1.5 text-center font-black text-purple-900 bg-purple-100/60">{summary.finalCalification}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroCalificaciones;