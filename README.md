# ⚛️ Frontend Civitec - Aplicação Next.js

## 📋 Descrição

O frontend do Civitec é uma aplicação web moderna desenvolvida em Next.js 15 com React 19, oferecendo uma interface intuitiva e responsiva para o sistema de gestão municipal. A aplicação utiliza as melhores práticas de desenvolvimento web moderno.

## 🏗️ Arquitetura

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Jotai
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Package Manager**: pnpm

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                 # App Router do Next.js 15
│   │   ├── layout.tsx      # Layout principal
│   │   ├── page.tsx        # Página inicial
│   │   └── globals.css     # Estilos globais
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   └── [outros]/       # Componentes específicos
│   ├── modules/             # Módulos da aplicação
│   │   ├── licitacao/      # Módulo de licitações
│   │   ├── obras/          # Módulo de obras
│   │   ├── rh/             # Módulo de recursos humanos
│   │   └── tributos/       # Módulo de tributos
│   ├── lib/                 # Utilitários e configurações
│   └── types/               # Definições de tipos TypeScript
├── public/                  # Arquivos estáticos
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── tailwind.config.js       # Configuração Tailwind CSS
├── next.config.ts           # Configuração Next.js
└── .env.local               # Variáveis de ambiente (criar)
```

## 🚀 Como Executar Localmente

### 1. Pré-requisitos

Certifique-se de ter instalado:

- **Node.js 18+** (recomendado: Node.js 20 LTS)
- **pnpm** (gerenciador de pacotes)
- **Git**

### 2. Instalação do pnpm

Se você não tiver o pnpm instalado:

```bash
# Instalar globalmente via npm
npm install -g pnpm

# Ou via Homebrew (macOS)
brew install pnpm

# Verificar instalação
pnpm --version
```

### 3. Clone e Navegação

```bash
# Navegue para o diretório do frontend
cd civitec/frontend

# Verifique se está no diretório correto
ls -la
# Deve mostrar: package.json, src/, public/, etc.
```

### 4. Instalação das Dependências

```bash
# Instale todas as dependências
pnpm install

# Verifique se as dependências foram instaladas
ls node_modules
```

### 5. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do frontend:

```bash
# Arquivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Civitec
NEXT_PUBLIC_APP_VERSION=1.0.0

# Configurações de desenvolvimento
NODE_ENV=development
```

**⚠️ IMPORTANTE**: 
- Nunca commite o arquivo `.env.local` no Git!
- Variáveis com `NEXT_PUBLIC_` são expostas ao cliente
- Outras variáveis são apenas para o servidor

### 6. Verificação da Instalação

```bash
# Verifique se o Next.js foi instalado
pnpm next --version

# Verifique se o React foi instalado
pnpm list react
```

### 7. Execução do Servidor de Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
pnpm dev

# Ou use o comando completo
pnpm run dev
```

O servidor será iniciado em `http://localhost:3000`

### 8. Verificação da Aplicação

Abra seu navegador e acesse:

- **Aplicação**: http://localhost:3000
- **Página inicial**: http://localhost:3000/
- **Módulos**: http://localhost:3000/[modulo]

## 🔧 Scripts Disponíveis

### Desenvolvimento

```bash
# Servidor de desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Servidor de produção
pnpm start

# Linting e correção
pnpm lint

# Linting com correção automática
pnpm lint:fix

# Verificação de tipos TypeScript
pnpm type-check
```

### Build e Deploy

```bash
# Build para produção
pnpm build

# Análise do bundle
pnpm analyze

# Teste do build localmente
pnpm start
```

## 🎨 Configuração do Tailwind CSS

O projeto usa Tailwind CSS 4 com configuração personalizada:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas do Civitec
        primary: '#1e40af',
        secondary: '#64748b',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
    },
  },
  plugins: [],
}
```

## 📱 Componentes e UI

### shadcn/ui

O projeto utiliza componentes base do shadcn/ui:

```bash
# Instalar novos componentes
pnpm dlx shadcn@latest add [component-name]

