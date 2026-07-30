import React, { useState, useEffect } from 'react';
import { Role, Show, BlogPost } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { AdminShowsTab } from '../../components/admin/AdminShowsTab';
import { AdminReplicheTab } from '../../components/admin/AdminReplicheTab';
import { AdminBlogTab } from '../../components/admin/AdminBlogTab';
import { AdminMediaTab } from '../../components/admin/AdminMediaTab';
import { AdminSiteConfigTab } from '../../components/admin/AdminSiteConfigTab';
import { AdminAuditLogsTab } from '../../components/admin/AdminAuditLogsTab';
import { AdminPrenotazioniTab } from '../../components/admin/AdminPrenotazioniTab';
import { AdminCastTab } from '../../components/admin/AdminCastTab';
import { AdminProfileTab } from '../../components/admin/AdminProfileTab';
import { AdminPreviewModal } from '../../components/admin/AdminPreviewModal';
import {
  LayoutDashboard,
  Film,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Settings,
  History,
  Users,
  LogOut,
  Ticket,
  Plus,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'prenotazioni' | 'spettacoli' | 'repliche' | 'cast' | 'blog' | 'media' | 'impostazioni' | 'profilo' | 'audit'
  >('dashboard');

  // Preview Modal State
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    type: 'show' | 'blog';
    data: Show | BlogPost | null;
  }>({
    isOpen: false,
    type: 'show',
    data: null,
  });

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

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRecoveryMessage('');
    setIsRecoveryLoading(true);

    try {
      const response = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await response.json();
      
      if (data.success) {
        setRecoveryMessage(data.message);
      } else {
        setLoginError(data.error || 'Errore durante il recupero');
      }
    } catch (err: any) {
      setLoginError('Errore di connessione');
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-nero-palco flex items-center justify-center text-white">Caricamento...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-nero-palco flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1A0505]/40 border border-[#FFFFFF]/20 p-8 rounded-2xl glass-panel">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/40 shadow-xl mx-auto mb-4 bg-black">
              <img src="/logo.svg" alt="Il Sipario Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <h1 className="font-serif-display text-3xl font-bold text-white">Area Riservata</h1>
            <p className="text-gray-400 mt-2 text-sm">Accesso riservato allo staff de Il Sipario</p>
          </div>

          {isRecoveringPassword ? (
            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Email</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full bg-[#050505]/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-rosso-sipario transition-colors" />
              </div>
              
              {loginError && <div className="text-rosso-sipario text-sm font-semibold">{loginError}</div>}
              {recoveryMessage && <div className="text-green-500 text-sm font-semibold">{recoveryMessage}</div>}
              
              <button type="submit" disabled={isRecoveryLoading} className="w-full bg-rosso-sipario text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-700 transition-colors disabled:opacity-50">
                {isRecoveryLoading ? 'Invio in corso...' : 'Recupera Password'}
              </button>
              
              <div className="mt-4 text-center">
                <button type="button" onClick={() => { setIsRecoveringPassword(false); setLoginError(''); setRecoveryMessage(''); }} className="text-sm text-gray-400 hover:text-white transition-colors">Torna al Login</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Email</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full bg-[#050505]/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-rosso-sipario transition-colors" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold">Password</label>
                  <button type="button" onClick={() => { setIsRecoveringPassword(true); setLoginError(''); }} className="text-xs text-gray-400 hover:text-white transition-colors">Dimenticata?</button>
                </div>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full bg-[#050505]/50 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-rosso-sipario transition-colors" />
              </div>
              {loginError && <div className="text-rosso-sipario text-sm font-semibold">{loginError}</div>}
              <button type="submit" className="w-full bg-rosso-sipario text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-700 transition-colors">
                Accedi
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Torna al sito</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#050505] border-r border-[#FFFFFF]/30 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#FFFFFF]/20 pb-4">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#FFFFFF]/40 shadow-md bg-black shrink-0">
              <img src="/logo.svg" alt="Il Sipario Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="font-serif-display font-bold text-sm text-[#FFFFFF] block">Pannello Gestione</span>
              <span className="text-[10px] text-[#FFFFFF] uppercase font-semibold block">Il Sipario A.P.S.</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Panoramica', icon: LayoutDashboard, roles: ['admin', 'editor', 'box_office'] },
              { id: 'prenotazioni', label: 'Prenotazioni Ricevute', icon: Ticket, roles: ['admin', 'box_office'] },
              { id: 'spettacoli', label: 'Spettacoli in Cartellone', icon: Film, roles: ['admin', 'editor'] },
              { id: 'repliche', label: 'Date & Repliche', icon: Calendar, roles: ['admin', 'box_office'] },
              { id: 'cast', label: 'Cast & Compagnia', icon: Users, roles: ['admin', 'editor'] },
              { id: 'blog', label: 'Notizie & Novità', icon: BookOpen, roles: ['admin', 'editor'] },
              { id: 'media', label: 'Foto e Locandine', icon: ImageIcon, roles: ['admin', 'editor'] },
              { id: 'impostazioni', label: 'Dati e Contatti Compagnia', icon: Settings, roles: ['admin'] },
              { id: 'profilo', label: 'Il Mio Profilo', icon: Users, roles: ['admin', 'editor', 'box_office'] },
              { id: 'audit', label: 'Registro Modifiche', icon: History, roles: ['admin', 'editor'] },
            ].map((item) => {
              const hasAccess = item.roles.includes(currentRole);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  disabled={!hasAccess}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                    activeTab === item.id
                      ? 'bg-[#E60000] text-[#FFFFFF] border border-[#FFFFFF]/60 shadow-lg font-bold'
                      : hasAccess
                      ? 'text-[#FFFFFF]/80 hover:bg-[#1A0505]/30 hover:text-[#FFFFFF]'
                      : 'opacity-40 cursor-not-allowed text-[#FFFFFF]/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#FFFFFF]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#FFFFFF]/20">
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline font-semibold focus:outline-none"><LogOut className="w-4 h-4" /> Esci dall'Area Riservata</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Active Tab View Rendering */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="border-b border-[#FFFFFF]/30 pb-6">
              <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
                Associazione Teatrale "Il Sipario" A.P.S.
              </span>
              <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#FFFFFF] mt-1">
                Pannello di Gestione
              </h1>
              <p className="text-xs sm:text-sm text-[#FFFFFF]/80 mt-1">
                Benvenuto nell'area di amministrazione. Da qui puoi gestire gli spettacoli, inserire le date delle repliche con orari e prezzi, caricare gli attori del cast e consultare le prenotazioni.
              </p>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('spettacoli')}
                className="p-5 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1 cursor-pointer hover:border-white transition"
              >
                <span className="text-[11px] text-[#FFFFFF]/80 uppercase font-semibold block">Spettacoli in Cartellone</span>
                <span className="font-serif-display text-3xl font-bold text-[#FFFFFF] block">3</span>
                <span className="text-[11px] text-rosso-sipario font-semibold flex items-center gap-1">Gestisci Spettacoli &rarr;</span>
              </div>

              <div
                onClick={() => setActiveTab('repliche')}
                className="p-5 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1 cursor-pointer hover:border-white transition"
              >
                <span className="text-[11px] text-[#FFFFFF]/80 uppercase font-semibold block">Date & Repliche</span>
                <span className="font-serif-display text-3xl font-bold text-[#FFFFFF] block">2</span>
                <span className="text-[11px] text-rosso-sipario font-semibold flex items-center gap-1">Aggiungi Date &rarr;</span>
              </div>

              <div
                onClick={() => setActiveTab('cast')}
                className="p-5 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1 cursor-pointer hover:border-white transition"
              >
                <span className="text-[11px] text-[#FFFFFF]/80 uppercase font-semibold block">Attori & Cast</span>
                <span className="font-serif-display text-3xl font-bold text-[#FFFFFF] block">5</span>
                <span className="text-[11px] text-rosso-sipario font-semibold flex items-center gap-1">Aggiungi Attori &rarr;</span>
              </div>

              <div
                onClick={() => setActiveTab('prenotazioni')}
                className="p-5 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1 cursor-pointer hover:border-white transition"
              >
                <span className="text-[11px] text-[#FFFFFF]/80 uppercase font-semibold block">Prenotazioni Ricevute</span>
                <span className="font-serif-display text-3xl font-bold text-[#FFFFFF] block">3</span>
                <span className="text-[11px] text-rosso-sipario font-semibold flex items-center gap-1">Vedi Prenotazioni &rarr;</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-[#0A0A0A] border border-white/20 p-6 rounded-xl space-y-4">
              <h2 className="font-serif-display text-xl font-bold text-white">Scorciatoie Rapide</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('spettacoli')}
                  className="p-4 bg-black border border-white/30 rounded-lg text-left hover:border-rosso-sipario transition space-y-1 group"
                >
                  <Film className="w-5 h-5 text-rosso-sipario mb-2" />
                  <span className="font-bold text-xs text-white block group-hover:text-rosso-sipario">Aggiungi Spettacolo</span>
                  <span className="text-[11px] text-gray-400 block">Crea la scheda di un nuovo spettacolo</span>
                </button>

                <button
                  onClick={() => setActiveTab('repliche')}
                  className="p-4 bg-black border border-white/30 rounded-lg text-left hover:border-rosso-sipario transition space-y-1 group"
                >
                  <Calendar className="w-5 h-5 text-rosso-sipario mb-2" />
                  <span className="font-bold text-xs text-white block group-hover:text-rosso-sipario">Programma Nuova Data</span>
                  <span className="text-[11px] text-gray-400 block">Inserisci data, orario e prezzi biglietti</span>
                </button>

                <button
                  onClick={() => setActiveTab('cast')}
                  className="p-4 bg-black border border-white/30 rounded-lg text-left hover:border-rosso-sipario transition space-y-1 group"
                >
                  <Users className="w-5 h-5 text-rosso-sipario mb-2" />
                  <span className="font-bold text-xs text-white block group-hover:text-rosso-sipario">Gestisci Cast e Foto</span>
                  <span className="text-[11px] text-gray-400 block">Inserisci attori, ruoli e fotografie</span>
                </button>

                <button
                  onClick={() => setActiveTab('prenotazioni')}
                  className="p-4 bg-black border border-white/30 rounded-lg text-left hover:border-rosso-sipario transition space-y-1 group"
                >
                  <Ticket className="w-5 h-5 text-rosso-sipario mb-2" />
                  <span className="font-bold text-xs text-white block group-hover:text-rosso-sipario">Consulta Prenotazioni</span>
                  <span className="text-[11px] text-gray-400 block">Elenco degli spettatori prenotati</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prenotazioni' && <AdminPrenotazioniTab role={currentRole} />}

        {activeTab === 'spettacoli' && (
          <AdminShowsTab
            role={currentRole}
            onOpenPreview={(show) => setPreviewState({ isOpen: true, type: 'show', data: show })}
          />
        )}

        {activeTab === 'repliche' && <AdminReplicheTab role={currentRole} />}

        {activeTab === 'cast' && <AdminCastTab role={currentRole} />}

        {activeTab === 'blog' && (
          <AdminBlogTab
            role={currentRole}
            onOpenPreview={(post) => setPreviewState({ isOpen: true, type: 'blog', data: post })}
          />
        )}

        {activeTab === 'media' && <AdminMediaTab role={currentRole} />}

        {activeTab === 'impostazioni' && <AdminSiteConfigTab role={currentRole} />}
        {activeTab === 'profilo' && <AdminProfileTab />}
        {activeTab === 'audit' && <AdminAuditLogsTab role={currentRole} />}
      </main>

      {/* Global Preview Modal */}
      <AdminPreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState({ ...previewState, isOpen: false })}
        type={previewState.type}
        data={previewState.data}
      />
    </div>
  );
};
