import type { AuthUser } from '@/stores/auth/types';

export type AuthRole = NonNullable<AuthUser['role']>;

export interface SidebarSubmenu {
  label: string;
  path: string;
  roles?: AuthRole[];
}

export interface SidebarSection {
  title: string;
  base: string;
  icon: React.ReactNode;
  roles?: AuthRole[];
  submenus?: SidebarSubmenu[];
  // Para items simples sin submenús
  path?: string;
}

export interface SidebarConfig {
  [key: string]: SidebarSection;
} 