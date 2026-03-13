export interface Payment {
  id: number;
  client_id: number;
  description: string;
  cash: number;
  status: boolean;
  payment_date: string;
}
