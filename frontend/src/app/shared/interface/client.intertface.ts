import { Service } from "../services/servico/service";

export interface Client {
  id: number;
  status_client: boolean;
  name: string;
  cpf: string;
  corporate_name?: string;
  cnpj?: string;
  phone?: string;
  city?: string;
  number?: string;
  street?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;

  services?: Service[];
}
