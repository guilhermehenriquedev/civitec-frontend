import React, { useState } from 'react';
import { Modal, Button, Input, Select, Table, Badge, Card } from '@/components';

// Exemplo de dados para a tabela
const sampleData = [
  { id: 1, name: 'João Silva', email: 'joao@exemplo.com', status: 'active', role: 'admin' },
  { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com', status: 'inactive', role: 'user' },
];

// Exemplo de opções para select
const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
  { value: 'moderator', label: 'Moderador' },
];

export default function ExampleUsage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Exemplos de Uso dos Componentes</h1>
      
      {/* Botões */}
      <Card title="Botões" subtitle="Diferentes variantes e tamanhos">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="danger">Perigo</Button>
            <Button variant="success">Sucesso</Button>
            <Button variant="outline">Contorno</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg">Grande</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button loading>Carregando...</Button>
            <Button disabled>Desabilitado</Button>
          </div>
        </div>
      </Card>

      {/* Formulários */}
      <Card title="Campos de Formulário" subtitle="Input e Select reutilizáveis">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Input
            label="Nome"
            name="name"
            placeholder="Digite seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Select
            label="Papel"
            name="role"
            options={roleOptions}
            placeholder="Selecione um papel"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
          
          <Button type="submit" fullWidth>
            Enviar
          </Button>
        </form>
      </Card>

      {/* Tabela */}
      <Card title="Tabela" subtitle="Componente de tabela reutilizável">
        <Table
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'email', label: 'E-mail' },
            { 
              key: 'status', 
              label: 'Status',
              render: (status) => (
                <Badge variant={status === 'active' ? 'success' : 'default'}>
                  {status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              )
            },
            { key: 'role', label: 'Papel' },
            {
              key: 'actions',
              label: 'Ações',
              render: (_, row) => (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="danger">Excluir</Button>
                </div>
              )
            }
          ]}
          data={sampleData}
          emptyMessage="Nenhum dado encontrado"
        />
      </Card>

      {/* Badges */}
      <Card title="Badges" subtitle="Indicadores de status">
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Padrão</Badge>
          <Badge variant="success">Sucesso</Badge>
          <Badge variant="warning">Atenção</Badge>
          <Badge variant="danger">Perigo</Badge>
          <Badge variant="info">Informação</Badge>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <Badge size="sm">Pequeno</Badge>
          <Badge size="md">Médio</Badge>
          <Badge size="lg">Grande</Badge>
        </div>
      </Card>

      {/* Modal */}
      <Card title="Modal" subtitle="Componente de modal reutilizável">
        <Button onClick={() => setShowModal(true)}>
          Abrir Modal
        </Button>
      </Card>

      {/* Modal de Exemplo */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Exemplo de Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Este é um exemplo de como usar o componente Modal. 
            Ele inclui backdrop blur, animações suaves e é totalmente responsivo.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}



