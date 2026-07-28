import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, Quote } from 'lucide-react';
import { TheatreRepository } from '../lib/repository';
import { Show, Performance, BlogPost, UserPreferences, SiteConfig } from '../types';
import { ShowCard } from '../components/ui/ShowCard';
import { SceneFallback } from '../components/three/SceneFallback';

const TheatreScene = lazy(() => import('../components/three/TheatreScene'));

interface HomePageProps {
  userPreferences: UserPreferences;
}

export const HomePage: React.FC<HomePageProps> = ({ userPreferences }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [config, allShows, allPerfs, posts] = await Promise.all([
          TheatreRepository.getSiteConfig(),
          TheatreRepository.getAllShows(),
          TheatreRepository.getAllPerformances(),
          TheatreRepository.getAllBlogPosts(),
        ]);
        setSiteConfig(config);
        setShows(allShows);
        setPerformances(allPerfs);
        setBlogPosts(posts);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const nextPerformance = performances.find((p) => p.bookingStatus === 'open');
  const featuredShow = nextPerformance ? shows.find((s) => s.id === nextPerformance.showId) : shows[0];

  return (
    <div className="min-h-screen bg-nero-palco text-avorio space-y-24">
      
      {/* Immersive Theatre Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* 3D Canvas Layer */}
        <Suspense fallback={null}>
          <TheatreScene userPreferences={userPreferences} />
        </Suspense>

        {/* Foreground Semantic HTML Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center sm:items-start text-center sm:text-left">
          
          <h1 className="font-serif-display text-5xl sm:text-8xl md:text-9xl font-bold text-avorio tracking-tighter leading-[0.9] drop-shadow-2xl">
            NUOVA<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">SCENA.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg sm:text-xl text-gray-300 font-light leading-relaxed mix-blend-difference">
            La Compagnia Teatrale A.P.S. “Il Sipario”. Diamo voce al teatro popolare siciliano con passione e un linguaggio radicalmente contemporaneo.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              to="/spettacoli"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 glass-panel hover:bg-white/10 text-avorio text-sm font-medium uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>Scopri la stagione</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/prenota"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-rosso-sipario hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(230,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-white"
            >
              <Ticket className="w-4 h-4" />
              <span>Prenota Subito</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto della Compagnia Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="border-l-4 border-rosso-sipario pl-8 py-2">
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-avorio mb-6">
            Radici antiche, <br/><span className="text-gray-500">visione futura.</span>
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed font-light">
            Siamo nati a Canicattini Bagni per valorizzare l'identità culturale del territorio. Crediamo nel teatro come luogo di incontro radicale, esplorando l'espressività dialettale con rigore e una messa in scena moderna. Non è solo conservazione, è evoluzione.
          </p>
        </div>
      </section>

      {/* Spettacoli in Evidenza */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-avorio tracking-tight">
              In Cartellone
            </h2>
          </div>
          <Link
            to="/spettacoli"
            className="text-sm font-medium text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            Tutti gli spettacoli <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shows.slice(0, 3).map((show) => {
            const perf = performances.find((p) => p.showId === show.id);
            return <ShowCard key={show.id} show={show} nextPerformance={perf} />;
          })}
        </div>
      </section>

      {/* Ultime Notizie dal Blog */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12 pb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold text-avorio tracking-tight">
            Dietro le Quinte
          </h2>
          <Link
            to="/blog"
            className="text-sm font-medium text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            Leggi il diario <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.slice(0, 2).map((post) => (
            <article
              key={post.id}
              className="group relative glass-panel p-8 flex flex-col justify-between overflow-hidden transition-all hover:border-gray-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rosso-sipario/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  <span className="text-rosso-sipario">{post.category}</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('it-IT')}</span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-avorio group-hover:text-white transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-gray-500">Scritto da {post.author}</span>
                <Link to={`/blog/${post.slug}`} className="text-white font-medium hover:text-rosso-sipario transition-colors">
                  Continua a leggere →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
};
