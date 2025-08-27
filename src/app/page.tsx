'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há token de autenticação
    const token = localStorage.getItem('accessToken');
    
    if (token) {
          // Se há token, redirecionar para o início
    router.push('/inicio');
    } else {
      // Se não há token, redirecionar para o login
      router.push('/login');
    }
  }, [router]);

  // Página de carregamento enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
