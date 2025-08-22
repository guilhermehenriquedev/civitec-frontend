'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';
import { DataTable } from '@/components/tables';
import { 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface SolicitacaoFerias {
  id: number;
  funcionario: string;
  matricula: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  dias: number;
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA';
  dataSolicitacao: string;
  aprovador?: string;
  observacoes?: string;
}

export default function FeriasPage() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoFerias[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário tem acesso ao módulo RH
  const canAccessRH = user && (
    user.role === 'MASTER_ADMIN' || 
    user.role === 'SECTOR_ADMIN' || 
    user.role === 'SECTOR_OPERATOR' || 
    user.role === 'EMPLOYEE'
  );

  useEffect(() => {
    if (canAccessRH) {
      loadSolicitacoes();
    }
  }, [canAccessRH]);

  const loadSolicitacoes = async () => {
    try {
      setLoading(true);
      // Dados mock para demonstração
      const mockData: SolicitacaoFerias[] = [
        {
          id: 1,
          funcionario: 'João Silva Santos',
          matricula: '001',
          cargo: 'Analista de RH',
          dataInicio: '2024-12-01',
          dataFim: '2024-12-15',
          dias: 15,
          status: 'PENDENTE',
          dataSolicitacao: '2024-11-15'
        },
        {
          id: 2,
          funcionario: 'Maria Oliveira Costa',
          matricula: '002',
          cargo: 'Auxiliar Administrativo',
          dataInicio: '2024-11-20',
          dataFim: '2024-12-05',
          dias: 16,
          status: 'APROVADA',
          dataSolicitacao: '2024-11-10',
          aprovador: 'João Silva Santos'
        },
        {
          id: 3,
          funcionario: 'Pedro Almeida Lima',
          matricula: '003',
          cargo: 'Técnico de Contabilidade',
          dataInicio: '2024-10-15',
          dataFim: '2024-10-30',
          dias: 16,
          status: 'REJEITADA',
          dataSolicitacao: '2024-10-01',
          aprovador: 'João Silva Santos',
          observacoes: 'Período não disponível'
        }
      ];

      setSolicitacoes(mockData);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'bg-green-100 text-green-800';
      case 'REJEITADA':
        return 'bg-red-100 text-red-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'Aprovada';
      case 'REJEITADA':
        return 'Rejeitada';
      case 'PENDENTE':
        return 'Pendente';
      default:
        return status;
    }
  };

  const handleApprove = (id: number) => {
    setSolicitacoes(prev => 
      prev.map(sol => 
        sol.id === id 
          ? { ...sol, status: 'APROVADA', aprovador: user?.first_name + ' ' + user?.last_name }
          : sol
      )
    );
  };

  const handleReject = (id: number) => {
    const observacoes = prompt('Motivo da rejeição:');
    if (observacoes !== null) {
      setSolicitacoes(prev => 
        prev.map(sol => 
          sol.id === id 
            ? { 
                ...sol, 
                status: 'REJEITADA', 
                aprovador: user?.first_name + ' ' + user?.last_name,
                observacoes 
              }
            : sol
        )
      );
    }
  };

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
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Calcular estatísticas
  const totalSolicitacoes = solicitacoes.length;
  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'PENDENTE').length;
  const solicitacoesAprovadas = solicitacoes.filter(s => s.status === 'APROVADA').length;
  const solicitacoesRejeitadas = solicitacoes.filter(s => s.status === 'REJEITADA').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Solicitação de Férias</h1>
              <p className="text-gray-600 mt-2">Gerencie pedidos e aprovações de férias dos funcionários</p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total de Solicitações */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalSolicitacoes}</p>
                <p className="text-sm text-gray-500">Solicitações</p>
              </div>
            </div>
          </div>

          {/* Pendentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{solicitacoesPendentes}</p>
                <p className="text-sm text-gray-500">Aguardando</p>
              </div>
            </div>
          </div>

          {/* Aprovadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">{solicitacoesAprovadas}</p>
                <p className="text-sm text-gray-500">Confirmadas</p>
              </div>
            </div>
          </div>

          {/* Rejeitadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-gray-900">{solicitacoesRejeitadas}</p>
                <p className="text-sm text-gray-500">Não aprovadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Solicitações */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DataTable
            data={solicitacoes.map(solicitacao => ({
              id: solicitacao.id,
              funcionario: solicitacao.funcionario,
              cargo: solicitacao.cargo,
              matricula: solicitacao.matricula,
              periodo: (
                <div>
                  <div>Início: {new Date(solicitacao.dataInicio).toLocaleDateString('pt-BR')}</div>
                  <div>Fim: {new Date(solicitacao.dataFim).toLocaleDateString('pt-BR')}</div>
                </div>
              ),
              dias: `${solicitacao.dias} dias`,
              status: (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitacao.status)}`}>
                  {getStatusLabel(solicitacao.status)}
                </span>
              ),
              dataSolicitacao: new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR'),
              acoes: (
                <div>
                  {solicitacao.status === 'PENDENTE' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(solicitacao.id)}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(solicitacao.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                  {solicitacao.status === 'APROVADA' && (
                    <div className="text-sm text-gray-500">
                      Aprovado por: {solicitacao.aprovador}
                    </div>
                  )}
                  {solicitacao.status === 'REJEITADA' && (
                    <div className="text-sm text-gray-500">
                      <div>Rejeitado por: {solicitacao.aprovador}</div>
                      {solicitacao.observacoes && (
                        <div className="text-xs text-red-600 mt-1">
                          Motivo: {solicitacao.observacoes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }))}
            columns={[
              { key: 'funcionario', label: 'Funcionário' },
              { key: 'cargo', label: 'Cargo' },
              { key: 'matricula', label: 'Matrícula' },
              { key: 'periodo', label: 'Período' },
              { key: 'dias', label: 'Dias' },
              { key: 'status', label: 'Status' },
              { key: 'dataSolicitacao', label: 'Data Solicitação' },
              { key: 'acoes', label: 'Ações' }
            ]}
            title="Lista de Solicitações"
            emptyMessage="Nenhuma solicitação encontrada"
            searchable={true}
            searchPlaceholder="Buscar solicitações..."
            filters={[
              {
                key: 'status',
                options: [
                  { value: 'PENDENTE', label: 'Pendente' },
                  { value: 'APROVADA', label: 'Aprovada' },
                  { value: 'REJEITADA', label: 'Rejeitada' }
                ],
                placeholder: 'Status'
              }
            ]}
            pagination={true}
            itemsPerPage={10}
            showItemsPerPageSelector={true}
          />
        )}
      </div>
    </Layout>
  );
}
