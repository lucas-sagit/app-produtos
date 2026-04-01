export interface Service {
  id: number;
  client_id: number;
  client?: any;
  due_date: Date;
  // due_day?: number;
  plans: string;
  description: string;
  price: number;
  status: 'ativo' | 'suspenso' | 'cancelado';
  started_at?: string;
  created_at?: string;
  updated_at?: string;
}
