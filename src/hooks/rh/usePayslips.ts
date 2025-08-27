import { useState } from 'react';
import { apiClient } from '@/lib/api';

export interface Payslip {
  id: number;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
    cargo: string;
  };
  employee_id: number;
  competencia: string;
  bruto: number;
  descontos: number;
  liquido: number;
  pdf_url?: string;
  pdf_file?: string;
  created_at: string;
  updated_at: string;
}

export interface PayslipStats {
  total: number;
  pagos: number;
  total_bruto: number;
  total_liquido: number;
}

export interface PayslipFilters {
  search?: string;
  status?: string;
  competencia?: string;
  employee_id?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const usePayslips = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PayslipStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchPayslips = async (filters: PayslipFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.competencia) params.append('competencia', filters.competencia);
      if (filters.employee_id) params.append('employee_id', filters.employee_id.toString());
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/rh/payslips/?${params.toString()}`);
      const data: PaginatedResponse<Payslip> = response.data;

      setPayslips(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);

      // Calcular estatísticas localmente já que o backend não tem endpoint
      const total = data.count;
      const totalBruto = data.results.reduce((sum, payslip) => sum + (payslip.bruto || 0), 0);
      const totalLiquido = data.results.reduce((sum, payslip) => sum + (payslip.liquido || 0), 0);
      
      setStats({
        total,
        pagos: total, // Assumindo que todos os contracheques listados são pagos
        total_bruto: totalBruto,
        total_liquido: totalLiquido
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar contracheques');
      console.error('Erro ao carregar contracheques:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayslipStats = async () => {
    // Como não há endpoint de stats no backend, não fazemos nada
    // As estatísticas são calculadas localmente em fetchPayslips
  };

  const fetchPayslipById = async (id: number): Promise<Payslip | null> => {
    try {
      const response = await apiClient.get(`/api/rh/payslips/${id}/`);
      return response.data;
    } catch (err) {
      console.error('Erro ao carregar contracheque:', err);
      return null;
    }
  };

  const downloadPayslip = async (id: number, payslip: Payslip): Promise<boolean> => {
    try {
      console.log('🔐 Iniciando download de contracheque...');
      console.log('🔐 localStorage disponível:', typeof window !== 'undefined');
      
      // Verificar se estamos no browser
      if (typeof window === 'undefined') {
        throw new Error('Download só pode ser feito no browser');
      }
      
      // Verificar todos os tokens no localStorage
      const accessToken = localStorage.getItem('civitec_access_token');
      const refreshToken = localStorage.getItem('civitec_refresh_token');
      const expiresAt = localStorage.getItem('civitec_token_expires');
      
      console.log('🔐 Tokens no localStorage:');
      console.log('🔐 Access Token:', accessToken ? 'Presente' : 'Ausente');
      console.log('🔐 Refresh Token:', refreshToken ? 'Presente' : 'Ausente');
      console.log('🔐 Expira em:', expiresAt ? new Date(parseInt(expiresAt)).toLocaleString() : 'Não definido');
      
      // Buscar o contracheque atualizado para garantir dados corretos
      const currentPayslip = await fetchPayslipById(id);
      if (!currentPayslip) {
        throw new Error('Contracheque não encontrado');
      }

      // Tentar primeiro com apiClient (que tem interceptors configurados)
      try {
        console.log('🔐 Tentando download via apiClient...');
        const response = await apiClient.get(`/api/rh/payslips/${id}/download/`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf, application/octet-stream, */*',
          }
        });
        
        console.log('✅ Download via apiClient bem-sucedido');
        const blob = response.data;
        
        if (!blob || blob.size === 0) {
          throw new Error('Arquivo PDF inválido ou vazio');
        }
        
        // Processar download
        await processDownload(blob, currentPayslip);
        console.log(`✅ Contracheque baixado com sucesso via apiClient`);
        return true;
        
      } catch (apiError: any) {
        console.log('⚠️ apiClient falhou, tentando fetch nativo...', apiError);
        
        // Fallback para fetch nativo
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rh/payslips/${id}/download/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf, application/octet-stream, */*',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          console.error('❌ Erro HTTP:', fetchResponse.status, errorText);
          
          if (fetchResponse.status === 401) {
            throw new Error(
              'Erro 401: Não autorizado. Seu token de autenticação pode ter expirado. ' +
              'Faça login novamente.'
            );
          }
          
          if (fetchResponse.status === 406) {
            throw new Error(
              'Erro 406: O servidor não conseguiu gerar o PDF. ' +
              'Verifique se o endpoint de download está configurado corretamente.'
            );
          }
          
          if (fetchResponse.status === 501) {
            throw new Error(
              'Funcionalidade de PDF não disponível no servidor. ' +
              'Entre em contato com o administrador para instalar o ReportLab.'
            );
          }
          
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        }

        // Verificar Content-Type
        const contentType = fetchResponse.headers.get('content-type');
        console.log('📄 Content-Type da resposta:', contentType);
        
        if (contentType && !contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
          console.warn('⚠️ Content-Type inesperado:', contentType);
        }

        // Obter blob da resposta
        const blob = await fetchResponse.blob();
        if (!blob || blob.size === 0) {
          throw new Error('Arquivo PDF inválido ou vazio');
        }

        console.log(`📥 Blob recebido: ${blob.size} bytes, tipo: ${blob.type}`);

        // Processar download
        await processDownload(blob, currentPayslip);
        console.log(`✅ Contracheque baixado com sucesso via Fetch`);
        return true;
      }

    } catch (err: any) {
      console.error('❌ Erro ao baixar contracheque:', err);
      
      // Log detalhado para debugging
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);
        console.error('Data:', err.response.data);
      }
      
      throw new Error(
        err.response?.data?.detail || 
        err.message || 
        'Erro ao baixar contracheque. Verifique se o arquivo existe no servidor.'
      );
    }
  };

  // Função auxiliar para processar o download
  const processDownload = async (blob: Blob, payslip: Payslip): Promise<void> => {
    // Criar URL do blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Criar elemento de download
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Nome do arquivo padronizado: contracheque-<competencia>-<matricula>.pdf
    const competencia = payslip.competencia || 'sem-competencia';
    const matricula = payslip.employee?.matricula || 'sem-matricula';
    const filename = `contracheque-${competencia}-${matricula}.pdf`;
    
    link.download = filename;
    link.style.display = 'none';

    // Adicionar ao DOM e clicar
    document.body.appendChild(link);
    link.click();

    // Limpar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    console.log(`📥 Download processado: ${filename} (${blob.size} bytes)`);
  };

  const createPayslip = async (payslipData: Partial<Payslip>): Promise<Payslip | null> => {
    try {
      const response = await apiClient.post('/api/rh/payslips/', payslipData);
      // Recarregar lista após criação
      await fetchPayslips();
      return response.data;
    } catch (err) {
      console.error('Erro ao criar contracheque:', err);
      throw err;
    }
  };

  const updatePayslip = async (id: number, payslipData: Partial<Payslip>): Promise<Payslip | null> => {
    try {
      const response = await apiClient.patch(`/api/rh/payslips/${id}/`, payslipData);
      // Recarregar lista após atualização
      await fetchPayslips();
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar contracheque:', err);
      throw err;
    }
  };

  const deletePayslip = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/rh/payslips/${id}/`);
      // Recarregar lista após exclusão
      await fetchPayslips();
      return true;
    } catch (err) {
      console.error('Erro ao excluir contracheque:', err);
      return false;
    }
  };

  return {
    payslips,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchPayslips,
    fetchPayslipStats,
    fetchPayslipById,
    downloadPayslip,
    createPayslip,
    updatePayslip,
    deletePayslip
  };
};
