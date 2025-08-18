'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { 
  UserPlusIcon, 
  UsersIcon,
  EnvelopeIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function UsuariosPage() {
  const { user } = useAuth();

  if (!user?.is_master_admin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Apenas administradores gerais podem acessar esta página.
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600 mt-2">Central de controle para usuários e convites do sistema</p>
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gerenciador de Convites */}
          <Link href="/usuarios/convites">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Gerenciador de Convites</h3>
                  <p className="text-gray-600">Crie, visualize e gerencie convites para novos usuários</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                Acessar
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Gerenciador de Usuários */}
          <Link href="/usuarios/usuarios">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Gerenciador de Usuários</h3>
                  <p className="text-gray-600">Visualize e edite permissões dos usuários ativos</p>
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
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CogIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Funcionalidades Disponíveis</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Convites:</strong> Envie convites para novos usuários com papéis e setores específicos</li>
                  <li><strong>Usuários:</strong> Gerencie permissões, papéis e status dos usuários existentes</li>
                  <li><strong>Auditoria:</strong> Todas as ações são registradas para controle e segurança</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
