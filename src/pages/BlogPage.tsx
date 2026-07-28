import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TheatreRepository } from '../lib/repository';
import { BlogPost } from '../types';
import { Calendar, User, ArrowLeft, Tag, AlertTriangle } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        if (slug) {
          const found = await TheatreRepository.getBlogPostBySlug(slug);
          setCurrentPost(found);
        } else {
          const all = await TheatreRepository.getAllBlogPosts();
          setPosts(all);
        }
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-xs text-[#FFFFFF]">Caricamento articoli...</div>;
  }

  // Single Article View
  if (slug) {
    if (!currentPost) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">Articolo non trovato</h1>
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Torna al blog
          </Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Torna a tutti gli articoli
        </Link>

        <article className="space-y-6">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#1A0505] text-[#FFFFFF] text-xs font-semibold rounded uppercase border border-[#FFFFFF]/40">
              {currentPost.category}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#FFFFFF] leading-tight">
              {currentPost.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-[#FFFFFF] pt-2 border-b border-[#FFFFFF]/20 pb-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {currentPost.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(currentPost.publishedAt).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {currentPost.coverUrl && (
            <div className="rounded-xl overflow-hidden border border-[#FFFFFF]/30 max-h-[400px]">
              <img src={currentPost.coverUrl} alt={currentPost.title} className="w-full h-full object-cover" />
            </div>
          )}

          {currentPost.validationStatus === 'DA_VALIDARE_CON_LA_COMPAGNIA' && (
            <div className="p-3 bg-amber-950/90 border border-amber-500/40 rounded text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Contenuto editoriale in corso di validazione formale con l'associazione.</span>
            </div>
          )}

          <div className="text-sm sm:text-base text-[#FFFFFF]/90 leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {currentPost.content}
          </div>
        </article>
      </div>
    );
  }

  // Blog Archive View
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Notizie & Eventi
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Blog & Comunicati
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Aggiornamenti, interviste, dietro le quinte e comunicati ufficiali della compagnia Il Sipario A.P.S.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[#050505] border border-[#FFFFFF]/30 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#FFFFFF] transition shadow-lg"
          >
            {post.coverUrl && (
              <div className="aspect-video bg-[#1A0505]/20 overflow-hidden">
                <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#FFFFFF]">
                  <span className="font-semibold uppercase">{post.category}</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('it-IT')}</span>
                </div>
                <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
                  {post.title}
                </h2>
                <p className="text-xs text-[#FFFFFF]/80 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#FFFFFF]/15 flex items-center justify-between text-xs">
                <span className="text-[#FFFFFF]/60">{post.author}</span>
                <Link to={`/blog/${post.slug}`} className="text-[#FFFFFF] font-semibold hover:underline">
                  Leggi tutto →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
