'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/layout/Layout';
import { DataTable } from '@/components/tables';
import { 
  UsersIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Funcionario {
  id: number;
  nome: string;
  matricula: string;
  cargo: string;
  lotacao: string;
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'LICENCA';
  salario: number;
  setor: string;
  faltas: number;
  atestados: number;
  ultimasFerias: string;
  solicitacoes: number;
  documentos: number;
}

export default function FuncionariosPage() {
  const { user } = useAuth();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

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
      loadFuncionarios();
    }
  }, [canAccessRH]);



  const loadFuncionarios = async () => {
    try {
      setLoading(true);
      // Dados mock para demonstração
      const mockData: Funcionario[] = [
        {
          id: 1,
          nome: 'João Silva Santos',
          matricula: '001',
          cargo: 'Analista de RH',
          lotacao: 'Secretaria de Administração',
          status: 'ATIVO',
          salario: 4500.00,
          setor: 'RH',
          faltas: 2,
          atestados: 1,
          ultimasFerias: '2024-01-15',
          solicitacoes: 3,
          documentos: 8
        },
        {
          id: 2,
          nome: 'Maria Oliveira Costa',
          matricula: '002',
          cargo: 'Auxiliar Administrativo',
          lotacao: 'Secretaria de Educação',
          status: 'ATIVO',
          salario: 3200.00,
          setor: 'EDUCACAO',
          faltas: 0,
          atestados: 0,
          ultimasFerias: '2024-02-20',
          solicitacoes: 1,
          documentos: 6
        },
        {
          id: 3,
          nome: 'Pedro Almeida Lima',
          matricula: '003',
          cargo: 'Técnico de Contabilidade',
          lotacao: 'Secretaria de Finanças',
          status: 'FERIAS',
          salario: 3800.00,
          setor: 'FINANCAS',
          faltas: 1,
          atestados: 2,
          ultimasFerias: '2024-03-01',
          solicitacoes: 2,
          documentos: 7
        },
        {
          id: 4,
          nome: 'Ana Paula Rodrigues',
          matricula: '004',
          cargo: 'Assistente Social',
          lotacao: 'Secretaria de Assistência Social',
          status: 'ATIVO',
          salario: 4100.00,
          setor: 'ASSISTENCIA_SOCIAL',
          faltas: 3,
          atestados: 1,
          ultimasFerias: '2023-12-10',
          solicitacoes: 4,
          documentos: 9
        },
        {
          id: 5,
          nome: 'Carlos Eduardo Ferreira',
          matricula: '005',
          cargo: 'Engenheiro Civil',
          lotacao: 'Secretaria de Obras',
          status: 'LICENCA',
          salario: 5200.00,
          setor: 'OBRAS',
          faltas: 5,
          atestados: 3,
          ultimasFerias: '2023-11-05',
          solicitacoes: 1,
          documentos: 5
        }
      ];

      setFuncionarios(mockData);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'FERIAS':
        return 'bg-blue-100 text-blue-800';
      case 'LICENCA':
        return 'bg-yellow-100 text-yellow-800';
      case 'INATIVO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'FERIAS':
        return 'Em Férias';
      case 'LICENCA':
        return 'Licença';
      case 'INATIVO':
        return 'Inativo';
      default:
        return status;
    }
  };

  const getSetorLabel = (setor: string) => {
    switch (setor) {
      case 'RH':
        return 'Recursos Humanos';
      case 'EDUCACAO':
        return 'Educação';
      case 'FINANCAS':
        return 'Finanças';
      case 'ASSISTENCIA_SOCIAL':
        return 'Assistência Social';
      case 'OBRAS':
        return 'Obras';
      default:
        return setor;
    }
  };

  const handleViewDetails = (funcionario: Funcionario) => {
    // Aqui você pode implementar um modal ou navegação para ver detalhes
    alert(`Detalhes de ${funcionario.nome}:\n` +
          `Salário: R$ ${funcionario.salario.toLocaleString()}\n` +
          `Setor: ${getSetorLabel(funcionario.setor)}\n` +
          `Faltas: ${funcionario.faltas}\n` +
          `Atestados: ${funcionario.atestados}\n` +
          `Últimas Férias: ${new Date(funcionario.ultimasFerias).toLocaleDateString('pt-BR')}\n` +
          `Solicitações: ${funcionario.solicitacoes}\n` +
          `Documentos: ${funcionario.documentos}`);
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
  const totalFuncionarios = funcionarios.length;
  const funcionariosAtivos = funcionarios.filter(f => f.status === 'ATIVO').length;
  const valorFolhaPagamento = funcionarios.reduce((total, f) => total + f.salario, 0);

  const tableData = funcionarios.map(funcionario => ({
    id: funcionario.id,
    funcionario: funcionario.nome,
    matricula: funcionario.matricula,
    cargo: funcionario.cargo,
    lotacao: funcionario.lotacao,
    status: (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(funcionario.status)}`}>
        {getStatusLabel(funcionario.status)}
      </span>
    ),
    acoes: (
      <button
        onClick={() => handleViewDetails(funcionario)}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <EyeIcon className="w-4 h-4 mr-1" />
        Ver Vida
      </button>
    )
  }));

  const tableColumns = [
    { key: 'funcionario', label: 'Funcionário' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'lotacao', label: 'Lotação' },
    { key: 'status', label: 'Status' },
    { key: 'acoes', label: 'Ações' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
              <p className="text-gray-600 mt-2">Gestão completa dos funcionários da organização</p>
            </div>
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total de Funcionários */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">{totalFuncionarios}</p>
                <p className="text-sm text-gray-500">{funcionariosAtivos} ativos</p>
              </div>
            </div>
          </div>

          {/* Valor da Folha de Pagamento */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Folha de Pagamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {valorFolhaPagamento.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Valor total mensal</p>
              </div>
            </div>
          </div>

          {/* Funcionários por Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {funcionarios.filter(f => f.status === 'FERIAS').length}
                </p>
                <p className="text-sm text-gray-500">Em férias</p>
              </div>
            </div>
          </div>
        </div>



        {/* Tabela de Funcionários */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DataTable
            data={tableData}
            columns={tableColumns}
            title="Lista de Funcionários"
            emptyMessage="Nenhum funcionário encontrado"
            searchable={true}
            searchPlaceholder="Buscar funcionários..."
            filters={[
              {
                key: 'status',
                options: [
                  { value: 'ATIVO', label: 'Ativo' },
                  { value: 'FERIAS', label: 'Em Férias' },
                  { value: 'LICENCA', label: 'Licença' },
                  { value: 'INATIVO', label: 'Inativo' }
                ],
                placeholder: 'Status'
              },
              {
                key: 'setor',
                options: [
                  { value: 'RH', label: 'Recursos Humanos' },
                  { value: 'EDUCACAO', label: 'Educação' },
                  { value: 'FINANCAS', label: 'Finanças' },
                  { value: 'ASSISTENCIA_SOCIAL', label: 'Assistência Social' },
                  { value: 'OBRAS', label: 'Obras' }
                ],
                placeholder: 'Setor'
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
