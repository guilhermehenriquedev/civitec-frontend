'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { 
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function RHPage() {
  const { user } = useAuth();

  // Verificar se o usuário tem acesso ao módulo RH
  const canAccessRH = user && (
    user.role === 'MASTER_ADMIN' || 
    user.role === 'SECTOR_ADMIN' || 
    user.role === 'SECTOR_OPERATOR' || 
    user.role === 'EMPLOYEE'
  );

  if (!canAccessRH) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Você não tem permissão para acessar o módulo de Recursos Humanos.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recursos Humanos</h1>
            <p className="text-gray-600 mt-2">Gestão completa de funcionários, férias e contracheques</p>
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Funcionários */}
          <Link href="/rh/funcionarios">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Funcionários</h3>
                  <p className="text-gray-600">Gerencie cadastros, cargos e lotações</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Acessar
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solicitação de Férias */}
          <Link href="/rh/ferias">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-green-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Solicitação de Férias</h3>
                  <p className="text-gray-600">Gerencie pedidos e aprovações de férias</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                Acessar
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Contracheque */}
          <Link href="/rh/contracheque">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-purple-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Contracheque</h3>
                  <p className="text-gray-600">Visualize e gerencie contracheques</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                Acessar
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informações do Sistema
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Este módulo permite o gerenciamento completo dos recursos humanos da organização.</p>
                <p className="mt-1">Acesse as funcionalidades através dos cards acima para começar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
