export interface PasswordEntry {
  id: number;
  title: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PasswordRequest = Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>;
