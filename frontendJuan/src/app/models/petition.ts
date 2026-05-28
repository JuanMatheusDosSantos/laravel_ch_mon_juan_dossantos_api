import { PetitionFile } from "./petition-file";

export interface Categoria {
  id: number;
  name: string;
  description?: string;
}
export interface User {
  id: number;
  name: string;
  email?: string;
  role?:string;
  email_verified_at?:Date;
}
export interface Petition {
  id: number;
  title: string;
  description: string;
  destinatary: string;
  user_id?: number;
  category_id?: number;
  signers: number;
  status?: string;
  created_at?: Date;
  files?: PetitionFile[];
  category?: Categoria;
  user?: User;
  user_signers?: User[];
}