# Exemplos de componentes disponíveis
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add table
```

### Estrutura de Componentes

```
components/
├── ui/                     # Componentes base (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── forms/                  # Componentes de formulário
├── charts/                 # Componentes de gráficos
├── maps/                   # Componentes de mapas
└── layout/                 # Componentes de layout
```

## 🗺️ Integração com Mapas

### Leaflet + React Leaflet

```bash
# Instalar dependências de mapas
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet
```

### Exemplo de Uso

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export function MapComponent() {
  return (
    <MapContainer center={[-23.5505, -46.6333]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[-23.5505, -46.6333]}>
        <Popup>Localização da Prefeitura</Popup>
      </Marker>
    </MapContainer>
  )
}
```

## 📊 Gráficos e Visualizações

### Recharts

```bash
# Instalar dependências de gráficos
pnpm add recharts
```

### Exemplo de Uso

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  // ...
]

export function RevenueChart() {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="receita" stroke="#8884d8" />
      <Line type="monotone" dataKey="despesa" stroke="#82ca9d" />
    </LineChart>
  )
}
```

## 🔐 Autenticação e Estado

### Jotai para Gerenciamento de Estado

```tsx
import { atom, useAtom } from 'jotai'

// Estado global do usuário
export const userAtom = atom(null)
export const isAuthenticatedAtom = atom(false)

// Hook personalizado
export function useAuth() {
  const [user, setUser] = useAtom(userAtom)
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
  
  return { user, setUser, isAuthenticated, setIsAuthenticated }
}
```

### React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  )
}
```

## 🚀 Deploy e Produção

### Build de Produção

```bash
# Build otimizado
pnpm build

# Verificar se o build foi bem-sucedido
pnpm start
```

### Variáveis de Ambiente para Produção

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.civitec.com/api
NEXT_PUBLIC_APP_NAME=Civitec
NODE_ENV=production
```

### Deploy no Vercel (Recomendado)

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

## 🧪 Testes

### Configuração de Testes

```bash
# Instalar dependências de teste
pnpm add -D jest @testing-library/react @testing-library/jest-dom

# Executar testes
pnpm test

# Testes em modo watch
pnpm test:watch

# Cobertura de testes
pnpm test:coverage
```

## 📱 Responsividade e Mobile

### Hook useMobile

```tsx
import { useMobile } from '@/hooks/use-mobile'

export function ResponsiveComponent() {
  const isMobile = useMobile()
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {/* Conteúdo responsivo */}
    </div>
  )
}
```

### Tailwind CSS Responsivo

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
  p-4 
  md:p-6 
  lg:p-8
">
  {/* Grid responsivo */}
</div>
```

## 🔍 SEO e Performance

### Meta Tags

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Civitec - Sistema de Gestão Municipal',
  description: 'Plataforma completa para gestão municipal eficiente',
  keywords: ['gestão municipal', 'prefeitura', 'administração pública'],
}
```

### Otimizações de Performance

```tsx
// Lazy loading de componentes
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Carregando...</div>,
  ssr: false,
})
```

## 🐛 Solução de Problemas

### Erro: "Module not found"
```bash
# Limpe o cache
pnpm store prune

# Reinstale as dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Port 3000 already in use"
```bash
# Encontre o processo
lsof -i :3000

# Mate o processo
kill -9 <PID>

# Ou use uma porta diferente
pnpm dev --port 3001
```

### Erro: "TypeScript compilation failed"
```bash
# Verifique os tipos
pnpm type-check

# Limpe o cache do TypeScript
rm -rf .next
pnpm dev
```

### Erro: "Tailwind CSS not working"
```bash
# Verifique a configuração
cat tailwind.config.js

# Regenere o CSS
pnpm dev
```

## 📚 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Jotai](https://jotai.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todos os arquivos
- Siga as convenções do Next.js 15
- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Use Tailwind CSS para estilização
- Teste seus componentes

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Consulte os logs do console
3. Entre em contato com a equipe de desenvolvimento

---

**Frontend Civitec** - Interface moderna para gestão municipal eficiente.
