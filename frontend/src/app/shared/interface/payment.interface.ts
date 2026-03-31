export interface Payment {
  id: number;
  client_id: number;
  plans: string;
  description: string;
  price: number;
  due_date: Date;
  paid_at?: string;
  last_paid_at?: string;
  status: `ativo` | `suspenso` | `cancelado`;
  started_at: string;
  service_id: number;

  payments?: Payment[];
}
