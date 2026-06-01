import { useState, type ChangeEvent, type FormEvent } from "react";
import { TRANSACTION_URL, type TransactionType } from "../../types/transaction";
import type { CreateTransactionRequest } from "../../api/transactions";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateTransaction() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newTransaction: CreateTransactionRequest) => {
      return api.post(TRANSACTION_URL, newTransaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"]
      })

      queryClient.invalidateQueries({
        queryKey: ["transactions-summary"]
      })
    }
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction: CreateTransactionRequest = { ...transactionDetails, amount: Number(transactionDetails.amount), transactionDate: transactionDetails.date };
      await mutation.mutateAsync(newTransaction);
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
    <div className="bg-white rounded-xl p-6 shadow mb-6">
      <h2 className="text-xl font-semibold mb-4" >
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border border-gray-300 rounded-lg p-2 mb-4" name="amount" type="number" value={transactionDetails.amount} onChange={handleChange} placeholder="Amount" />
          <input className="w-full border border-gray-300 rounded-lg p-2 mb-4" name="date" type="date" value={transactionDetails.date} onChange={handleChange} placeholder="date created" />
          <input className="w-full border border-gray-300 rounded-lg p-2 mb-4" name="description" type="text" value={transactionDetails.description} onChange={handleChange} placeholder="Description" />
          <select className="w-full border border-gray-300 rounded-lg p-2 mb-4" name="type" value={transactionDetails.type} onChange={handleChange}>
            <option value="EXPENSE">
              Expense
            </option>
            <option value="INCOME">
              Income
            </option>
          </select>
        </div>
        <button type="submit" disabled={mutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">{mutation.isPending ? "Creating..." : "Submit"}</button>
        {
          mutation.error &&
          <p className="text-red-500">
            Failed to create transaction
          </p>
        }
      </form>
    </div>
  );
}