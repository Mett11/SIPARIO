const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminDashboardPage.tsx', 'utf8');

// Replace standard useState import with useEffect and useState
code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

const loginCode = `  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    TheatreRepository.getMe()
      .then(user => {
        setCurrentUser(user);
        setCurrentRole(user.roles[0]);
        setIsCheckingAuth(false);
      })
      .catch(() => {
        setCurrentUser(null);
        setIsCheckingAuth(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const user = await TheatreRepository.login(loginEmail, loginPassword);
      setCurrentUser(user);
      setCurrentRole(user.roles[0]);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = async () => {
    await TheatreRepository.logout();
    setCurrentUser(null);
    window.location.href = '/';
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-nero-palco flex items-center justify-center text-white">Caricamento...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-nero-palco flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1A0505]/40 border border-[#FFFFFF]/20 p-8 rounded-2xl glass-panel">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-rosso-sipario mx-auto rounded-full flex items-center justify-center font-serif-display font-bold text-white text-2xl mb-4">S</div>
            <h1 className="font-serif-display text-3xl font-bold text-white">Area Riservata</h1>
            <p className="text-gray-400 mt-2 text-sm">Accesso riservato allo staff de Il Sipario</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full bg-[#050505]/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-rosso-sipario transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full bg-[#050505]/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-rosso-sipario transition-colors" />
            </div>
            {loginError && <div className="text-rosso-sipario text-sm font-semibold">{loginError}</div>}
            <button type="submit" className="w-full bg-rosso-sipario text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-700 transition-colors">
              Accedi
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Torna al sito</a>
          </div>
        </div>
      </div>
    );
  }
`;

// Insert the login code into the component body
code = code.replace(/export const AdminDashboardPage: React\.FC = \(\) => \{\n/, "export const AdminDashboardPage: React.FC = () => {\n" + loginCode);

// Fix "Torna al Sito Pubblico" to actually logout
code = code.replace(/<a href="\/" className="flex items-center gap-2 text-xs text-\[#FFFFFF\] hover:underline font-semibold">\s*<LogOut className="w-4 h-4" \/> Torna al Sito Pubblico\s*<\/a>/, `<button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline font-semibold focus:outline-none"><LogOut className="w-4 h-4" /> Disconnetti e Torna al Sito</button>`);

// Remove the fake role selector
code = code.replace(/<div className="mb-6">\s*<label className="text-\[10px\] text-\[#FFFFFF\]\/50 uppercase tracking-widest font-bold mb-2 block">\s*Simula Ruolo\s*<\/label>[\s\S]*?<\/div>/, '');

fs.writeFileSync('src/pages/admin/AdminDashboardPage.tsx', code);
