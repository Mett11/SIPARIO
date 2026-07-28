import React, { useEffect, useState } from 'react';
import { Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { Image, Upload, Trash2, Copy, Check, AlertCircle, X, HardDrive } from 'lucide-react';

interface AdminMediaTabProps {
  role: Role;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({ role }) => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [filename, setFilename] = useState('');
  const [altText, setAltText] = useState('');
  const [dataBase64, setDataBase64] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await TheatreRepository.getAllMediaAssets();
      setMediaList(data);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Errore caricamento media R2' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    setAltText(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = () => {
      setDataBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename) return;

    setUploading(true);
    try {
      await TheatreRepository.uploadMediaAsset(
        {
          filename,
          altText,
          dataBase64: dataBase64 || undefined,
        },
        role
      );
      setFeedback({ type: 'success', message: `File "${filename}" caricato con successo su R2!` });
      setFilename('');
      setAltText('');
      setDataBase64(null);
      loadMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore durante l upload su R2' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    // if (!confirm(`Eliminare definitivamente "${name}" da R2?`)) return;
    try {
      await TheatreRepository.deleteMediaAsset(id, role);
      setFeedback({ type: 'success', message: 'Asset eliminato da R2.' });
      loadMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore eliminazione asset' });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-[#FFFFFF]" /> Libreria Media & R2 Storage
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Gestisci locandine, fotografie e risorse multimediali memorizzate sul bucket Cloudflare R2.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {feedback.message}
          </span>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-[#050505] border-2 border-[#FFFFFF]/40 p-6 rounded-xl space-y-4">
        <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
          <Upload className="w-5 h-5" /> Upload Protetto su Cloudflare R2
        </h3>

        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FFFFFF]/90 font-medium mb-1">Seleziona File da Caricare</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2 text-[#FFFFFF] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#1A0505] file:text-[#FFFFFF] file:text-xs"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF]/90 font-medium mb-1">Testo Alternativo (Alt Text)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Es. Locandina della commedia Fiat Voluntas Dei"
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !filename}
            className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] disabled:opacity-50 text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60 transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#FFFFFF]" />
            <span>{uploading ? 'Upload in corso...' : 'Carica Risorsa su R2'}</span>
          </button>
        </form>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mediaList.map((asset) => (
          <div
            key={asset.id}
            className="bg-[#050505] border border-[#FFFFFF]/30 p-4 rounded-xl space-y-3 hover:border-[#FFFFFF] transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-40 rounded-lg overflow-hidden border border-[#FFFFFF]/20 bg-black flex items-center justify-center">
                <img src={asset.filePath} alt={asset.altText} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-[#FFFFFF] block truncate">{asset.filename}</span>
                <span className="text-[10px] text-[#FFFFFF] block truncate font-mono">{asset.r2Key}</span>
                <span className="text-[10px] text-[#FFFFFF]/60 block">
                  {(asset.fileSize / 1024).toFixed(1)} KB — {new Date(asset.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#FFFFFF]/20">
              <button
                onClick={() => copyToClipboard(asset.filePath, asset.id)}
                className="flex-1 py-1.5 bg-[#1A0505]/30 border border-[#FFFFFF]/30 rounded text-[11px] text-[#FFFFFF] hover:bg-[#1A0505] transition flex items-center justify-center gap-1"
              >
                {copiedId === asset.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copiato!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copia URL
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(asset.id, asset.filename)}
                className="p-1.5 bg-red-950/40 border border-red-500/40 rounded text-red-300 hover:bg-red-900/60"
                title="Elimina Immagine"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
