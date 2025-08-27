'use client';

import React from 'react';
import Modal from '@/components/modals/Modal';

interface PayslipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: {
    id: number;
    employee: {
      nome_completo: string;
      matricula: string;
      cargo: string;
    };
    competencia: string;
    bruto: number;
    descontos: number;
    liquido: number;
    pdf_url?: string;
    created_at: string;
  } | null;
  onDownload?: (id: number) => Promise<void>;
}

export default function PayslipViewModal({ 
  isOpen, 
  onClose, 
  payslip, 
  onDownload 
}: PayslipViewModalProps) {
  if (!payslip) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDownload = async () => {
    if (onDownload) {
      await onDownload(payslip.id);
    }
  };

  const handleOpenPdf = () => {
    if (payslip.pdf_url) {
      window.open(payslip.pdf_url, '_blank');
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
      >
        Fechar
      </button>
      {payslip.pdf_url && (
        <button
          type="button"
          onClick={handleOpenPdf}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Abrir PDF
        </button>
      )}
      {onDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Download
        </button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Contracheque"
      size="md"
      footer={footer}
    >
      {/* Informações do Funcionário - EXATAMENTE igual a Gerenciar Usuários */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{payslip.employee.nome_completo}</p>
            <p className="text-sm text-gray-600">Matrícula: {payslip.employee.matricula}</p>
          </div>
        </div>
      </div>

      {/* Detalhes do Contracheque */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Competência</label>
            <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{payslip.competencia}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Geração</label>
            <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{formatDate(payslip.created_at)}</p>
          </div>
        </div>

        {/* Valores Financeiros */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <h4 className="text-sm font-medium text-green-800 mb-3">Valores Financeiros</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-green-600 mb-1">Salário Bruto</label>
              <p className="text-lg font-semibold text-green-900">
                {formatCurrency(payslip.bruto || 0)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-red-600 mb-1">Descontos</label>
              <p className="text-lg font-semibold text-red-900">
                {formatCurrency(payslip.descontos || 0)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">Salário Líquido</label>
              <p className="text-lg font-semibold text-blue-900">
                {formatCurrency(payslip.liquido || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
