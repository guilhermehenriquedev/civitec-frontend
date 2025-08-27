'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User, LoginCredentials } from './api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticação inicial
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated) {
          const userData = await apiClient.getMe();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar tokens inválidos
        await apiClient.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      console.log('🔐 Tentando fazer login...', credentials.email);
      
      const response = await apiClient.login(credentials);
      console.log('✅ Login bem-sucedido:', response);
      
      setUser(response.user);
      console.log('👤 Usuário definido no contexto:', response.user);
      
      console.log('🔄 Redirecionando para /inicio...');
      router.push('/inicio');
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      if (apiClient.isAuthenticated) {
        const userData = await apiClient.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Funções de verificação de permissões atualizadas
export const hasRole = (user: User | null, role: User['role']) => {
  return user?.role === role;
};

export const hasSectorAccess = (user: User | null, sector: string) => {
  if (!user) return false;
  if (user.role === 'MASTER_ADMIN') return true;
  return user.sector === sector;
};

// Controle de acesso baseado no perfil do usuário
export const canAccessModule = (user: User | null, module: string) => {
  if (!user) return false;
  
  // MASTER_ADMIN: acesso total a todos os módulos
  if (user.role === 'MASTER_ADMIN') return true;
  
  // EMPLOYEE: acesso apenas ao módulo RH para funcionalidades de funcionário
  if (user.role === 'EMPLOYEE') {
    return module === 'rh';
  }
  
  // SECTOR_ADMIN e SECTOR_OPERATOR: acesso apenas ao módulo do seu setor
  const moduleSectorMap: Record<string, string> = {
    'rh': 'RH',
    'tributos': 'TRIBUTOS',
    'licitacao': 'LICITACAO',
    'obras': 'OBRAS',
  };
  
  const requiredSector = moduleSectorMap[module];
  return user.sector === requiredSector;
};

// Verificar se pode realizar ações administrativas
export const canPerformAdminActions = (user: User | null) => {
  if (!user) return false;
  return user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN';
};

// Verificar se pode gerenciar usuários
export const canManageUsers = (user: User | null) => {
  if (!user) return false;
  return user.role === 'MASTER_ADMIN';
};

// Verificar se pode ver relatórios
export const canViewReports = (user: User | null) => {
  if (!user) return false;
  return user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN';
};

// Verificar se pode acessar configurações
export const canAccessSettings = (user: User | null) => {
  if (!user) return false;
  return user.role === 'MASTER_ADMIN';
};

// Verificar funcionalidades específicas do funcionário
export const canAccessEmployeeFeatures = (user: User | null) => {
  if (!user) return false;
  return user.role === 'EMPLOYEE';
};

// Verificar se pode realizar operações operacionais
export const canPerformOperations = (user: User | null) => {
  if (!user) return false;
  return user.role === 'SECTOR_OPERATOR' || user.role === 'SECTOR_ADMIN' || user.role === 'MASTER_ADMIN';
};
