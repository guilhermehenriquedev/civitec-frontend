'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import { Taxpayer } from '@/types/tributos';

interface TaxpayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxpayer?: Taxpayer | null;
  onSubmit: (data: Partial<Taxpayer>) => Promise<void>;
  loading?: boolean;
}

export default function TaxpayerModal({ 
  isOpen, 
  onClose, 
  taxpayer, 
  onSubmit, 
  loading = false 
}: TaxpayerModalProps) {
  const [formData, setFormData] = useState<Partial<Taxpayer>>({
    name: '',
    doc: '',
    type: 'PF',
    address: '',
    phone: '',
    email: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (taxpayer) {
      setFormData({
        name: taxpayer.name,
        doc: taxpayer.doc,
        type: taxpayer.type,
        address: taxpayer.address,
        phone: taxpayer.phone || '',
        email: taxpayer.email || '',
        is_active: taxpayer.is_active
      });
    } else {
      setFormData({
        name: '',
        doc: '',
        type: 'PF',
        address: '',
        phone: '',
        email: '',
        is_active: true
      });
    }
    setErrors({});
  }, [taxpayer]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome/Razão Social é obrigatório';
    }

    if (!formData.doc?.trim()) {
      newErrors.doc = 'CPF/CNPJ é obrigatório';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
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
      console.error('Erro ao salvar contribuinte:', error);
    }
  };

  const formatDocument = (value: string, type: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'PF') {
      // Formato CPF: XXX.XXX.XXX-XX
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // Formato CNPJ: XX.XXX.XXX/XXXX-XX
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleDocChange = (value: string) => {
    const formatted = formatDocument(value, formData.type || 'PF');
    setFormData(prev => ({ ...prev, doc: formatted }));
    
    if (errors.doc) {
      setErrors(prev => ({ ...prev, doc: '' }));
    }
  };

  const title = taxpayer ? 'Editar Contribuinte' : 'Novo Contribuinte';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Pessoa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Pessoa *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="PF"
                checked={formData.type === 'PF'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2"
              />
              Pessoa Física
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="PJ"
                checked={formData.type === 'PJ'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2"
              />
              Pessoa Jurídica
            </label>
          </div>
        </div>

        {/* Nome/Razão Social */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === 'PF' ? 'Nome Completo' : 'Razão Social'} *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.type === 'PF' ? 'Digite o nome completo' : 'Digite a razão social'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* CPF/CNPJ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === 'PF' ? 'CPF' : 'CNPJ'} *
          </label>
          <input
            type="text"
            value={formData.doc || ''}
            onChange={(e) => handleDocChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.doc ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
            maxLength={formData.type === 'PF' ? 14 : 18}
          />
          {errors.doc && (
            <p className="mt-1 text-sm text-red-600">{errors.doc}</p>
          )}
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço *
          </label>
          <textarea
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite o endereço completo"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="exemplo@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Status Ativo */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Contribuinte ativo</span>
          </label>
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
            {loading ? 'Salvando...' : (taxpayer ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
