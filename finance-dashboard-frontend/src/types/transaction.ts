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

export interface SummaryCardProps {
    title: string;
    color: string;
    value: number
}

export interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}