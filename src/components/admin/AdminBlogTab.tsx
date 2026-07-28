import React, { useEffect, useState } from 'react';
import { BlogPost, Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { BookOpen, Plus, Edit2, Trash2, Eye, Globe, AlertCircle, X, Tag, User } from 'lucide-react';

interface AdminBlogTabProps {
  role: Role;
  onOpenPreview: (post: BlogPost) => void;
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ role, onOpenPreview }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await TheatreRepository.getAllBlogPosts(true);
      setPosts(data);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Errore caricamento blog' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await TheatreRepository.saveBlogPost(editingPost, role);
      setFeedback({ type: 'success', message: 'Articolo del blog salvato!' });
      setEditingPost(null);
      loadPosts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore salvataggio articolo' });
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const isPublished = post.status === 'published';
      await TheatreRepository.publishBlogPost(post.id, !isPublished, role);
      setFeedback({
        type: 'success',
        message: `Articolo "${post.title}" ${!isPublished ? 'pubblicato' : 'impostato come bozza'}!`,
      });
      loadPosts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore cambio stato' });
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    // if (!confirm(`Eliminare l'articolo "${title}"?`)) return;
    try {
      await TheatreRepository.deleteBlogPost(id, role);
      setFeedback({ type: 'success', message: 'Articolo eliminato.' });
      loadPosts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore eliminazione' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-6 rounded-xl">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#FFFFFF]" /> Gestione Blog & Notizie
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Redigi notizie, comunicati stampa e articoli sulla vita della compagnia.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingPost({
              title: '',
              slug: '',
              excerpt: '',
              content: '',
              coverUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200',
              category: 'Notizie & Stagione',
              publishedAt: new Date().toISOString().slice(0, 10),
              author: 'Compagnia Il Sipario',
              status: 'draft',
              validation_status: 'VALIDATED',
            })
          }
          className="px-4 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold text-xs rounded-lg border border-[#FFFFFF]/60 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4 text-[#FFFFFF]" /> Nuovo Articolo
        </button>
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

      {/* Editing Form */}
      {editingPost && (
        <div className="bg-[#050505] border-2 border-[#FFFFFF] p-6 rounded-xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#FFFFFF]/20 pb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
              {editingPost.id ? 'Modifica Articolo Blog' : 'Nuovo Articolo Blog'}
            </h3>
            <button onClick={() => setEditingPost(null)} className="text-[#FFFFFF]/60 hover:text-[#FFFFFF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSavePost} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Titolo Articolo *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      title: e.target.value,
                      slug: editingPost.slug || e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Categoria *</label>
                <input
                  type="text"
                  required
                  value={editingPost.category || 'Notizie & Stagione'}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Autore *</label>
                <input
                  type="text"
                  required
                  value={editingPost.author || 'Compagnia Il Sipario'}
                  onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Stato *</label>
                <select
                  value={editingPost.status || 'draft'}
                  onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="draft">Bozza (Draft)</option>
                  <option value="published">Pubblicato (Live)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-1">URL Immagine di Copertina *</label>
              <input
                type="text"
                required
                value={editingPost.coverUrl || ''}
                onChange={(e) => setEditingPost({ ...editingPost, coverUrl: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-1">Estratto Sintetico (Excerpt) *</label>
              <textarea
                required
                rows={2}
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-1">Contenuto Articolo *</label>
              <textarea
                required
                rows={8}
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF] font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#FFFFFF]/20">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60"
              >
                Salva Articolo
              </button>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-6 py-2.5 bg-[#050505] text-[#FFFFFF]/80 hover:text-[#FFFFFF] border border-[#FFFFFF]/30 rounded"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => {
          const isPub = post.status === 'published';
          return (
            <div
              key={post.id}
              className="bg-[#050505] border border-[#FFFFFF]/30 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FFFFFF] transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="w-20 h-16 object-cover rounded border border-[#FFFFFF]/30 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-display text-lg font-bold text-[#FFFFFF]">{post.title}</span>
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded font-semibold border ${
                        isPub
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                          : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                      }`}
                    >
                      {isPub ? 'LIVE' : 'BOZZA'}
                    </span>
                  </div>
                  <span className="text-xs text-[#FFFFFF] block mt-0.5">
                    {post.category} — {post.author} ({new Date(post.publishedAt).toLocaleDateString('it-IT')})
                  </span>
                  <p className="text-xs text-[#FFFFFF]/70 line-clamp-1 mt-1 max-w-xl">{post.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#FFFFFF]/20">
                <button
                  onClick={() => onOpenPreview(post)}
                  className="p-2 bg-[#1A0505]/30 border border-[#FFFFFF]/30 rounded text-[#FFFFFF] hover:bg-[#1A0505] transition flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" /> Anteprima
                </button>

                <button
                  onClick={() => handleTogglePublish(post)}
                  className={`p-2 border rounded transition flex items-center gap-1 text-xs ${
                    isPub
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> {isPub ? 'Imposta Bozza' : 'Pubblica'}
                </button>

                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 bg-[#050505] border border-[#FFFFFF]/40 rounded text-[#FFFFFF] hover:bg-[#1A0505]/40 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  className="p-2 bg-red-950/40 border border-red-500/40 rounded text-red-300 hover:bg-red-900/60 transition"
                  title="Elimina Articolo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
