'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Button from '@/components/buttons/Button';
import { WorkProject, CreateUpdateProject } from '@/types/obras';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdateProject) => void;
  project?: WorkProject;
  contracts: any[];
  loading?: boolean;
}

export function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  contracts,
  loading = false 
}: ProjectModalProps) {
  const [formData, setFormData] = useState<CreateUpdateProject>({
    name: '',
    contract: undefined,
    location_lat: undefined,
    location_lng: undefined,
    address: '',
    budget: 0,
    status: 'PLANEJAMENTO',
    start_date: '',
    expected_end_date: '',
    actual_end_date: '',
    description: '',
    responsible: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLocationFields, setShowLocationFields] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        contract: project.contract,
        location_lat: project.location_lat || undefined,
        location_lng: project.location_lng || undefined,
        address: project.address,
        budget: project.budget,
        status: project.status,
        start_date: project.start_date,
        expected_end_date: project.expected_end_date,
        actual_end_date: project.actual_end_date || '',
        description: project.description,
        responsible: project.responsible
      });
      setShowLocationFields(!!(project.location_lat && project.location_lng));
    } else {
      setFormData({
        name: '',
        contract: undefined,
        location_lat: undefined,
        location_lng: undefined,
        address: '',
        budget: 0,
        status: 'PLANEJAMENTO',
        start_date: '',
        expected_end_date: '',
        actual_end_date: '',
        description: '',
        responsible: ''
      });
      setShowLocationFields(false);
    }
    setErrors({});
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    } else if (formData.name.trim().length < 5) {
      newErrors.name = 'Nome do projeto deve ter pelo menos 5 caracteres';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Endereço deve ter pelo menos 10 caracteres';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Orçamento deve ser maior que zero';
    } else if (formData.budget > 1000000000) {
      newErrors.budget = 'Orçamento não pode ser maior que R$ 1 bilhão';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória';
    } else {
      const startDate = new Date(formData.start_date);
      const today = new Date();
      const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
      if (startDate < tenYearsAgo) {
        newErrors.start_date = 'Data de início não pode ser muito antiga (máximo 10 anos atrás)';
      }
    }

    if (!formData.expected_end_date) {
      newErrors.expected_end_date = 'Data prevista de conclusão é obrigatória';
    } else if (formData.start_date && formData.expected_end_date < formData.start_date) {
      newErrors.expected_end_date = 'Data de conclusão deve ser posterior à data de início';
    } else if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      const expectedEndDate = new Date(formData.expected_end_date);
      const diffTime = expectedEndDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 3650) { // 10 anos
        newErrors.expected_end_date = 'Prazo de execução não pode ser maior que 10 anos';
      }
    }

    // Validar data real de conclusão se preenchida
    if (formData.actual_end_date) {
      if (formData.start_date && formData.actual_end_date < formData.start_date) {
        newErrors.actual_end_date = 'Data real de conclusão deve ser posterior à data de início';
      }
      if (formData.expected_end_date && formData.actual_end_date < formData.expected_end_date) {
        newErrors.actual_end_date = 'Data real de conclusão deve ser posterior à data prevista';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }

    if (!formData.responsible.trim()) {
      newErrors.responsible = 'Responsável é obrigatório';
    } else if (formData.responsible.trim().length < 3) {
      newErrors.responsible = 'Nome do responsável deve ter pelo menos 3 caracteres';
    }

    // Validar coordenadas se fornecidas
    if (showLocationFields) {
      if (formData.location_lat === undefined || formData.location_lat === null) {
        newErrors.location_lat = 'Latitude é obrigatória quando localização está habilitada';
      } else if (formData.location_lat < -90 || formData.location_lat > 90) {
        newErrors.location_lat = 'Latitude deve estar entre -90 e 90';
      }

      if (formData.location_lng === undefined || formData.location_lng === null) {
        newErrors.location_lng = 'Longitude é obrigatória quando localização está habilitada';
      } else if (formData.location_lng < -180 || formData.location_lng > 180) {
        newErrors.location_lng = 'Longitude deve estar entre -180 e 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Limpar campos vazios antes de enviar
      const cleanData = { ...formData };
      
      if (!cleanData.actual_end_date) {
        delete (cleanData as any).actual_end_date;
      }
      
      if (!cleanData.contract) {
        delete (cleanData as any).contract;
      }
      
      if (!showLocationFields || !cleanData.location_lat || !cleanData.location_lng) {
        delete (cleanData as any).location_lat;
        delete (cleanData as any).location_lng;
      }
      
      onSubmit(cleanData);
    }
  };

  const handleInputChange = (field: keyof CreateUpdateProject, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationToggle = () => {
    setShowLocationFields(!showLocationFields);
    if (!showLocationFields) {
      // Limpar coordenadas quando desabilitar
      setFormData(prev => ({
        ...prev,
        location_lat: undefined,
        location_lng: undefined
      }));
    }
    // Limpar erros relacionados
    setErrors(prev => ({
      ...prev,
      location_lat: '',
      location_lng: ''
    }));
  };

  const statusOptions = [
    { value: 'PLANEJAMENTO', label: 'Planejamento' },
    { value: 'LICITACAO', label: 'Licitação' },
    { value: 'EXECUCAO', label: 'Em Execução' },
    { value: 'PARALISADA', label: 'Paralisada' },
    { value: 'CONCLUIDA', label: 'Concluída' },
    { value: 'CANCELADA', label: 'Cancelada' }
  ];

  const contractOptions = contracts.map(contract => ({
    value: contract.id.toString(),
    label: `${contract.number} - ${contract.objeto} (R$ ${contract.valor_total.toLocaleString()})`
  }));

  // Função para formatar orçamento
  const formatBudget = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Função para calcular prazo de execução
  const calculateExecutionTime = () => {
    if (formData.start_date && formData.expected_end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.expected_end_date);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;
        
        let result = '';
        if (years > 0) result += `${years} ano${years > 1 ? 's' : ''} `;
        if (months > 0) result += `${months} mes${months > 1 ? 'es' : ''} `;
        if (days > 0) result += `${days} dia${days > 1 ? 's' : ''}`;
        
        return result.trim();
      }
    }
    return '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Editar Projeto' : 'Novo Projeto'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Informações Básicas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nome do Projeto *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              placeholder="Ex: Construção da Escola Municipal"
            />

            <Select
              name="contract"
              label="Contrato"
              value={formData.contract?.toString() || ''}
              onChange={(e) => handleInputChange('contract', e.target.value ? parseInt(e.target.value) : undefined)}
              options={[{ value: '', label: 'Selecione um contrato' }, ...contractOptions]}
            />
          </div>

          <Input
            name="address"
            label="Endereço *"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={errors.address}
            required
            placeholder="Endereço completo da obra"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="budget"
              label="Orçamento *"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
              error={errors.budget}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />

            <Select
              name="status"
              label="Status *"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
              required
            />
          </div>
        </div>

        {/* Localização */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Localização
            </h4>
            <button
              type="button"
              onClick={handleLocationToggle}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                showLocationFields
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showLocationFields ? 'Ocultar Coordenadas' : 'Adicionar Coordenadas'}
            </button>
          </div>

          {showLocationFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                name="lat"
                label="Latitude *"
                type="number"
                value={formData.location_lat || ''}
                onChange={(e) => handleInputChange('location_lat', e.target.value ? parseFloat(e.target.value) : undefined)}
                error={errors.location_lat}
                required
                placeholder="-23.5505"
                step="any"
                min="-90"
                max="90"
              />

              <Input
                name="lng"
                label="Longitude *"
                type="number"
                value={formData.location_lng || ''}
                onChange={(e) => handleInputChange('location_lng', e.target.value ? parseFloat(e.target.value) : undefined)}
                error={errors.location_lng}
                required
                placeholder="-46.6333"
                step="any"
                min="-180"
                max="180"
              />
            </div>
          )}
        </div>

        {/* Datas */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Cronograma
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="start_date"
              label="Data de Início *"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              error={errors.start_date}
              required
              max={formData.expected_end_date || undefined}
            />

            <Input
              name="expected_end_date"
              label="Data Prevista de Conclusão *"
              type="date"
              value={formData.expected_end_date}
              onChange={(e) => handleInputChange('expected_end_date', e.target.value)}
              error={errors.expected_end_date}
              required
              min={formData.start_date || undefined}
            />
          </div>

          <Input
            name="actual_end_date"
            label="Data Real de Conclusão"
            type="date"
            value={formData.actual_end_date || ''}
            onChange={(e) => handleInputChange('actual_end_date', e.target.value)}
            error={errors.actual_end_date}
            min={formData.start_date || undefined}
            max={new Date().toISOString().split('T')[0]}
          />

          {/* Resumo do cronograma */}
          {formData.start_date && formData.expected_end_date && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Resumo do Cronograma</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Prazo de Execução:</span>
                  <span className="ml-2 font-medium text-blue-900">{calculateExecutionTime()}</span>
                </div>
                <div>
                  <span className="text-blue-700">Status:</span>
                  <span className="ml-2 font-medium text-blue-900">
                    {formData.actual_end_date ? 'Concluído' : 'Em andamento'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Descrição e Responsável */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Detalhes
          </h4>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva detalhadamente o projeto, escopo, objetivos, etc."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                transition-all duration-200 bg-white text-gray-900 font-medium 
                hover:border-gray-400 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Input
            name="responsible"
            label="Responsável *"
            value={formData.responsible}
            onChange={(e) => handleInputChange('responsible', e.target.value)}
            error={errors.responsible}
            required
            placeholder="Nome completo do responsável técnico"
          />
        </div>

        {/* Resumo do projeto */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Resumo do Projeto</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-700">Orçamento:</span>
              <span className="ml-2 font-medium text-gray-900">{formatBudget(formData.budget)}</span>
            </div>
            <div>
              <span className="text-gray-700">Status:</span>
              <span className="ml-2 font-medium text-gray-900">
                {statusOptions.find(s => s.value === formData.status)?.label}
              </span>
            </div>
            <div>
              <span className="text-gray-700">Localização:</span>
              <span className="ml-2 font-medium text-gray-900">
                {showLocationFields && formData.location_lat && formData.location_lng ? 'Definida' : 'Não definida'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {project ? 'Atualizar' : 'Criar'} Projeto
          </Button>
        </div>
      </form>
    </Modal>
  );
}
