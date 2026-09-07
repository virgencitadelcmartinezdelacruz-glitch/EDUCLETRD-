'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [institutionLogo, setInstitutionLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('educlet_institution_logo');
    if (savedLogo) {
      setInstitutionLogo(savedLogo);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInstitutionLogo(base64String);
        localStorage.setItem('educlet_institution_logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra Superior / Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center overflow-hidden shadow-md">
                {institutionLogo ? (
                  <img src={institutionLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>E</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <div>
              <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                EDUCLETRD
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Plataforma de Gestión Educativa <span className="text-slate-200 font-semibold">{institutionLogo ? '' : ''}</span>
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}