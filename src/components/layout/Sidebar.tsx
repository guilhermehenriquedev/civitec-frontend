'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN', 'SECTOR_OPERATOR', 'EMPLOYEE'],
    showForEmployee: true
  },
  { 
    name: 'RH', 
    href: '/rh', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN', 'SECTOR_OPERATOR', 'EMPLOYEE'], 
    sector: 'RH',
    showForEmployee: true
  },
  { 
    name: 'Tributos', 
    href: '/tributos', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN', 'SECTOR_OPERATOR'], 
    sector: 'TRIBUTOS',
    showForEmployee: false
  },
  { 
    name: 'Licitação', 
    href: '/licitacao', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN', 'SECTOR_OPERATOR'], 
    sector: 'LICITACAO',
    showForEmployee: false
  },
  { 
    name: 'Obras', 
    href: '/obras', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN', 'SECTOR_OPERATOR'], 
    sector: 'OBRAS',
    showForEmployee: false
  },
  { 
    name: 'Relatórios', 
    href: '/relatorios', 
    roles: ['MASTER_ADMIN', 'SECTOR_ADMIN'],
    showForEmployee: false
  },
  { 
    name: 'Configurações', 
    href: '/configuracoes', 
    roles: ['MASTER_ADMIN'],
    showForEmployee: false
  },
  { 
    name: 'Gerenciar Usuários', 
    href: '/configuracoes/usuarios', 
    roles: ['MASTER_ADMIN'],
    showForEmployee: false
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) {
    return null; // Não renderizar se não há usuário
  }

  const canAccess = (item: typeof navigation[0]) => {
    if (!user) return false;
    
    // MASTER_ADMIN tem acesso a tudo
    if (user.role === 'MASTER_ADMIN') {
      return true;
    }
    
    // Verificar se o usuário tem acesso ao módulo
    if (item.sector && user.sector !== item.sector) {
      return false;
    }
    
    // Verificar se o usuário tem o role necessário
    return item.roles.includes(user.role);
  };

  const accessibleNavigation = navigation.filter(canAccess);

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-white">CiviTec</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {accessibleNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasChildren = item.name === 'Gerenciar Usuários';
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="w-5 h-5 mr-3 flex-shrink-0">
                    {item.name === 'Dashboard' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                    )}
                    {item.name === 'RH' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    )}
                    {item.name === 'Tributos' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {item.name === 'Licitação' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {item.name === 'Obras' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    {item.name === 'Relatórios' && (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {item.name === 'Configurações' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {item.name === 'Gerenciar Usuários' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    )}
                  </div>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
                
                {/* Subpáginas para Gerenciar Usuários */}
                {hasChildren && !collapsed && isActive && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      href="/configuracoes/usuarios"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === '/configuracoes/usuarios'
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-400 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <span>• Visão Geral</span>
                    </Link>
                    <Link
                      href="/configuracoes/usuarios/convites"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === '/configuracoes/usuarios/convites'
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-400 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <span>• Convites</span>
                    </Link>
                    <Link
                      href="/configuracoes/usuarios/usuarios"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === '/configuracoes/usuarios/usuarios'
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-400 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <span>• Usuários</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-700 p-4">
          {!collapsed && user && (
            <div className="mb-4">
              <p className="text-sm text-gray-300">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user.role === 'MASTER_ADMIN' && 'Administrador Geral'}
                {user.role === 'SECTOR_ADMIN' && 'Gerente de Setor'}
                {user.role === 'SECTOR_OPERATOR' && 'Operacional'}
                {user.role === 'EMPLOYEE' && 'Funcionário'}
              </p>
              {user.sector && (
                <p className="text-xs text-gray-400">{user.sector}</p>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
          >
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
