import { API_BASE_URL } from '../config/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiClient {
  private static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for fast mobile response

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      clearTimeout(timeoutId);

      const json = await response.json();
      return json;
    } catch (error: any) {
      console.warn(`[API Offline Fallback] ${endpoint}:`, error.message || error);
      return {
        success: false,
        error: error.message || 'Network request failed (using local offline fallback)',
      };
    }
  }

  /**
   * 1. Parent Login / Registration
   */
  public static async parentLogin(email: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * 2. Record Parental Consent (DPDP Act)
   */
  public static async recordConsent(parentId: string, childId?: string): Promise<ApiResponse> {
    return this.request('/auth/consent', {
      method: 'POST',
      body: JSON.stringify({ parentId, childId, consentVersion: 'v1.0' }),
    });
  }

  /**
   * 3. Create Child Profile
   */
  public static async createChild(
    parentId: string,
    displayName: string,
    ageBand: '3-4' | '4-5',
    preferredLanguage: string
  ): Promise<ApiResponse> {
    return this.request('/children', {
      method: 'POST',
      body: JSON.stringify({ parentId, displayName, ageBand, preferredLanguage }),
    });
  }

  /**
   * 4. Start Companion Session
   */
  public static async startSession(
    childId: string,
    characterId: string,
    language: string
  ): Promise<ApiResponse> {
    return this.request('/conversations/start', {
      method: 'POST',
      body: JSON.stringify({ childId, characterId, language }),
    });
  }

  /**
   * 5. Send Conversation Message (with Child Safety Check)
   */
  public static async sendMessage(
    sessionId: string,
    childId: string,
    characterId: string,
    text: string,
    language: string
  ): Promise<ApiResponse> {
    return this.request('/conversations/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, childId, characterId, text, language }),
    });
  }

  /**
   * 6. End Session and Record Duration
   */
  public static async endSession(
    sessionId: string,
    durationSeconds: number
  ): Promise<ApiResponse> {
    return this.request('/conversations/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId, durationSeconds }),
    });
  }

  /**
   * 7. Delete Child Data (DPDP Act right to erasure)
   */
  public static async deleteChildData(childId: string): Promise<ApiResponse> {
    return this.request(`/children/${childId}`, {
      method: 'DELETE',
    });
  }
}
