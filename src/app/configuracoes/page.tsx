'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector(''); // Será definido baseado no usuário real
    }
  }, []);

  const handleSaveGeneral = () => {
    // Simular salvamento das configurações gerais
    alert('Configurações gerais salvas com sucesso! Em uma implementação real, aqui seriam enviadas para o servidor.');
  };

  const handleSaveUsers = () => {
    // Simular salvamento das configurações de usuários
    alert('Configurações de usuários salvas com sucesso! Em uma implementação real, aqui seriam enviadas para o servidor.');
  };

  const handleSaveSystem = () => {
    // Simular salvamento das configurações do sistema
    alert('Configurações do sistema salvas com sucesso! Em uma implementação real, aqui seriam enviadas para o servidor.');
  };

  // Verificar permissões baseado no perfil
  const canAccessSettings = userRole === 'MASTER_ADMIN';
  const canManageUsers = userRole === 'MASTER_ADMIN';
  const canManageSystem = userRole === 'MASTER_ADMIN';

  if (!canAccessSettings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Apenas administradores gerais podem acessar as configurações do sistema.
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
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Configurações gerais, usuários e sistema</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Perfil:</span> {
              userRole === 'MASTER_ADMIN' ? 'Administrador Geral' :
              userRole === 'SECTOR_ADMIN' ? 'Gerente de Setor' :
              userRole === 'SECTOR_OPERATOR' ? 'Operacional' :
              'Funcionário'
            }
            {userSector && ` - Setor: ${userSector}`}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Geral
              </button>
              {canManageUsers && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Usuários
                </button>
              )}
              {canManageSystem && (
                <button
                  onClick={() => setActiveTab('system')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'system'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Sistema
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Configurações Gerais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Instituição
                    </label>
                    <input
                      type="text"
                      defaultValue="Prefeitura Municipal de São Paulo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      defaultValue="12.345.678/0001-90"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      defaultValue="Rua das Flores, 123 - Centro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="text"
                      defaultValue="(11) 3456-7890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      defaultValue="contato@prefeitura.sp.gov.br"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuso Horário
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="America/Sao_Paulo">America/Sao_Paulo (UTC-3)</option>
                      <option value="America/Manaus">America/Manaus (UTC-4)</option>
                      <option value="America/Belem">America/Belem (UTC-3)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveGeneral}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'users' && canManageUsers && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Configurações de Usuários</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Política de Senhas
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="strong">Forte (8+ caracteres, números, símbolos)</option>
                      <option value="medium">Média (6+ caracteres, números)</option>
                      <option value="weak">Fraca (4+ caracteres)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo de Expiração de Senha (dias)
                    </label>
                    <input
                      type="number"
                      defaultValue="90"
                      min="30"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentativas de Login
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      min="3"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bloqueio de Conta (minutos)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      min="15"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sessão Inativa (minutos)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      min="15"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MFA Obrigatório
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="all">Todos os usuários</option>
                      <option value="admin">Apenas administradores</option>
                      <option value="none">Opcional</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveUsers}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'system' && canManageSystem && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Configurações do Sistema</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modo de Manutenção
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="false">Desabilitado</option>
                      <option value="true">Habilitado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logs de Auditoria
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="all">Todos os eventos</option>
                      <option value="important">Apenas importantes</option>
                      <option value="critical">Apenas críticos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retenção de Logs (dias)
                    </label>
                    <input
                      type="number"
                      defaultValue="90"
                      min="30"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backup Automático
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retenção de Backups
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      min="7"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notificações por Email
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="all">Todas</option>
                      <option value="important">Apenas importantes</option>
                      <option value="none">Desabilitadas</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    Testar Configurações
                  </button>
                  <button
                    onClick={handleSaveSystem}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
