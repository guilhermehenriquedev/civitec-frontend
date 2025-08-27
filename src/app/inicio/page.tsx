'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function InicioPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleVisitProdos = () => {
    window.open('https://www.prodosdigital.com.br', '_blank');
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-6">
        {/* Header da página */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CiviTec
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Bem-vindo(a),</p>
              <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo ao CiviTec!
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A plataforma de gestão municipal que transforma a administração pública através da inovação e tecnologia.
            </p>
          </div>

          {/* Benefícios para o município */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Como o CiviTec beneficia seu município
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Segurança e Transparência</h4>
                <p className="text-gray-600">
                  Controle total sobre processos municipais com auditoria completa e rastreabilidade de todas as ações.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Eficiência Operacional</h4>
                <p className="text-gray-600">
                  Redução significativa no tempo de processos, eliminação de papel e automação de tarefas repetitivas.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestão Inteligente</h4>
                <p className="text-gray-600">
                  Relatórios em tempo real, dashboards interativos e insights para tomada de decisões estratégicas.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <UserGroupIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Colaboração em Equipe</h4>
                <p className="text-gray-600">
                  Trabalho integrado entre departamentos com controle de permissões e fluxos de aprovação.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <BuildingOfficeIcon className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Obras</h4>
                <p className="text-gray-600">
                  Acompanhamento completo de projetos de infraestrutura com mapas interativos e controle de cronogramas.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Processos Digitais</h4>
                <p className="text-gray-600">
                  Licitações, contratos e processos administrativos 100% digitais e em conformidade com a legislação.
                </p>
              </div>
            </div>
          </div>

          {/* Sobre a Pródos Digital */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Desenvolvido pela Pródos Digital
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Somos uma empresa especializada em soluções digitais para o setor público, 
                comprometida em transformar a gestão municipal através da tecnologia e inovação.
              </p>
              <button
                onClick={handleVisitProdos}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <GlobeAltIcon className="w-5 h-5 mr-2" />
                Visitar www.prodosdigital.com.br
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
