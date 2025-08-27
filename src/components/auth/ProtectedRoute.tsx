'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { canAccessModule } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  module, 
  fallback 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated && user && !canAccessModule(user, module)) {
      console.log(`🚫 Acesso negado ao módulo ${module} para usuário ${user.email}`);
      router.push('/inicio');
      return;
    }
  }, [user, isAuthenticated, isLoading, module, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Se não tiver acesso ao módulo, mostrar fallback ou redirecionar
  if (user && !canAccessModule(user, module)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar este módulo. 
            Entre em contato com o administrador do sistema.
          </p>
          <button
            onClick={() => router.push('/inicio')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Se tiver acesso, renderizar o conteúdo
  return <>{children}</>;
}
