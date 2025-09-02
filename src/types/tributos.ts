export interface Taxpayer {
  id: number;
  name: string;
  doc: string;
  type: 'PF' | 'PJ';
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  taxpayer: {
    id: number;
    name: string;
    doc: string;
  };
  taxpayer_id: number;
  number: string;
  issue_dt: string;
  service_code: string;
  description: string;
  amount: number;
  status: 'EMITIDA' | 'CANCELADA' | 'PAGA';
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: number;
  taxpayer: {
    id: number;
    name: string;
    doc: string;
  };
  taxpayer_id: number;
  tax_kind: 'ISS' | 'IPTU' | 'ITBI' | 'OUTROS';
  competence: string;
  principal: number;
  multa: number;
  juros: number;
  total: number;
  status: 'PENDENTE' | 'EMITIDA' | 'PAGA' | 'VENCIDA';
  created_at: string;
  updated_at: string;
}

export interface TaxpayerStats {
  total: number;
  ativos: number;
  pessoa_fisica: number;
  pessoa_juridica: number;
}

export interface InvoiceStats {
  total: number;
  emitidas: number;
  canceladas: number;
  pagas: number;
  total_value: number;
}

export interface AssessmentStats {
  total: number;
  pendentes: number;
  emitidas: number;
  pagas: number;
  vencidas: number;
  total_value: number;
}

