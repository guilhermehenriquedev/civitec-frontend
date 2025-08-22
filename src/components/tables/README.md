# Componentes de Tabela

Este diretório contém componentes de tabela reutilizáveis para o sistema CiviTec.

## DataTable

O `DataTable` é um componente avançado de tabela com funcionalidades integradas de busca, filtros, ordenação e paginação.

### Características

- ✅ **Busca em tempo real** com ícone de lupa
- ✅ **Filtros configuráveis** por coluna
- ✅ **Ordenação** clicando nos cabeçalhos das colunas
- ✅ **Paginação** com seletor de itens por página
- ✅ **Responsivo** para dispositivos móveis
- ✅ **Tema consistente** com o design system
- ✅ **Estado persistente** de filtros e busca

### Props

```typescript
interface DataTableProps {
  columns: TableColumn[];           // Definição das colunas
  data: any[];                      // Dados da tabela
  title?: string;                   // Título da tabela (opcional)
  emptyMessage?: string;            // Mensagem quando não há dados
  className?: string;               // Classes CSS adicionais
  onRowClick?: (row: any) => void; // Callback para clique na linha
  filters?: FilterConfig[];         // Configuração dos filtros
  searchable?: boolean;             // Habilita busca (padrão: true)
  searchPlaceholder?: string;       // Placeholder do campo de busca
  pagination?: boolean;             // Habilita paginação (padrão: true)
  itemsPerPage?: number;            // Itens por página (padrão: 10)
  showItemsPerPageSelector?: boolean; // Mostra seletor de itens por página
  itemsPerPageOptions?: number[];   // Opções de itens por página
}
```

### Exemplo de Uso

```typescript
import { DataTable } from '@/components/tables';

// Dados da tabela
const data = [
  { id: 1, nome: 'João Silva', cargo: 'Desenvolvedor', status: 'ATIVO' },
  { id: 2, nome: 'Maria Santos', cargo: 'Designer', status: 'FERIAS' }
];

// Definição das colunas
const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'cargo', label: 'Cargo' },
  { key: 'status', label: 'Status' }
];

// Configuração dos filtros
const filters = [
  {
    key: 'status',
    options: [
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'FERIAS', label: 'Em Férias' }
    ],
    placeholder: 'Status'
  }
];

// Uso do componente
<DataTable
  data={data}
  columns={columns}
  title="Lista de Funcionários"
  filters={filters}
  searchable={true}
  pagination={true}
  itemsPerPage={10}
/>
```

### Funcionalidades

#### Busca
- Busca em todas as colunas da tabela
- Atualização em tempo real
- Reset automático da paginação

#### Filtros
- Filtros por coluna específica
- Opções configuráveis
- Múltiplos filtros simultâneos
- Botão para limpar todos os filtros

#### Ordenação
- Clique no cabeçalho para ordenar
- Alternância entre ascendente/descendente
- Indicador visual da direção da ordenação

#### Paginação
- Navegação entre páginas
- Seletor de itens por página
- Informações sobre resultados mostrados
- Navegação inteligente (máximo 5 páginas visíveis)

### Estilização

O componente usa Tailwind CSS e segue o design system do CiviTec:
- Cores consistentes (indigo para elementos ativos)
- Sombras e bordas padronizadas
- Hover states e transições suaves
- Layout responsivo

### Acessibilidade

- Navegação por teclado
- Labels semânticos
- Estados visuais claros
- Suporte a leitores de tela

## Table (Legado)

O componente `Table` original ainda está disponível para casos simples que não precisam das funcionalidades avançadas do `DataTable`.

### Migração

Para migrar de `Table` para `DataTable`:

1. **Substituir o import:**
   ```typescript
   // Antes
   import { Table } from '@/components';
   
   // Depois
   import { DataTable } from '@/components/tables';
   ```

2. **Atualizar o uso:**
   ```typescript
   // Antes
   <Table data={data} columns={columns} />
   
   // Depois
   <DataTable 
     data={data} 
     columns={columns}
     searchable={true}
     pagination={true}
   />
   ```

3. **Adicionar funcionalidades opcionais:**
   - Filtros específicos para sua tabela
   - Título personalizado
   - Configurações de paginação

### Páginas Atualizadas

As seguintes páginas já foram migradas para usar o `DataTable`:

- ✅ `/rh/funcionarios` - Lista de funcionários
- ✅ `/rh/ferias` - Solicitações de férias  
- ✅ `/rh/contracheque` - Contracheques

### Benefícios da Migração

- **Consistência visual** em todas as tabelas
- **Melhor UX** com busca e filtros integrados
- **Manutenibilidade** centralizada
- **Performance** otimizada com paginação
- **Responsividade** aprimorada


