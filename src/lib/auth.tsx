'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { atom, useAtom } from 'jotai';

// Tipos
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'MASTER_ADMIN' | 'SECTOR_ADMIN' | 'SECTOR_OPERATOR' | 'EMPLOYEE';
  sector: string | null;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Atoms
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAtom = atom<boolean>(true);

// Context
const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
} | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Armazenar tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Atualizar estado
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    window.location.href = '/login';
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token inválido, limpar estado
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      getCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

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
