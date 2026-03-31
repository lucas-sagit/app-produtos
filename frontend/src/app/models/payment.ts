export interface Payment {
  id: number;
  service_id: number;
  service?: any;
  amount: number;
  due_date: string;
  paid_at?: string;
  last_paid_at?: string;
  status: 'pending' | 'paid' | 'late';
  created_at?: string;
  updated_at?: string;
}
