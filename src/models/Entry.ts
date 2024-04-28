export type Entry = {
  id: number;
  amount: number;
  date: string;
  currency: string;
  name: string;
  comment?: string;
  categoryId?: number | null;
  images: string[];
};
