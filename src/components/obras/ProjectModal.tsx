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
    }
    setErrors({});
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Orçamento deve ser maior que zero';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória';
    }

    if (!formData.expected_end_date) {
      newErrors.expected_end_date = 'Data prevista de conclusão é obrigatória';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.responsible.trim()) {
      newErrors.responsible = 'Responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateUpdateProject, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    label: `${contract.number} - ${contract.objeto}`
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Editar Projeto' : 'Novo Projeto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Nome do Projeto *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Select
            name="contract"
            label="Contrato"
            value={formData.contract?.toString() || ''}
            onChange={(e) => handleInputChange('contract', e.target.value ? parseInt(e.target.value) : undefined)}
            options={[{ value: '', label: 'Selecione um contrato' }, ...contractOptions]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="lat"
            label="Latitude"
            type="number"
            value={formData.location_lat || ''}
            onChange={(e) => handleInputChange('location_lat', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="-23.5505"
          />

          <Input
            name="lng"
            label="Longitude"
            type="number"
            value={formData.location_lng || ''}
            onChange={(e) => handleInputChange('location_lng', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="-46.6333"
          />
        </div>

        <Input
          name="address"
          label="Endereço *"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={errors.address}
          required
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="start_date"
            label="Data de Início *"
            type="text"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            error={errors.start_date}
            required
            placeholder="YYYY-MM-DD"
          />

          <Input
            name="expected_end_date"
            label="Data Prevista de Conclusão *"
            type="text"
            value={formData.expected_end_date}
            onChange={(e) => handleInputChange('expected_end_date', e.target.value)}
            error={errors.expected_end_date}
            required
            placeholder="YYYY-MM-DD"
          />
        </div>

        <Input
          name="actual_end_date"
          label="Data Real de Conclusão"
          type="text"
          value={formData.actual_end_date || ''}
          onChange={(e) => handleInputChange('actual_end_date', e.target.value)}
          placeholder="YYYY-MM-DD"
        />

        <Input
          name="description"
          label="Descrição *"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          required
        />

        <Input
          name="responsible"
          label="Responsável *"
          value={formData.responsible}
          onChange={(e) => handleInputChange('responsible', e.target.value)}
          error={errors.responsible}
          required
        />

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
