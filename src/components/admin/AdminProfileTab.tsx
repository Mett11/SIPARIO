import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TheatreRepository } from '../../lib/repository';

export const AdminProfileTab: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current user details
    fetch('/api/admin/me', {
      headers: {
        'Authorization': `Bearer ${TheatreRepository.getAdminToken()}`
      }
    })
    .then(r => r.json())
    .then(res => {
      if (res.success && res.data) {
        setEmail(res.data.email || '');
        setFullName(res.data.fullName || '');
      }
    })
    .catch(() => {});
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Devi inserire la tua password attuale per confermare le modifiche.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/admin/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TheatreRepository.getAdminToken()}`
        },
        body: JSON.stringify({ email, currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Errore durante l\'aggiornamento');
      }
      
      setSuccess('Profilo aggiornato con successo.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[#0A0A0A] border border-[#FFFFFF]/20 p-6 rounded-xl">
        <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF] mb-2">Impostazioni Profilo</h2>
        <p className="text-xs text-[#FFFFFF]/70 mb-6">
          Modifica l'indirizzo email e la password utilizzati per accedere all'area di amministrazione.
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-950 border border-red-500 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs text-red-500">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-950 border border-green-500 rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-500">{success}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#FFFFFF]/60 font-semibold mb-1">Nome Completo</label>
            <input
              type="text"
              value={fullName}
              disabled
              className="w-full bg-[#1A1A1A] border border-[#FFFFFF]/20 rounded-md px-3 py-2 text-sm text-[#FFFFFF]/50 cursor-not-allowed"
            />
            <p className="text-[10px] text-[#FFFFFF]/40 mt-1">Il nome è gestito a livello di sistema e non può essere modificato.</p>
          </div>
          
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#FFFFFF]/60 font-semibold mb-1">Indirizzo Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#050505] border border-[#FFFFFF]/30 rounded-md px-3 py-2 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#E60000]"
            />
          </div>
          
          <div className="pt-4 border-t border-[#FFFFFF]/10 mt-4">
            <h3 className="text-sm font-semibold text-[#FFFFFF] mb-4">Modifica Password (Opzionale)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#FFFFFF]/60 font-semibold mb-1">Nuova Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Lascia vuoto per non modificare"
                  className="w-full bg-[#050505] border border-[#FFFFFF]/30 rounded-md px-3 py-2 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#E60000]"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#FFFFFF]/10 mt-4">
            <h3 className="text-sm font-semibold text-rosso-sipario mb-4">Conferma Operazione</h3>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#FFFFFF]/60 font-semibold mb-1">Password Attuale *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                placeholder="Richiesta per salvare le modifiche"
                className="w-full bg-[#050505] border border-[#E60000]/50 rounded-md px-3 py-2 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#E60000]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading || !currentPassword}
              className="flex items-center gap-2 bg-[#E60000] text-[#FFFFFF] hover:bg-red-800 px-5 py-2 rounded-md font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
