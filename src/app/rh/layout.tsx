'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';

interface RHLayoutProps {
  children: React.ReactNode;
}

export default function RHLayout({ children }: RHLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Se ainda está verificando autenticação, mostrar loading
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  // Se não está autenticado, mostrar mensagem de carregamento
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando autenticação...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-full bg-gray-50">
        {children}
      </div>
    </Layout>
  );
}
