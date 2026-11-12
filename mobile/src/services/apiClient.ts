import { API_BASE_URL } from '../config/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  resetCode?: string;
}

export class ApiClient {
  private static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for AI response

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
   * 1. Parent Register (Email & Password)
   */
  public static async parentRegister(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * 2. Parent Login (Email & Password)
   */
  public static async parentLogin(email: string, password?: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * 3. Forgot Password Request (Generates 6-digit Reset Code)
   */
  public static async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * 4. Reset Password with Code
   */
  public static async resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, resetCode, newPassword }),
    });
  }

  /**
   * 5. Record Parental Consent (DPDP Act)
   */
  public static async recordConsent(parentId: string, childId?: string): Promise<ApiResponse> {
    return this.request('/auth/consent', {
      method: 'POST',
      body: JSON.stringify({ parentId, childId, consentVersion: 'v1.0' }),
    });
  }

  /**
   * 6. Create Child Profile
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
   * 7. Start Companion Session
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
   * 8. Send Conversation Message (with Real AI and Child Safety Check)
   */
  public static async sendMessage(
    sessionId: string,
    childId: string,
    characterId: string,
    text: string,
    language: string,
    childNickname?: string
  ): Promise<ApiResponse> {
    return this.request('/conversations/message', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        childId,
        characterId,
        text,
        language,
        childNickname,
      }),
    });
  }

  /**
   * 9. End Session and Record Duration
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
   * 10. Delete Child Data (DPDP Act right to erasure)
   */
  public static async deleteChildData(childId: string): Promise<ApiResponse> {
    return this.request(`/children/${childId}`, {
      method: 'DELETE',
    });
  }
}
