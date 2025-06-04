// Account type
export type Account = {
  id: string;
  name: string;
  initialBalance: number;
  createdAt: string;
};

// Transaction type
export type Transaction = {
  id: string;
  amount: number;
  date: string;
  fromAccountId: string;
  toAccountId?: string; // for transfers
  description?: string;
  category?: string;
  tags?: string[];
};
