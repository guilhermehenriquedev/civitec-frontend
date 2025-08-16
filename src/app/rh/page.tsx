'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface Employee {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  matricula: string;
  cargo: string;
  lotacao: string;
  regime: string;
  admissao_dt: string;
  status: string;
}

interface VacationRequest {
  id: number;
  employee: Employee;
  period_start: string;
  period_end: string;
  status: string;
  approver?: string;
}

interface Payslip {
  id: number;
  employee: Employee;
  competencia: string;
  bruto: number;
  descontos: number;
  liquido: number;
  pdf_url?: string;
}

export default function RHPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('employees');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('RH');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      // Por enquanto, vamos simular baseado no que está no localStorage ou usar dados padrão
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector('RH');
    }

    // Dados mock para demonstração
    const mockEmployees: Employee[] = [
      {
        id: 1,
        user: {
          first_name: 'João',
          last_name: 'Silva',
          email: 'joao.silva@civitec.local',
          role: 'SECTOR_OPERATOR'
        },
        matricula: '001',
        cargo: 'Analista de RH',
        lotacao: 'Secretaria de Administração',
        regime: 'CLT',
        admissao_dt: '2023-01-15',
        status: 'ATIVO'
      },
      {
        id: 2,
        user: {
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria.santos@civitec.local',
          role: 'EMPLOYEE'
        },
        matricula: '002',
        cargo: 'Auxiliar Administrativo',
        lotacao: 'Secretaria de Educação',
        regime: 'ESTATUTÁRIO',
        admissao_dt: '2022-06-20',
        status: 'ATIVO'
      },
      {
        id: 3,
        user: {
          first_name: 'Pedro',
          last_name: 'Oliveira',
          email: 'pedro.oliveira@civitec.local',
          role: 'EMPLOYEE'
        },
        matricula: '003',
        cargo: 'Técnico de Contabilidade',
        lotacao: 'Secretaria de Finanças',
        regime: 'ESTATUTÁRIO',
        admissao_dt: '2021-03-10',
        status: 'ATIVO'
      }
    ];

    const mockVacationRequests: VacationRequest[] = [
      {
        id: 1,
        employee: mockEmployees[1],
        period_start: '2024-12-01',
        period_end: '2024-12-15',
        status: 'PENDING',
        approver: undefined
      },
      {
        id: 2,
        employee: mockEmployees[2],
        period_start: '2024-11-20',
        period_end: '2024-12-05',
        status: 'APPROVED',
        approver: 'João Silva'
      }
    ];

    const mockPayslips: Payslip[] = [
      {
        id: 1,
        employee: mockEmployees[1],
        competencia: '2024-01',
        bruto: 3500.00,
        descontos: 500.00,
        liquido: 3000.00
      },
      {
        id: 2,
        employee: mockEmployees[2],
        competencia: '2024-01',
        bruto: 2800.00,
        descontos: 400.00,
        liquido: 2400.00
      }
    ];

    setEmployees(mockEmployees);
    setVacationRequests(mockVacationRequests);
    setPayslips(mockPayslips);
    setLoading(false);
  }, []);

  const handleApproveVacation = (requestId: number) => {
    setVacationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'APPROVED', approver: 'Usuário Atual' }
          : req
      )
    );
  };

  const handleRejectVacation = (requestId: number) => {
    setVacationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'REJECTED', approver: 'Usuário Atual' }
          : req
      )
    );
  };

  const handleRequestVacation = () => {
    // Simular solicitação de férias para funcionário
    alert('Solicitação de férias enviada! Em uma implementação real, aqui seria feito o envio para o servidor.');
  };

  const handleDownloadPayslip = (payslipId: number) => {
    // Simular download de contracheque
    alert(`Download do contracheque ${payslipId} iniciado! Em uma implementação real, aqui seria feito o download do arquivo.`);
  };

  // Verificar permissões baseado no perfil
  const canViewEmployees = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageVacations = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canViewOwnData = userRole === 'EMPLOYEE';
  const canViewPayslips = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR' || userRole === 'EMPLOYEE';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Recursos Humanos</h1>
          <p className="text-gray-600 mt-2">
            {userRole === 'EMPLOYEE' 
              ? 'Portal do Funcionário - Acompanhe suas informações pessoais' 
              : 'Gestão de funcionários, férias e contracheques'
            }
          </p>
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
              {canViewEmployees && (
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'employees'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Funcionários ({employees.length})
                </button>
              )}
              {canManageVacations && (
                <button
                  onClick={() => setActiveTab('vacations')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'vacations'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Solicitações de Férias ({vacationRequests.filter(r => r.status === 'PENDING').length})
                </button>
              )}
              {canViewOwnData && (
                <button
                  onClick={() => setActiveTab('employee-portal')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'employee-portal'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Meu Portal
                </button>
              )}
              {canViewPayslips && (
                <button
                  onClick={() => setActiveTab('payslips')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payslips'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contracheques
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'employees' && canViewEmployees && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Funcionários</h3>
                  {(userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN') && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Novo Funcionário
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funcionário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matrícula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cargo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lotação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        {(userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN') && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.user.first_name} {employee.user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{employee.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.matricula}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.cargo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.lotacao}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              employee.status === 'ATIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {employee.status}
                            </span>
                          </td>
                          {(userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                Editar
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Desativar
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'vacations' && canManageVacations && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Solicitações de Férias</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funcionário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aprovador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vacationRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.employee.user.first_name} {request.employee.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{request.employee.cargo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(request.period_start).toLocaleDateString('pt-BR')} a {new Date(request.period_end).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status === 'PENDING' ? 'PENDENTE' : 
                               request.status === 'APPROVED' ? 'APROVADO' : 'REJEITADO'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.approver || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleApproveVacation(request.id)}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  Aprovar
                                </button>
                                <button 
                                  onClick={() => handleRejectVacation(request.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Rejeitar
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'employee-portal' && canViewOwnData && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Meu Portal de Funcionário</h3>
                
                {/* Informações Pessoais */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informações Pessoais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                      <p className="text-sm text-gray-900">Maria Santos</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Matrícula</label>
                      <p className="text-sm text-gray-900">002</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cargo</label>
                      <p className="text-sm text-gray-900">Auxiliar Administrativo</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lotação</label>
                      <p className="text-sm text-gray-900">Secretaria de Educação</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Regime</label>
                      <p className="text-sm text-gray-900">Estatutário</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data de Admissão</label>
                      <p className="text-sm text-gray-900">20/06/2022</p>
                    </div>
                  </div>
                </div>

                {/* Solicitação de Férias */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Solicitar Férias</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    <button 
                      onClick={handleRequestVacation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Solicitar Férias
                    </button>
                  </div>
                </div>

                {/* Status das Solicitações */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Status das Minhas Solicitações</h4>
                  <div className="space-y-3">
                    {vacationRequests.filter(r => r.employee.user.role === 'EMPLOYEE').map((request) => (
                      <div key={request.id} className="flex justify-between items-center p-3 bg-white rounded border">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(request.period_start).toLocaleDateString('pt-BR')} a {new Date(request.period_end).toLocaleDateString('pt-BR')}
                          </span>
                          <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'PENDING' ? 'PENDENTE' : 
                             request.status === 'APPROVED' ? 'APROVADO' : 'REJEITADO'}
                          </span>
                        </div>
                        {request.approver && (
                          <span className="text-sm text-gray-500">Aprovado por: {request.approver}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payslips' && canViewPayslips && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {userRole === 'EMPLOYEE' ? 'Meus Contracheques' : 'Contracheques'}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Funcionário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Competência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salário Bruto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descontos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salário Líquido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payslips
                        .filter(p => userRole === 'EMPLOYEE' ? p.employee.user.role === 'EMPLOYEE' : true)
                        .map((payslip) => (
                        <tr key={payslip.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payslip.employee.user.first_name} {payslip.employee.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{payslip.employee.cargo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payslip.competencia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.bruto.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.descontos.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.liquido.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleDownloadPayslip(payslip.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
