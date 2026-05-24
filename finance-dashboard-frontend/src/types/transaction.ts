export const TRANSACTION_URL = "/transactions";

export type TransactionType = 
    | "INCOME"
    | "EXPENSE";

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    transactionDate: string;
    type: TransactionType;
}