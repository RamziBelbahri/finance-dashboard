import { useState, type ChangeEvent } from "react";
import { TRANSACTION_URL, type Transaction, type TransactionType } from "../../types/transaction";
import type { CreateTransactionRequest } from "../../api/transactions";

export default function CreateTransaction({ loadTransactions }: { loadTransactions: () => Promise<Transaction[] | void> }) {
  const [transactionDetails, setTransactionDetails] = useState({
    amount: "",
    description: "",
    date: "",
    type: "EXPENSE" as TransactionType
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;

    setTransactionDetails(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  };

  const handleSubmit = async () => {
    try {
      const newTransaction: CreateTransactionRequest = { ...transactionDetails, amount: Number(transactionDetails.amount), transactionDate: transactionDetails.date };
      await api.post(TRANSACTION_URL, newTransaction);
      await loadTransactions();
      setTransactionDetails(
        {
          amount: "",
          description: "",
          date: "",
          type: "EXPENSE"
        }
      )
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <input name="amount" type="number" value={transactionDetails.amount} onChange={handleChange} placeholder="Amount" />
      <input name="description" type="text" value={transactionDetails.description} onChange={handleChange} placeholder="Description" />
      <input name="date" type="date" value={transactionDetails.date} onChange={handleChange} placeholder="date created" />
      <select name="type" value={transactionDetails.type} onChange={handleChange}>
        <option value="EXPENSE">
          Expense
        </option>
        <option value="INCOME">
          Income
        </option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}