'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { DataTable } from '@/components/tables';
import { VacationApproveDialog, VacationRejectDialog } from '@/components/rh';
import { useVacations } from '@/hooks/rh';
import { Toast } from '@/components/ui';

export default function FeriasPage() {
  const { vacations, loading, error, stats, fetchVacations, fetchVacationStats, approveVacation, rejectVacation } = useVacations();
  const [selectedVacation, setSelectedVacation] = useState<any>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [pageSize, setPageSize] = useState(20);

  // Garantir que vacations seja sempre um array
  const safeVacations = Array.isArray(vacations) ? vacations : [];

  useEffect(() => {
    console.log('FeriasPage: useEffect executado');
    fetchVacations();
    fetchVacationStats();
  }, []);

  useEffect(() => {
    console.log('FeriasPage: vacations atualizado:', vacations);
    console.log('FeriasPage: vacations é array?', Array.isArray(vacations));
    console.log('FeriasPage: vacations length:', vacations?.length);
  }, [vacations]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const handleApprove = (vacation: any) => {
    console.log('Abrindo modal de aprovação para:', vacation);
    setSelectedVacation(vacation);
    setIsApproveModalOpen(true);
  };

  const handleReject = (vacation: any) => {
    console.log('Abrindo modal de rejeição para:', vacation);
    setSelectedVacation(vacation);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedVacation) return;
    
    console.log('Confirmando aprovação para:', selectedVacation.id);
    
    try {
      await approveVacation(selectedVacation.id);
      showToast('Solicitação aprovada com sucesso!', 'success');
      closeModals();
      
      // Refetch dados para atualizar a tabela e totalizadores
      await fetchVacations();
      await fetchVacationStats();
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      showToast('Erro ao aprovar solicitação', 'error');
    }
  };

  const handleConfirmReject = async (rejectionReason: string) => {
    if (!selectedVacation) return;
    
    console.log('Confirmando rejeição para:', selectedVacation.id, 'Motivo:', rejectionReason);
    
    try {
      await rejectVacation(selectedVacation.id, rejectionReason);
      showToast('Solicitação rejeitada com sucesso!', 'success');
      closeModals();
      
      // Refetch dados para atualizar a tabela e totalizadores
      await fetchVacations();
      await fetchVacationStats();
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      showToast('Erro ao rejeitar solicitação', 'error');
    }
  };

  const closeModals = () => {
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedVacation(null);
  };

  const columns = [
    { 
      key: 'employee', 
      label: 'Funcionário', 
      render: (employee: any) => employee?.nome_completo || '-'
    },
    { key: 'period_start', label: 'Início', render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-' },
    { key: 'period_end', label: 'Fim', render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-' },
    { key: 'days_requested', label: 'Dias' },
    { key: 'status', label: 'Status', render: (value: string) => {
      if (!value) return '-';
      const statusConfig = {
        'PENDING': { label: 'PENDENTE', class: 'bg-yellow-100 text-yellow-800' },
        'APPROVED': { label: 'APROVADA', class: 'bg-green-100 text-green-800' },
        'REJECTED': { label: 'REJEITADA', class: 'bg-red-100 text-red-800' },
        'CANCELLED': { label: 'CANCELADA', class: 'bg-gray-100 text-gray-800' }
      };
      const config = statusConfig[value as keyof typeof statusConfig] || { label: value, class: 'bg-gray-100 text-gray-800' };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.class}`}>
          {config.label}
        </span>
      );
    }},
    { key: 'reason', label: 'Justificativa', render: (value: string) => value || '-' },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: any) => {
        console.log('Renderizando ações para row:', row);
        if (!row || !row.status) return '-';
        
        return (
          <div className="space-y-2">
            {row.status === 'PENDING' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log('Botão Aprovar clicado para:', row);
                    handleApprove(row);
                  }}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => {
                    console.log('Botão Rejeitar clicado para:', row);
                    handleReject(row);
                  }}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Rejeitar
                </button>
              </div>
            )}
            {row.status === 'APPROVED' && row.approver && (
              <div className="text-sm text-gray-600">
                <div>Aprovado por: {row.approver.first_name} {row.approver.last_name}</div>
                {row.approved_at && (
                  <div className="text-xs text-gray-500">
                    {new Date(row.approved_at).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            )}
            {row.status === 'REJECTED' && (
              <div className="text-sm text-gray-600">
                <div>Rejeitado por: {row.approver?.first_name} {row.approver?.last_name || 'Sistema'}</div>
                {row.rejection_reason && (
                  <div className="text-xs text-gray-500">
                    Motivo: {row.rejection_reason}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const filterOptions = [
    { key: 'status', options: [
      { value: 'PENDING', label: 'Pendente' },
      { value: 'APPROVED', label: 'Aprovada' },
      { value: 'REJECTED', label: 'Rejeitada' },
      { value: 'CANCELLED', label: 'Cancelada' }
    ]}
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    fetchVacations();
                    fetchVacationStats();
                  }}
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitações de Férias</h1>
        <p className="text-gray-600">Gerencie as solicitações de férias dos funcionários</p>
      </div>

      {/* Cards de Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Solicitações</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendentes || 0}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.aprovadas || 0}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.rejeitadas || 0}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando solicitações de férias...</p>
            </div>
          ) : (
            <DataTable
              data={safeVacations}
              columns={columns}
              title="Lista de Solicitações de Férias"
              emptyMessage="Nenhuma solicitação de férias encontrada"
              searchable={true}
              searchPlaceholder="Buscar solicitações..."
              filters={filterOptions}
              pagination={true}
              itemsPerPage={pageSize}
              showItemsPerPageSelector={true}
              itemsPerPageOptions={[10, 20, 50, 100]}
            />
          )}
        </div>
      </Card>

      {/* Modais */}
      {isApproveModalOpen && selectedVacation && (
        <VacationApproveDialog
          isOpen={isApproveModalOpen}
          onClose={closeModals}
          onConfirm={handleConfirmApprove}
          vacation={selectedVacation}
          loading={loading}
        />
      )}

      {isRejectModalOpen && selectedVacation && (
        <VacationRejectDialog
          isOpen={isRejectModalOpen}
          onClose={closeModals}
          onConfirm={handleConfirmReject}
          vacation={selectedVacation}
          loading={loading}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
