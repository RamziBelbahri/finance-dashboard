import { TRANSACTION_URL, type Transaction, type TransactionSummary, type TransactionType } from "../types/transaction";
import api from "./axios";

export interface CreateTransactionRequest {
    amount: number;
    description: string;
    transactionDate: string;
    type: TransactionType;
}

export const getTransactions = async (transactionType: "ALL" | "INCOME" | "EXPENSE") => {
    const type = (transactionType === "ALL") ? undefined : transactionType;
    const response = await api.get<Transaction[]>(TRANSACTION_URL, { params : { type } });
    return response.data;
}

export const getSummary = async () => {
    const response = await api.get<TransactionSummary>(TRANSACTION_URL + "/summary");
    console.log(response);
    return response.data;
}


export const createTransaction = async (transaction: CreateTransactionRequest) => {
    const response = await api.post(TRANSACTION_URL, transaction);
    return response.data;
}