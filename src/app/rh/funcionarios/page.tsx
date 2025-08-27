'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { DataTable } from '@/components/tables';
import { EmployeeLifeModal } from '@/components/rh';
import { useEmployees } from '@/hooks/rh';
import { Toast } from '@/components/ui';

export default function FuncionariosPage() {
  const {
    employees,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchEmployees,
    fetchEmployeeStats
  } = useEmployees();

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Garantir que employees seja sempre um array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  useEffect(() => {
    console.log('FuncionariosPage: useEffect executado');
    fetchEmployees();
    fetchEmployeeStats();
  }, []);

  useEffect(() => {
    console.log('FuncionariosPage: employees atualizado:', employees);
    console.log('FuncionariosPage: employees é array?', Array.isArray(employees));
    console.log('FuncionariosPage: employees length:', employees?.length);
  }, [employees]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const handleViewDetails = (employee: any) => {
    console.log('Abrindo modal para funcionário:', employee);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Fechando modal');
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handlePageChange = (page: number) => {
    fetchEmployees({}, page, pageSize);
  };

  const handleItemsPerPageChange = (newPageSize: number) => {
    fetchEmployees({}, 1, newPageSize);
  };

  const handleFiltersChange = (filters: any) => {
    fetchEmployees(filters, 1, pageSize);
  };

  const columns = [
    { key: 'nome_completo', label: 'Nome' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'lotacao', label: 'Lotação' },
    { key: 'regime', label: 'Regime' },
    { key: 'status', label: 'Status' },
    { key: 'admissao_dt', label: 'Data de Admissão' },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: any) => {
        console.log('Renderizando ações para row:', row);
        return (
          <button
            onClick={() => {
              console.log('Botão Ver Vida clicado para:', row);
              handleViewDetails(row);
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ver Vida
          </button>
        );
      }
    }
  ];

  const filterOptions = [
    { key: 'status', label: 'Status', options: [
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'INATIVO', label: 'Inativo' },
      { value: 'APOSENTADO', label: 'Aposentado' },
      { value: 'DEMITIDO', label: 'Demitido' }
    ]},
    { key: 'regime', label: 'Regime', options: [
      { value: 'CLT', label: 'CLT' },
      { value: 'ESTATUTARIO', label: 'Estatutário' },
      { value: 'TEMPORARIO', label: 'Temporário' },
      { value: 'TERCEIRIZADO', label: 'Terceirizado' }
    ]},
    { key: 'lotacao', label: 'Lotação', options: [
      { value: 'RH', label: 'RH' },
      { value: 'TI', label: 'TI' },
      { value: 'ADMINISTRATIVO', label: 'Administrativo' },
      { value: 'OPERACIONAL', label: 'Operacional' }
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
                    fetchEmployees();
                    fetchEmployeeStats();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Funcionários</h1>
        <p className="text-gray-600">Gerencie os funcionários da empresa</p>
      </div>

      {/* Cards de Totalizadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Funcionários</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_funcionarios || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Funcionários Ativos</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.ativos || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Folha de Pagamento</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.folha_pagamento?.toLocaleString('pt-BR') || '0,00'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Férias</p>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.em_ferias || 0}</p>
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
            data={safeEmployees}
            columns={columns}
            title="Lista de Funcionários"
            emptyMessage="Nenhum funcionário encontrado"
            searchable={true}
            searchPlaceholder="Buscar funcionários..."
            filters={filterOptions}
            pagination={true}
            itemsPerPage={pageSize}
            showItemsPerPageSelector={true}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedEmployee && (
        <EmployeeLifeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          employee={selectedEmployee}
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
