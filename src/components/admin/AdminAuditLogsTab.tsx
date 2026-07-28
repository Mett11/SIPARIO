import React, { useEffect, useState } from 'react';
import { Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { History, Filter, User, Calendar } from 'lucide-react';

interface AdminAuditLogsTabProps {
  role: Role;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({ role }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await TheatreRepository.getAuditLogs(role);
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [role]);

  const filteredLogs = filterAction === 'ALL' ? logs : logs.filter((l) => l.action === filterAction);

  const translateAction = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Creazione';
      case 'UPDATE': return 'Modifica';
      case 'DELETE': return 'Eliminazione';
      case 'PUBLISH': return 'Pubblicazione';
      case 'UNPUBLISH': return 'Bozza';
      default: return action;
    }
  };

  const translateEntityType = (type: string) => {
    switch (type) {
      case 'SHOW': return 'Spettacolo';
      case 'PERFORMANCE': return 'Replica / Data';
      case 'BLOG_POST': return 'Articolo / Notizia';
      case 'MEDIA': return 'Immagine / Locandina';
      case 'SITE_CONFIG': return 'Impostazioni Sito';
      case 'CAST': return 'Componente Cast';
      default: return type;
    }
  };

  const formatDetails = (details: Record<string, any>) => {
    const keys = Object.keys(details);
    if (keys.length === 0) return null;

    const parts = keys.map((k) => {
      let label = k;
      if (k === 'title') label = 'Titolo';
      if (k === 'name') label = 'Nome';
      if (k === 'slug') label = 'Indirizzo Web';
      if (k === 'publication_status') label = 'Stato Pubblicazione';
      if (k === 'action') label = 'Azione Cassa';
      if (k === 'code') label = 'Codice';
      if (k === 'fullName') label = 'Nome Spettatore';
      if (k === 'seatsCount') label = 'Posti';
      return `${label}: ${details[k]}`;
    });

    return parts.join(' • ');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
            <History className="w-6 h-6 text-[#FFFFFF]" /> Registro Modifiche & Attività
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Tracciamento in tempo reale di tutte le operazioni effettuate nell'area di gestione.
          </p>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#FFFFFF]" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-[#050505] border border-[#FFFFFF]/40 rounded p-2 text-[#FFFFFF]"
          >
            <option value="ALL">Tutte le Operazioni</option>
            <option value="CREATE">Creazioni</option>
            <option value="UPDATE">Modifiche</option>
            <option value="DELETE">Eliminazioni</option>
            <option value="PUBLISH">Pubblicazioni</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-[#FFFFFF]">Caricamento registro attività in corso...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-8 border border-dashed border-[#FFFFFF]/30 rounded-xl text-center text-xs text-[#FFFFFF]/70">
          Nessuna registrazione trovata per i filtri selezionati.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            let details = {};
            try {
              details = JSON.parse(log.detailsJson || '{}');
            } catch (e) {}

            const formattedDetailsText = formatDetails(details);

            return (
              <div
                key={log.id}
                className="bg-[#050505] border border-[#FFFFFF]/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                          : log.action === 'DELETE'
                          ? 'bg-red-950/80 border-red-500/50 text-red-300'
                          : log.action === 'PUBLISH'
                          ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
                          : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                      }`}
                    >
                      {translateAction(log.action)}
                    </span>
                    <span className="font-semibold text-[#FFFFFF]">{translateEntityType(log.entityType)}</span>
                  </div>

                  <div className="text-[#FFFFFF]/80 flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#FFFFFF]" /> {log.userEmail}
                    </span>
                    <span className="flex items-center gap-1 text-[#FFFFFF]/60">
                      <Calendar className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString('it-IT')}
                    </span>
                  </div>

                  {formattedDetailsText && (
                    <div className="p-2 bg-[#1A0505]/10 border border-[#FFFFFF]/20 rounded text-[11px] text-[#FFFFFF]/90 mt-1">
                      {formattedDetailsText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
