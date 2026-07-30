import {
  Show,
  Performance,
  BlogPost,
  SiteConfig,
  CompanyCastMember,
  BookingRequest,
  BookingRequestStatus,
  Role,
  AvailabilityResponse,
  BookingEvent,
  BookingSettings,
} from '../types';

function getAuthHeaders(role?: Role) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const TheatreRepository = {

  async login(email, password) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login fallito');
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data.user;
  },

  getAdminToken() {
    return localStorage.getItem('admin_token') || '';
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    await fetch('/api/admin/logout', { method: 'POST', headers: getAuthHeaders() });
  },

  async getMe() {
    const res = await fetch('/api/admin/me', {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Non autenticato');
    return data.user;
  },

  // Site Configuration
  async getSiteConfig(): Promise<SiteConfig> {
    try {
      const res = await fetch('/api/site-config');
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getSiteConfig');
    }
    return {
      name: 'Il Sipario – Compagnia Teatrale A.P.S.',
      city: 'Canicattini Bagni (SR)',
      address: 'Via Antonino Uccello 6, Canicattini Bagni (SR)',
      phone: '+39 339 492 3772',
      email: 'ilsipariocompagniateatrale@gmail.com',
      facebookUrl: 'https://www.facebook.com/ilsipariocanicattinibagni/',
      instagramUrl: 'https://www.instagram.com/compagnia_ilsipario/',
      youtubeUrl: 'https://www.youtube.com/channel/UC9CEjFQvC9LgSfypbaP5LfA',
      toneOfVoice: [],
    };
  },

  async updateSiteConfig(newConfig: Partial<SiteConfig>, role: Role = 'admin'): Promise<SiteConfig> {
    const res = await fetch('/api/site-config', {
      method: 'PUT',
      headers: getAuthHeaders(role),
      body: JSON.stringify(newConfig),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante l aggiornamento configurazione');
    return json.data;
  },

  // Cast & Compagnia
  async getCompanyCast(): Promise<CompanyCastMember[]> {
    try {
      const res = await fetch('/api/cast');
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getCompanyCast');
    }
    return [];
  },

  async saveCastMember(member: Partial<CompanyCastMember>, role: Role = 'admin'): Promise<CompanyCastMember> {
    const res = await fetch('/api/cast', {
      method: 'POST',
      headers: getAuthHeaders(role),
      body: JSON.stringify(member),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore salvataggio componente cast');
    return json.data;
  },

  async deleteCastMember(id: string, role: Role = 'admin'): Promise<void> {
    const res = await fetch(`/api/cast/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore eliminazione componente cast');
  },

  // Shows
  async getAllShows(includeDrafts = false): Promise<Show[]> {
    try {
      const res = await fetch('/api/spettacoli');
      const json = await res.json();
      if (json.success) {
        if (!includeDrafts) {
          return json.data.filter((s: Show) => (s as any).publication_status === 'published' || s.status !== undefined);
        }
        return json.data;
      }
    } catch (e) {
      console.warn('API fallback for getAllShows');
    }
    return [];
  },

  async getShowBySlug(slug: string): Promise<Show | null> {
    try {
      const res = await fetch(`/api/spettacoli/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getShowBySlug');
    }
    return null;
  },

  async saveShow(showData: Partial<Show>, role: Role = 'editor'): Promise<Show> {
    const isEdit = !!showData.id;
    const url = isEdit ? `/api/spettacoli/${showData.id}` : '/api/spettacoli';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(role),
      body: JSON.stringify(showData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel salvataggio dello spettacolo');
    return json.data;
  },

  async publishShow(id: string, publish: boolean, role: Role = 'editor'): Promise<Show> {
    const res = await fetch(`/api/spettacoli/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders(role),
      body: JSON.stringify({ publish }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel cambio stato pubblicazione');
    return json.data;
  },

  async deleteShow(id: string, role: Role = 'admin'): Promise<boolean> {
    const res = await fetch(`/api/spettacoli/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nell eliminazione dello spettacolo');
    return true;
  },

  // Performances
  async getAllPerformances(): Promise<Performance[]> {
    try {
      const res = await fetch('/api/performances');
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getAllPerformances');
    }
    return [];
  },

  async getPerformancesByShowId(showId: string): Promise<Performance[]> {
    const all = await this.getAllPerformances();
    return all.filter((p) => p.showId === showId);
  },

  async savePerformance(perfData: Partial<Performance>, role: Role = 'box_office'): Promise<Performance> {
    const isEdit = !!perfData.id;
    const url = isEdit ? `/api/performances/${perfData.id}` : '/api/performances';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(role),
      body: JSON.stringify(perfData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel salvataggio della replica');
    return json.data;
  },

  async deletePerformance(id: string, role: Role = 'admin'): Promise<boolean> {
    const res = await fetch(`/api/performances/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore eliminazione replica');
    return true;
  },

  // Blog
  async getAllBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/blog');
      const json = await res.json();
      if (json.success) {
        if (!includeDrafts) {
          return json.data.filter((p: BlogPost) => p.status === 'published');
        }
        return json.data;
      }
    } catch (e) {
      console.warn('API fallback for getAllBlogPosts');
    }
    return [];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getAllBlogPosts(true);
    return posts.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async saveBlogPost(postData: Partial<BlogPost>, role: Role = 'editor'): Promise<BlogPost> {
    const isEdit = !!postData.id;
    const url = isEdit ? `/api/blog/${postData.id}` : '/api/blog';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(role),
      body: JSON.stringify(postData),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel salvataggio articolo blog');
    return json.data;
  },

  async publishBlogPost(id: string, publish: boolean, role: Role = 'editor'): Promise<BlogPost> {
    const res = await fetch(`/api/blog/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders(role),
      body: JSON.stringify({ publish }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel cambio stato pubblicazione articolo');
    return json.data;
  },

  async deleteBlogPost(id: string, role: Role = 'admin'): Promise<boolean> {
    const res = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore eliminazione articolo');
    return true;
  },

  // Media Assets (R2)
  async getAllMediaAssets(): Promise<any[]> {
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getAllMediaAssets');
    }
    return [];
  },

  async uploadMediaAsset(data: { filename: string; altText?: string; dataBase64?: string }, role: Role = 'editor'): Promise<any> {
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      headers: getAuthHeaders(role),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante upload R2 media');
    return json.data;
  },

  async deleteMediaAsset(id: string, role: Role = 'admin'): Promise<boolean> {
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore eliminazione media');
    return true;
  },

  // Audit Logs
  async getAuditLogs(role: Role = 'admin'): Promise<any[]> {
    try {
      const res = await fetch('/api/audit-logs', {
        headers: getAuthHeaders(role),
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API fallback for getAuditLogs');
    }
    return [];
  },

  // --- SPRINT 3 BOOKING API METHODS ---

  async getPerformanceAvailability(performanceId: string): Promise<AvailabilityResponse> {
    const res = await fetch(`/api/public/performances/${encodeURIComponent(performanceId)}/availability`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante la verifica disponibilità');
    return json.data;
  },

  async createPublicBooking(data: {
    performanceId: string;
    fullName: string;
    email: string;
    phone: string;
    seatsCount: number;
    notes?: string;
    honeypot?: string;
    turnstileToken?: string;
    privacyConsented: boolean;
    marketingConsented?: boolean;
    privacyPolicyVersion?: string;
  }): Promise<{ success: boolean; data: BookingRequest; emailPreview?: any }> {
    const res = await fetch('/api/prenota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante l invio della prenotazione');
    return { success: true, data: json.data, emailPreview: json.emailPreview };
  },

  async getAdminBookings(
    filters?: { performanceId?: string; status?: string; search?: string },
    role: Role = 'box_office'
  ): Promise<{ data: BookingRequest[]; metrics: any }> {
    const query = new URLSearchParams();
    if (filters?.performanceId) query.set('performanceId', filters.performanceId);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.search) query.set('search', filters.search);

    const res = await fetch(`/api/admin/prenotazioni?${query.toString()}`, {
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel caricamento delle prenotazioni');
    return { data: json.data, metrics: json.metrics };
  },

  async getBookingDetail(id: string, role: Role = 'box_office'): Promise<{ data: BookingRequest; events: BookingEvent[] }> {
    const res = await fetch(`/api/admin/prenotazioni/${encodeURIComponent(id)}`, {
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Prenotazione non trovata');
    return { data: json.data, events: json.events };
  },

  async updateBookingStatus(
    id: string,
    status: BookingRequestStatus,
    reason?: string,
    role: Role = 'box_office'
  ): Promise<BookingRequest> {
    const res = await fetch(`/api/admin/prenotazioni/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(role),
      body: JSON.stringify({ status, reason }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nell aggiornamento dello stato');
    return json.data;
  },

  async resendBookingEmail(id: string, role: Role = 'box_office'): Promise<{ message: string; emailPreview: any }> {
    const res = await fetch(`/api/admin/prenotazioni/${encodeURIComponent(id)}/resend-email`, {
      method: 'POST',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel reinvio dell email');
    return { message: json.message, emailPreview: json.emailPreview };
  },

  async exportBookingsCsv(
    filters?: { performanceId?: string; status?: string },
    role: Role = 'box_office'
  ): Promise<{ filename: string; csvContent: string; count: number }> {
    const res = await fetch('/api/admin/prenotazioni/export', {
      method: 'POST',
      headers: getAuthHeaders(role),
      body: JSON.stringify(filters || {}),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nell esportazione CSV');
    return { filename: json.filename, csvContent: json.csvContent, count: json.count };
  },

  async checkInBooking(idOrCode: string, role: Role = 'box_office'): Promise<{ message: string; data: BookingRequest }> {
    const res = await fetch(`/api/admin/prenotazioni/${encodeURIComponent(idOrCode)}/check-in`, {
      method: 'POST',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante il check-in');
    return { message: json.message, data: json.data };
  },

  async deleteBooking(id: string, role: Role = 'admin'): Promise<{ message: string }> {
    const res = await fetch(`/api/admin/prenotazioni/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore durante l eliminazione della prenotazione');
    return { message: json.message };
  },

  async getBookingSettings(role: Role = 'box_office'): Promise<BookingSettings> {
    const res = await fetch('/api/admin/booking-settings', {
      headers: getAuthHeaders(role),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore nel caricamento delle impostazioni');
    return json.data;
  },

  async updateBookingSettings(settings: Partial<BookingSettings>, role: Role = 'admin'): Promise<BookingSettings> {
    const res = await fetch('/api/admin/booking-settings', {
      method: 'PUT',
      headers: getAuthHeaders(role),
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Errore salvataggio impostazioni');
    return json.data;
  },
};