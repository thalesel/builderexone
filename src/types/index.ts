
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  slots_total: number;
  slots_usados: number;
  created_at?: string;
}

export interface SupportNumber {
  id: string;
  nome: string;
  numero: string; // Formato 5511999999999
  ativo: boolean;
}

export interface Site {
  id: string;
  user_id: string;
  slug: string;
  dominio: string;
  razao_social: string;
  cnpj: string;
  missao: string;
  telefones: string;
  email: string;
  instagram: string;
  whatsapp: string;
  sobre: string;
  rodape: string;
  pixel_meta: string;
  meta_tag: string;
  app_id: string;
  link_pagina: string;
  ativo: boolean;
  created_at?: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  tipo: 'plano' | 'slot' | 'live_help';
  valor: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}
