import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Tipos para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    sector: string | null;
    is_active: boolean;
    roles: string[];
    sectors: string[];
    permissions: string[];
    is_master_admin: boolean;
    is_sector_admin: boolean;
    is_sector_operator: boolean;
    is_employee: boolean;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  sector: string | null;
  is_active: boolean;
  roles: string[];
  sectors: string[];
  permissions: string[];
  is_master_admin: boolean;
  is_sector_admin: boolean;
  is_sector_operator: boolean;
  is_employee: boolean;
}

export interface InviteData {
  email: string;
  full_name: string;
  role_code: string;
  sector_code?: string;
}

export interface InviteResponse {
  id: number;
  email: string;
  full_name: string;
  role_code: string;
  sector_code: string | null;
  status: string;
  created_at: string;
  expires_at: string;
}

// Classe principal da API
class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use(
      (config) => {
        console.log('🔐 Interceptor de request:', config.url);
        console.log('🔐 Token atual:', this.accessToken);
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          console.log('🔐 Token adicionado ao header:', config.headers.Authorization);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para refresh automático de token
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true;
          
          try {
            if (this.refreshToken) {
              const response = await this.refreshAccessToken();
              this.accessToken = response.access;
              
              // Retry da requisição original
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Se o refresh falhar, limpar tokens e redirecionar para login
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Carregar tokens do localStorage se disponível
    if (typeof window !== 'undefined') {
      this.loadTokensFromStorage();
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.client.post('/api/auth/login/', credentials);
    const data = response.data;
    
    this.accessToken = data.access;
    this.refreshToken = data.refresh;
    
    // Salvar tokens no localStorage
    this.saveTokensToStorage();
    
    return data;
  }

  async refreshAccessToken(): Promise<{ access: string }> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.client.post('/api/auth/refresh/', {
      refresh: this.refreshToken,
    });
    
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokens();
    // Aqui você pode adicionar uma chamada para invalidar o token no backend se necessário
  }

  async getMe(): Promise<User> {
    const response = await this.client.get('/api/users/me/');
    return response.data;
  }

  // Métodos para convites
  async createInvite(inviteData: InviteData): Promise<{ message: string; invite: InviteResponse }> {
    const response = await this.client.post('/api/invites/', inviteData);
    return response.data;
  }

  async getInvites(): Promise<InviteResponse[]> {
    const response = await this.client.get('/api/invites/');
    return response.data;
  }

  async getPendingInvites(): Promise<InviteResponse[]> {
    const response = await this.client.get('/api/invites/pending/');
    return response.data;
  }

  async cancelInvite(inviteId: number): Promise<{ message: string }> {
    const response = await this.client.patch(`/api/invites/${inviteId}/cancel/`);
    return response.data;
  }

  async updateInvite(inviteId: number, inviteData: Partial<InviteData>): Promise<{ message: string; invite: InviteResponse }> {
    const response = await this.client.patch(`/api/invites/${inviteId}/`, inviteData);
    return response.data;
  }

  // Métodos para usuários
  async getUsers(): Promise<any[]> {
    const response = await this.client.get('/api/users/');
    return response.data;
  }

  async updateUser(userId: number, userData: any): Promise<{ message: string; user: any }> {
    const response = await this.client.patch(`/api/users/${userId}/`, userData);
    return response.data;
  }

  // Métodos públicos para convites
  async validateInvite(token: string, securityCode: string): Promise<{
    valid: boolean;
    full_name: string;
    email_masked: string;
    role_display: string;
    sector_display: string;
  }> {
    const response = await this.client.post('/api/public/invites/validate/', {
      token,
      security_code: securityCode,
    });
    return response.data;
  }

  async acceptInvite(token: string, securityCode: string, password: string, passwordConfirm: string): Promise<{
    message: string;
    user_id: number;
    email: string;
  }> {
    const response = await this.client.post('/api/public/invites/accept/', {
      token,
      security_code: securityCode,
      password,
      password_confirm: passwordConfirm,
    });
    return response.data;
  }

  // Métodos privados para gerenciamento de tokens
  private saveTokensToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('civitec_access_token', this.accessToken || '');
      localStorage.setItem('civitec_refresh_token', this.refreshToken || '');
      console.log('🔐 Tokens salvos no localStorage:');
      console.log('🔐 Access Token:', this.accessToken ? 'Salvo' : 'Não salvo');
      console.log('🔐 Refresh Token:', this.refreshToken ? 'Salvo' : 'Não salvo');
    }
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('civitec_access_token');
      this.refreshToken = localStorage.getItem('civitec_refresh_token');
      console.log('🔐 Tokens carregados do localStorage:');
      console.log('🔐 Access Token:', this.accessToken ? 'Presente' : 'Ausente');
      console.log('🔐 Refresh Token:', this.refreshToken ? 'Presente' : 'Ausente');
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('civitec_access_token');
      localStorage.removeItem('civitec_refresh_token');
    }
  }

  // Getters para verificar estado da autenticação
  get isAuthenticated(): boolean {
    const hasToken = !!this.accessToken;
    console.log('🔐 ApiClient.isAuthenticated:', hasToken, 'Token:', this.accessToken ? 'Presente' : 'Ausente');
    return hasToken;
  }

  get getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Instância singleton da API
export const apiClient = new ApiClient();
