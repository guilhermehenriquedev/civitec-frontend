'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { DataTable } from '@/components/tables';
import { PayslipViewModal } from '@/components/rh';
import { usePayslips } from '@/hooks/rh';
import { Toast } from '@/components/ui';


export default function ContrachequePage() {
  const {
    payslips,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchPayslips,
    fetchPayslipStats,
    downloadPayslip
  } = usePayslips();

  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Garantir que payslips seja sempre um array
  const safePayslips = Array.isArray(payslips) ? payslips : [];

  useEffect(() => {
    console.log('ContrachequePage: useEffect executado');
    fetchPayslips();
    fetchPayslipStats();
  }, []);

  useEffect(() => {
    console.log('ContrachequePage: payslips atualizado:', payslips);
    console.log('ContrachequePage: payslips é array?', Array.isArray(payslips));
    console.log('ContrachequePage: payslips length:', payslips?.length);
  }, [payslips]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const handleView = (payslip: any) => {
    console.log('Abrindo modal de visualização para:', payslip);
    setSelectedPayslip(payslip);
    setIsModalOpen(true);
  };

  const handleDownload = async (payslipId: number) => {
    console.log('Iniciando download para payslip ID:', payslipId);
    
    try {
      // Usar a função de download do hook
      const blob = await downloadPayslip(payslipId);
      
      if (blob) {
        // Criar URL do blob
        const url = window.URL.createObjectURL(blob);
        
        // Criar link de download
        const link = document.createElement('a');
        link.href = url;
        
        // Nome do arquivo baseado no ID (você pode ajustar conforme necessário)
        link.download = `contracheque-${payslipId}.pdf`;
        
        // Adicionar ao DOM, clicar e remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpar URL do blob
        window.URL.revokeObjectURL(url);
        
        showToast('Contracheque baixado com sucesso!', 'success');
        
        // Refetch dados para atualizar a tabela e totalizadores
        await fetchPayslips();
        await fetchPayslipStats();
      } else {
        showToast('Erro ao baixar contracheque. Arquivo não encontrado.', 'error');
      }
    } catch (error) {
      console.error('Erro ao baixar contracheque:', error);
      showToast('Erro ao baixar contracheque. Tente novamente.', 'error');
    }
  };

  const handleCloseModal = () => {
    console.log('Fechando modal de visualização');
    setIsModalOpen(false);
    setSelectedPayslip(null);
  };

  const columns = [
    { 
      key: 'employee', 
      label: 'Funcionário', 
      render: (employee: any) => {
        if (!employee) return '-';
        if (typeof employee === 'string') return employee;
        if (typeof employee === 'object') {
          return `${employee.nome_completo || employee.full_name || 'Nome não informado'} — ${employee.matricula || employee.registration || 'Matrícula não informada'}`;
        }
        return '-';
      }
    },
    { key: 'competencia', label: 'Competência' },
    { key: 'bruto', label: 'Bruto', render: (value: any) => {
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      return `R$ ${numValue.toFixed(2)}`;
    }},
    { key: 'descontos', label: 'Descontos', render: (value: any) => {
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      return `R$ ${numValue.toFixed(2)}`;
    }},
    { key: 'liquido', label: 'Líquido', render: (value: any) => {
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      return `R$ ${numValue.toFixed(2)}`;
    }},
    { key: 'created_at', label: 'Data de Geração', render: (value: string) => {
      if (!value) return '-';
      try {
        return new Date(value).toLocaleDateString('pt-BR');
      } catch {
        return '-';
      }
    }},
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: any) => {
        console.log('Renderizando ações para row:', row);
        if (!row) return '-';
        
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                console.log('Botão Ver clicado para:', row);
                handleView(row);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Ver
            </button>
            <button
              onClick={() => {
                console.log('Botão Download clicado para:', row);
                handleDownload(row.id);
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Download
            </button>
          </div>
        );
      }
    }
  ];

  const filterOptions = [
    { key: 'competencia', options: [
      { value: '2024-01', label: 'Janeiro/2024' },
      { value: '2024-02', label: 'Fevereiro/2024' },
      { value: '2024-03', label: 'Março/2024' },
      { value: '2024-04', label: 'Abril/2024' },
      { value: '2024-05', label: 'Maio/2024' },
      { value: '2024-06', label: 'Junho/2024' }
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
                    fetchPayslips();
                    fetchPayslipStats();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contracheques</h1>
        <p className="text-gray-600">Gerencie os contracheques dos funcionários</p>
      </div>

      {/* Cards de Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Contracheques</p>
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
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagos</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.pagos || 0}</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bruto</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.total_bruto?.toLocaleString('pt-BR') || '0,00'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Líquido</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.total_liquido?.toLocaleString('pt-BR') || '0,00'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <div className="p-6">
          <DataTable
            data={safePayslips}
            columns={columns}
            title="Lista de Contracheques"
            emptyMessage="Nenhum contracheque encontrado"
            searchable={true}
            searchPlaceholder="Buscar contracheques..."
            filters={filterOptions}
            pagination={true}
            itemsPerPage={pageSize}
            showItemsPerPageSelector={true}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      {/* Modal de Visualização */}
      {isModalOpen && selectedPayslip && (
        <PayslipViewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          payslip={selectedPayslip}
          onDownload={handleDownload}
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
