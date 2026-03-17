export interface Payment {
  id: number;
  cash: number;
  description: string;
  client_id: number;
  status?: boolean;
  payment_date?: string;
  created_at?: string;
  updated_at?: string;
}
