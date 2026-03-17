export interface Client {
  id: number;
  inactive: boolean;
  name: string;
  cpf: string;
  cnpj?: string;
  corporate_name?: string;
  phone?: string;
  city?: string;
  number?: string;
  street?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
