'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';
import { DataTable } from '@/components/tables';
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Contracheque {
  id: number;
  funcionario: string;
  matricula: string;
  cargo: string;
  competencia: string;
  salarioBruto: number;
  descontos: number;
  salarioLiquido: number;
  dataPagamento: string;
  status: 'PAGO' | 'PENDENTE' | 'CANCELADO';
  pdfUrl?: string;
}

export default function ContrachequePage() {
  const { user } = useAuth();
  const [contracheques, setContracheques] = useState<Contracheque[]>([]);
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
      loadContracheques();
    }
  }, [canAccessRH]);

  const loadContracheques = async () => {
    try {
      setLoading(true);
      // Dados mock para demonstração
      const mockData: Contracheque[] = [
        {
          id: 1,
          funcionario: 'João Silva Santos',
          matricula: '001',
          cargo: 'Analista de RH',
          competencia: '2024-01',
          salarioBruto: 4500.00,
          descontos: 675.00,
          salarioLiquido: 3825.00,
          dataPagamento: '2024-01-31',
          status: 'PAGO',
          pdfUrl: '#'
        },
        {
          id: 2,
          funcionario: 'Maria Oliveira Costa',
          matricula: '002',
          cargo: 'Auxiliar Administrativo',
          competencia: '2024-01',
          salarioBruto: 3200.00,
          descontos: 480.00,
          salarioLiquido: 2720.00,
          dataPagamento: '2024-01-31',
          status: 'PAGO',
          pdfUrl: '#'
        },
        {
          id: 3,
          funcionario: 'Pedro Almeida Lima',
          matricula: '003',
          cargo: 'Técnico de Contabilidade',
          competencia: '2024-01',
          salarioBruto: 3800.00,
          descontos: 570.00,
          salarioLiquido: 3230.00,
          dataPagamento: '2024-01-31',
          status: 'PAGO',
          pdfUrl: '#'
        },
        {
          id: 4,
          funcionario: 'Ana Paula Rodrigues',
          matricula: '004',
          cargo: 'Assistente Social',
          competencia: '2024-01',
          salarioBruto: 4100.00,
          descontos: 615.00,
          salarioLiquido: 3485.00,
          dataPagamento: '2024-01-31',
          status: 'PAGO',
          pdfUrl: '#'
        },
        {
          id: 5,
          funcionario: 'Carlos Eduardo Ferreira',
          matricula: '005',
          cargo: 'Engenheiro Civil',
          competencia: '2024-01',
          salarioBruto: 5200.00,
          descontos: 780.00,
          salarioLiquido: 4420.00,
          dataPagamento: '2024-01-31',
          status: 'PAGO',
          pdfUrl: '#'
        }
      ];

      setContracheques(mockData);
    } catch (error) {
      console.error('Erro ao carregar contracheques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'PENDENTE':
        return 'Pendente';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleDownload = (contracheque: Contracheque) => {
    // Simular download do contracheque
    alert(`Download do contracheque de ${contracheque.funcionario} - ${contracheque.competencia} iniciado!`);
  };

  const handleView = (contracheque: Contracheque) => {
    // Simular visualização do contracheque
    alert(`Visualizando contracheque de ${contracheque.funcionario}:\n` +
          `Competência: ${contracheque.competencia}\n` +
          `Salário Bruto: R$ ${contracheque.salarioBruto.toLocaleString()}\n` +
          `Descontos: R$ ${contracheque.descontos.toLocaleString()}\n` +
          `Salário Líquido: R$ ${contracheque.salarioLiquido.toLocaleString()}\n` +
          `Data de Pagamento: ${new Date(contracheque.dataPagamento).toLocaleDateString('pt-BR')}`);
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
  const totalContracheques = contracheques.length;
  const contrachequesPagos = contracheques.filter(c => c.status === 'PAGO').length;
  const valorTotalBruto = contracheques.reduce((total, c) => total + c.salarioBruto, 0);
  const valorTotalLiquido = contracheques.reduce((total, c) => total + c.salarioLiquido, 0);
  const valorTotalDescontos = contracheques.reduce((total, c) => total + c.descontos, 0);

  // Filtrar contracheques


  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contracheque</h1>
              <p className="text-gray-600 mt-2">Visualize e gerencie contracheques dos funcionários</p>
            </div>
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total de Contracheques */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalContracheques}</p>
                <p className="text-sm text-gray-500">Contracheques</p>
              </div>
            </div>
          </div>

          {/* Contracheques Pagos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagos</p>
                <p className="text-2xl font-bold text-gray-900">{contrachequesPagos}</p>
                <p className="text-sm text-gray-500">Processados</p>
              </div>
            </div>
          </div>

          {/* Valor Total Bruto */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bruto</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {valorTotalBruto.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Salários brutos</p>
              </div>
            </div>
          </div>

          {/* Valor Total Líquido */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Líquido</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {valorTotalLiquido.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Após descontos</p>
              </div>
            </div>
          </div>
        </div>



        {/* Tabela de Contracheques */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DataTable
            data={contracheques.map(contracheque => ({
              id: contracheque.id,
              funcionario: (
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {contracheque.funcionario}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contracheque.cargo} - {contracheque.matricula}
                  </div>
                </div>
              ),
              competencia: (
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {contracheque.competencia}
                </div>
              ),
              salarioBruto: `R$ ${contracheque.salarioBruto.toLocaleString()}`,
              descontos: `R$ ${contracheque.descontos.toLocaleString()}`,
              salarioLiquido: `R$ ${contracheque.salarioLiquido.toLocaleString()}`,
              status: (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contracheque.status)}`}>
                  {getStatusLabel(contracheque.status)}
                </span>
              ),
              acoes: (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(contracheque)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-2 py-1 rounded text-xs flex items-center"
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    Ver
                  </button>
                  <button
                    onClick={() => handleDownload(contracheque)}
                    className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs flex items-center"
                  >
                    <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                    Download
                  </button>
                </div>
              )
            }))}
            columns={[
              { key: 'funcionario', label: 'Funcionário' },
              { key: 'competencia', label: 'Competência' },
              { key: 'salarioBruto', label: 'Salário Bruto' },
              { key: 'descontos', label: 'Descontos' },
              { key: 'salarioLiquido', label: 'Salário Líquido' },
              { key: 'status', label: 'Status' },
              { key: 'acoes', label: 'Ações' }
            ]}
            title="Lista de Contracheques"
            emptyMessage="Nenhum contracheque encontrado"
            searchable={true}
            searchPlaceholder="Buscar contracheques..."
            filters={[
              {
                key: 'status',
                options: [
                  { value: 'PAGO', label: 'Pago' },
                  { value: 'PENDENTE', label: 'Pendente' },
                  { value: 'CANCELADO', label: 'Cancelado' }
                ],
                placeholder: 'Status'
              }
            ]}
            pagination={true}
            itemsPerPage={10}
            showItemsPerPageSelector={true}
          />
        )}

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Total de Descontos</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {valorTotalDescontos.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {((valorTotalDescontos / valorTotalBruto) * 100).toFixed(1)}% do total bruto
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Média Salarial</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {(valorTotalBruto / totalContracheques).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Salário médio bruto</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Eficiência</p>
              <p className="text-2xl font-bold text-gray-900">
                {((valorTotalLiquido / valorTotalBruto) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Valor líquido vs bruto</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
