'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import { Invoice, Taxpayer } from '@/types/tributos';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  taxpayers: Taxpayer[];
  onSubmit: (data: Partial<Invoice>) => Promise<void>;
  loading?: boolean;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  invoice,
  taxpayers,
  onSubmit,
  loading = false
}: InvoiceModalProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    taxpayer_id: 0,
    number: '',
    issue_dt: '',
    service_code: '',
    description: '',
    amount: 0,
    status: 'EMITIDA'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        taxpayer_id: invoice.taxpayer_id,
        number: invoice.number,
        issue_dt: invoice.issue_dt,
        service_code: invoice.service_code,
        description: invoice.description,
        amount: invoice.amount,
        status: invoice.status
      });
    } else {
      setFormData({
        taxpayer_id: 0,
        number: '',
        issue_dt: new Date().toISOString().split('T')[0],
        service_code: '',
        description: '',
        amount: 0,
        status: 'EMITIDA'
      });
    }
    setErrors({});
  }, [invoice]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taxpayer_id) {
      newErrors.taxpayer_id = 'Contribuinte é obrigatório';
    }

    if (!formData.number?.trim()) {
      newErrors.number = 'Número da NF é obrigatório';
    }

    if (!formData.issue_dt) {
      newErrors.issue_dt = 'Data de emissão é obrigatória';
    }

    if (!formData.service_code?.trim()) {
      newErrors.service_code = 'Código do serviço é obrigatório';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar nota fiscal:', error);
    }
  };

  const title = invoice ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contribuinte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribuinte *
          </label>
          <select
            value={formData.taxpayer_id || ''}
            onChange={(e) => handleInputChange('taxpayer_id', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.taxpayer_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione um contribuinte</option>
            {taxpayers.map((taxpayer) => (
              <option key={taxpayer.id} value={taxpayer.id}>
                {taxpayer.name} - {taxpayer.doc}
              </option>
            ))}
          </select>
          {errors.taxpayer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.taxpayer_id}</p>
          )}
        </div>

        {/* Número da NF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número da NF *
          </label>
          <input
            type="text"
            value={formData.number || ''}
            onChange={(e) => handleInputChange('number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: NF001/2024"
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number}</p>
          )}
        </div>

        {/* Data de Emissão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Emissão *
          </label>
          <input
            type="date"
            value={formData.issue_dt || ''}
            onChange={(e) => handleInputChange('issue_dt', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.issue_dt ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.issue_dt && (
            <p className="mt-1 text-sm text-red-600">{errors.issue_dt}</p>
          )}
        </div>

        {/* Código do Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Serviço *
          </label>
          <input
            type="text"
            value={formData.service_code || ''}
            onChange={(e) => handleInputChange('service_code', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.service_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 01.01.01"
          />
          {errors.service_code && (
            <p className="mt-1 text-sm text-red-600">{errors.service_code}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Serviço *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descreva o serviço prestado"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'EMITIDA'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="EMITIDA">Emitida</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="PAGA">Paga</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : (invoice ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
