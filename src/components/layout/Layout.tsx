'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);

  useEffect(() => {
    // Aguardar a verificação de autenticação inicial
    if (!isLoading) {
      setIsLayoutLoading(false);
    }
  }, [isLoading]);

  // Se ainda está verificando autenticação, mostrar loading
  if (isLoading || isLayoutLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Se não está autenticado, mostrar mensagem de carregamento
  // O redirecionamento será feito pelo hook de autenticação
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
