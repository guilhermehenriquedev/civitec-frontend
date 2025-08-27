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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Contracheque"
      size="sm"
    >
      <div className="space-y-4">
        {/* Informações do Funcionário */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Funcionário</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-500">Nome</label>
              <p className="text-sm text-gray-900">{payslip.employee.nome_completo}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Matrícula</label>
              <p className="text-sm text-gray-900">{payslip.employee.matricula}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Cargo</label>
              <p className="text-sm text-gray-900">{payslip.employee.cargo}</p>
            </div>
          </div>
        </div>

        {/* Informações do Contracheque */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contracheque</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-500">Competência</label>
              <p className="text-sm text-gray-900">{payslip.competencia}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Data de Geração</label>
              <p className="text-sm text-gray-900">{formatDate(payslip.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Valores Financeiros */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Valores</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Salário Bruto:</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(payslip.bruto)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Descontos:</span>
              <span className="text-sm font-medium text-red-600">-{formatCurrency(payslip.descontos)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Salário Líquido:</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(payslip.liquido)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-3 pt-4">
          {payslip.pdf_url && (
            <button
              type="button"
              onClick={handleOpenPdf}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir PDF
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Baixar PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
