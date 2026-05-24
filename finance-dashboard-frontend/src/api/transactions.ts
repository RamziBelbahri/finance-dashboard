import { TRANSACTION_URL, type Transaction, type TransactionType } from "../types/transaction";
import api from "./axios";

export interface CreateTransactionRequest {
    amount: number;
    description: string;
    transactionDate: string;
    type: TransactionType;
}

export const getTransactions = async () => {
    const response = await api.get<Transaction[]>(TRANSACTION_URL);
    return response.data;
}

export const createTransaction = async (transaction: CreateTransactionRequest) => {
    const response = await api.post(TRANSACTION_URL, transaction);
    return response.data;
}