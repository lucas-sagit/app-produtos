export interface Payment {
  id: number;
  client_id: number;
  plans: string;
  description: string;
  amount: number;
  due_date: Date;
  status: 'pending' | 'paid' | 'late';
  paid_at: string;
  started_at: string;

  payments?: Payment[];
}
