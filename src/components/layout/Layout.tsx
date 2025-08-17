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
    // Aguardar a verificação de autenticação
    if (!isLoading) {
      setIsLayoutLoading(false);
    }
  }, [isLoading]);

  // Se ainda está verificando autenticação
  if (isLoading || isLayoutLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
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
