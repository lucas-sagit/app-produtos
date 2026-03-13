export interface Payment {
  id: number;
  amount: number;
  description: string;
  client_id: number;
  created_at?: string;
  updated_at?: string;
}
