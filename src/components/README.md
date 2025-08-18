# Componentes Reutilizáveis

Este diretório contém componentes reutilizáveis para o sistema CiviTec.

## Estrutura

```
components/
├── modals/          # Componentes de modal
├── buttons/         # Botões reutilizáveis
├── forms/           # Campos de formulário
├── tables/          # Tabelas
├── ui/              # Componentes de interface
└── index.ts         # Exportações centralizadas
```

## Como Usar

### 1. Modal

```tsx
import { Modal } from '@/components';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Título do Modal"
  size="md"
>
  <div>Conteúdo do modal aqui</div>
</Modal>
```

### 2. Button

```tsx
import { Button } from '@/components';

<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  loading={isSubmitting}
>
  Clique aqui
</Button>
```

### 3. Input

```tsx
import { Input } from '@/components';

<Input
  label="Nome"
  name="name"
  placeholder="Digite seu nome"
  required
  error={errors.name?.message}
/>
```

### 4. Select

```tsx
import { Select } from '@/components';

<Select
  label="Papel"
  name="role"
  options={[
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuário' }
  ]}
  placeholder="Selecione um papel"
  required
/>
```

### 5. Table

```tsx
import { Table } from '@/components';

<Table
  columns={[
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, row) => (
        <button onClick={() => editRow(row)}>Editar</button>
      )
    }
  ]}
  data={users}
  emptyMessage="Nenhum usuário encontrado"
/>
```

### 6. Badge

```tsx
import { Badge } from '@/components';

<Badge variant="success" size="md">
  Ativo
</Badge>
```

### 7. Card

```tsx
import { Card } from '@/components';

<Card
  title="Título do Card"
  subtitle="Subtítulo opcional"
>
  Conteúdo do card aqui
</Card>
```

## Vantagens

- **Reutilização**: Componentes podem ser usados em múltiplas páginas
- **Consistência**: Visual e comportamento padronizados
- **Manutenibilidade**: Mudanças centralizadas
- **TypeScript**: Tipagem completa para melhor desenvolvimento
- **Responsivo**: Todos os componentes são responsivos por padrão
- **Acessibilidade**: Seguem boas práticas de acessibilidade

## Personalização

Todos os componentes aceitam `className` para personalização adicional:

```tsx
<Button className="mt-4 w-full">
  Botão personalizado
</Button>
```



