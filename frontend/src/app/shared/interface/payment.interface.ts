export interface Payment {
  id: number;
  client_id: number;
  plans: string;
  description: string;
  price: number;
  due_date: Date;
  status: `ativo` | `suspenso` | `cancelado`;
  started_at: string;
  service_id: number;

  payments?: Payment[];
}
