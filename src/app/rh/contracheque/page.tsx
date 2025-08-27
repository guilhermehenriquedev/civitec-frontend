'use client';

import React, { useState, useEffect } from 'react';
import { usePayslips } from '@/hooks/rh/usePayslips';
import { Payslip } from '@/hooks/rh/usePayslips';
import DataTable from '@/components/tables/DataTable';
import Card from '@/components/ui/Card';
import PayslipViewModal from '@/components/rh/PayslipViewModal';
import Toast from '@/components/ui/Toast';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    fetchPayslips();
    fetchPayslipStats();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const handleView = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsModalOpen(true);
  };

  const handleDownload = async (payslip: Payslip) => {
    if (downloadingId) return; // Evitar múltiplos downloads simultâneos
    
    setDownloadingId(payslip.id);
    try {
      await downloadPayslip(payslip.id, payslip);
      showToast('Contracheque baixado com sucesso!', 'success');
      
      // Recarregar dados para refletir qualquer mudança
      await fetchPayslips();
      await fetchPayslipStats();
    } catch (error: any) {
      console.error('Erro no download:', error);
      showToast(
        error.message || 'Erro ao baixar contracheque. Tente novamente.',
        'error'
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayslip(null);
  };

  // Array seguro para o DataTable
  const safePayslips = payslips || [];

  // Colunas da tabela
  const columns = [
    {
      key: 'employee',
      label: 'Funcionário',
      render: (value: any, row: any) => {
        if (!row || !row.employee) return '-';
        return (
          <div>
            <div className="font-medium text-gray-900">{row.employee.nome_completo}</div>
            <div className="text-sm text-gray-500">Matrícula: {row.employee.matricula}</div>
          </div>
        );
      }
    },
    {
      key: 'competencia',
      label: 'Competência',
      render: (value: any, row: any) => row?.competencia || '-'
    },
    {
      key: 'bruto',
      label: 'Salário Bruto',
      render: (value: any, row: any) => {
        if (!row?.bruto) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(row.bruto);
      }
    },
    {
      key: 'descontos',
      label: 'Descontos',
      render: (value: any, row: any) => {
        if (!row?.descontos) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(row.descontos);
      }
    },
    {
      key: 'liquido',
      label: 'Salário Líquido',
      render: (value: any, row: any) => {
        if (!row?.liquido) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(row.liquido);
      }
    },
    {
      key: 'created_at',
      label: 'Data de Geração',
      render: (value: any, row: any) => {
        if (!row?.created_at) return '-';
        return new Date(row.created_at).toLocaleDateString('pt-BR');
      }
    },
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
                handleDownload(row);
              }}
              disabled={downloadingId === row.id}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {downloadingId === row.id ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Baixando...</span>
                </div>
              ) : (
                'Download'
              )}
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contracheques</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie contracheques dos funcionários</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total de Contracheques" subtitle="Todos os períodos">
          <div className="text-3xl font-bold text-indigo-600">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats?.total || 0
            )}
          </div>
        </Card>

        <Card title="Contracheques Pagos" subtitle="Status atual">
          <div className="text-3xl font-bold text-green-600">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats?.pagos || 0
            )}
          </div>
        </Card>

        <Card title="Total Bruto" subtitle="Soma dos salários">
          <div className="text-3xl font-bold text-blue-600">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats?.total_bruto ? 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.total_bruto) : 'R$ 0,00'
            )}
          </div>
        </Card>

        <Card title="Total Líquido" subtitle="Após descontos">
          <div className="text-3xl font-bold text-emerald-600">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              stats?.total_liquido ? 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.total_liquido) : 'R$ 0,00'
            )}
          </div>
        </Card>
      </div>

      {/* Tabela de Contracheques */}
      <Card title="Lista de Contracheques" subtitle={`Mostrando ${safePayslips.length} de ${totalCount} resultados`}>
        <DataTable
          data={safePayslips}
          columns={columns}
          searchable
          pagination={true}
        />
      </Card>

      {/* Modal de Visualização */}
      {isModalOpen && selectedPayslip && (
        <PayslipViewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          payslip={selectedPayslip}
          onDownload={async (id: number) => {
            const payslip = safePayslips.find(p => p.id === id);
            if (payslip) {
              await handleDownload(payslip);
            }
          }}
        />
      )}

      {/* Toast para notificações */}
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
