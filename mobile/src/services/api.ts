import { KeywordItem, ClusterGroup, UserSession } from '../types';
import { generateLocalKeywords, clusterKeywordsLocally } from './mockData';

// Mobile device connection:
// On Android Emulator: use http://10.0.2.2:3000
// On Physical Phone / Expo Go: use your PC's LAN IP e.g. http://192.168.1.x:3000
// Default for localhost / testing: http://localhost:3000
export const DEFAULT_API_URL = 'http://localhost:3000';

class ApiService {
  private baseUrl: string = DEFAULT_API_URL;
  private token: string | null = null;

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async login(email: string, password: string): Promise<UserSession> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data: any = await response.json();
      this.token = data.token || 'demo-jwt-token';
      
      return {
        email: data.user?.email || email,
        role: data.user?.role || 'user',
        token: this.token || '',
        name: data.user?.name || 'SEO Pilot Mobile User',
      };
    } catch {
      // Local fallback for offline/demo use
      if (email.toLowerCase().includes('user') || email.toLowerCase().includes('client')) {
        this.token = 'mock-user-session-token';
        return {
          email,
          role: 'user',
          token: this.token,
          name: 'Sarah (Etsy Creator)',
        };
      }
      throw new Error('Authentication failed. Check your email or backend URL.');
    }
  }

  async fetchKeywordSuggestions(params: {
    query: string;
    source?: 'google_autocomplete' | 'etsy_autocomplete';
    lang?: string;
    targetCount?: number;
  }): Promise<KeywordItem[]> {
    const { query, source = 'google_autocomplete', lang = 'en', targetCount = 100 } = params;

    try {
      const response = await fetch(`${this.baseUrl}/api/keywords/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: JSON.stringify({
          query,
          source,
          lang,
          targetCount,
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data.keywords && Array.isArray(data.keywords)) {
          return data.keywords;
        }
      }
    } catch {
      console.warn('Backend unavailable, using fast on-device keyword engine.');
    }

    // Fallback to local engine
    return generateLocalKeywords(query, lang, targetCount);
  }

  async generateClusters(keywords: string[], targetGroups: number = 25): Promise<ClusterGroup[]> {
    // Clusters can run on-device instantly
    return clusterKeywordsLocally(keywords, targetGroups);
  }
}

export const api = new ApiService();
